from application.models import Employee
from copy import deepcopy
from decimal import Decimal, ROUND_HALF_UP
from django.conf import settings
from django.utils import timezone
from django.utils.timezone import localtime
from django.db.models.query import QuerySet
from datetime import datetime, time, date
from rest_framework.pagination import PageNumberPagination
from rest_framework.serializers import Serializer
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from typing import Type, Optional, Tuple


def convert_datefield_to_datetime_field(
    start_date: date, 
    end_date: date
) -> Tuple[datetime, datetime]:
    """
    Converts date objects into timezone-aware datetime objects representing
    the full span of each day.

    Parameters:
        start_date (date): The starting date (e.g., from a DateField).
        end_date (date): The ending date (e.g., from a DateField).

    Returns:
        tuple: A tuple containing two timezone-aware datetime objects:
            - start_datetime: start_date at 00:00:00 (start of the day)
            - end_datetime: end_date at 23:59:59.999999 (end of the day)
    
    This is useful when filtering datetime fields (e.g., updated_at) using date ranges.
    """
    
    start_datetime = timezone.make_aware(
        datetime.combine(start_date, time.min)
    )
    end_datetime = timezone.make_aware(
        datetime.combine(end_date, time.max)
    )
    
    return (
        start_datetime,
        end_datetime
    )
    
def convert_timestamp(datetimefield: datetime) -> str:
    return localtime(datetimefield).strftime(r"%Y-%m-%d %I:%M%p")

def generate_name(asset_employee_id: Optional[Employee]) -> str:
    try:
        first_name = asset_employee_id.first_name
        last_name = asset_employee_id.last_name
    except Exception:
        raise ValueError("ID does not contain first_name and last_name")
    
    return f"{first_name} {last_name}" if asset_employee_id else "N/A"

def create_pagination(
    page_instance: Type[PageNumberPagination],
    serializer_instance: Type[Serializer],
    queryset: QuerySet,
    request_object: Request,
    view_instance: APIView,
) -> Response: 
    """
    Paginate a queryset and return a paginated response serialized with the given serializer.

    Args:
        page_instance (Type[PageNumberPagination]): Pagination class to instantiate and use.
        serializer_instance (Type[Serializer]): Serializer class to instantiate for the paginated data.
        queryset (QuerySet): Django queryset to paginate.
        request_object (Request): The current request object (used by paginator).
        view_instance (APIView): The view instance that calls this function (used by paginator).

    Returns:
        Response: A DRF paginated Response object with serialized data.
    """

    paginator = page_instance()
    paginated_values = paginator.paginate_queryset(queryset, request_object, view=view_instance)
    
    serializer = serializer_instance(paginated_values, many=True)
    original_serializer_data = serializer.data
    serializer_data_copy = deepcopy(original_serializer_data)
    
    for asset in serializer_data_copy:
        qr_code_image = asset.get("qr_code_image")
        
        if qr_code_image:
            asset["qr_code_image"] = f"{settings.LOCAL_SERVER}{qr_code_image}"
    
    return paginator.get_paginated_response(serializer_data_copy)

def straight_line_computation(
        purchased_price: Decimal, 
        useful_life: int,  
        asset_age_years: Decimal
    ):
        annual_depreciation = purchased_price / useful_life
        depreciated_value = annual_depreciation * asset_age_years
        current_value = purchased_price - depreciated_value
        
        # calculate percentage
        annual_depreciation_pct = (
            annual_depreciation / purchased_price * 100
        ).quantize(
            Decimal("0.1"), 
            rounding=ROUND_HALF_UP
        )
        current_depreciation_pct = (
            depreciated_value / purchased_price * 100
        ).quantize(
            Decimal("0.1"), 
            rounding=ROUND_HALF_UP
        )
        
        return {
            "original_cost": purchased_price,
            "asset_age_years": round(asset_age_years, 2),
            "annual_depreciation": round(annual_depreciation, 2),
            "annual_depreciation_pct": f"{annual_depreciation_pct}%",
            "depreciated_value": round(depreciated_value, 2),
            "current_depreciation_pct": f"{current_depreciation_pct}%",
            "current_value": round(current_value, 2),
        }

def double_declining_balance(
    purchased_price: Decimal,
    useful_life: int,
    asset_age_years: Decimal
):
    depreciation_rate = Decimal(2) / Decimal(useful_life)
    current_value = purchased_price
    depreciated_value = Decimal(0)
    full_years = int(asset_age_years)
    last_calculated_annual_depreciation = Decimal(0) # To store the annual depreciation for the current period

    for year in range(full_years):
        annual_depreciation = current_value * depreciation_rate
        # Ensure depreciation doesn't reduce value below salvage (implied 0 here)
        if current_value - annual_depreciation < 0:
            annual_depreciation = current_value # Depreciate only down to zero
        last_calculated_annual_depreciation = annual_depreciation
        depreciated_value += annual_depreciation
        current_value -= annual_depreciation

    # Prorated depreciation for the fractional year
    remaining_fraction = asset_age_years - full_years
    if remaining_fraction > 0:
        partial_depreciation = (current_value * depreciation_rate) * remaining_fraction
        # Ensure partial depreciation doesn't reduce value below salvage
        if current_value - partial_depreciation < 0:
            partial_depreciation = current_value
        last_calculated_annual_depreciation = partial_depreciation # This is the "annual" depreciation for the partial year
        depreciated_value += partial_depreciation
        current_value -= partial_depreciation
    else:
        # If no fractional year, and full_years > 0, then last_calculated_annual_depreciation
        # already holds the value for the last full year.
        # If asset_age_years is 0, last_calculated_annual_depreciation remains 0.
        pass

    current_depreciation_pct = (
        depreciated_value / purchased_price * 100
    ).quantize(
        Decimal('0.1'), rounding=ROUND_HALF_UP
    )

    # Calculate annual_depreciation_pct based on the last calculated annual depreciation
    annual_depreciation_pct = (
        last_calculated_annual_depreciation / purchased_price * 100
    ).quantize(
        Decimal("0.1"),
        rounding=ROUND_HALF_UP
    ) if purchased_price != 0 else Decimal(0)


    return {
        "original_cost": round(purchased_price, 2),
        "asset_age_years": round(asset_age_years, 2),
        "depreciation_rate": f"{(depreciation_rate * 100).quantize(Decimal('0.1'))}%",
        "annual_depreciation": round(last_calculated_annual_depreciation, 2), # New
        "annual_depreciation_pct": f"{annual_depreciation_pct}%", # New
        "depreciated_value": round(depreciated_value, 2),
        "current_depreciation_pct": f"{current_depreciation_pct}%",
        "current_value": round(max(current_value, 0), 2),
    }

def sum_of_years_digits(
    purchased_price: Decimal,
    useful_life: int,
    asset_age_years: Decimal
):
    total_years = useful_life
    sum_of_years = sum(range(1, total_years + 1))
    depreciated_value = Decimal(0)
    current_value = purchased_price
    full_years = int(asset_age_years)
    last_calculated_annual_depreciation = Decimal(0) # To store the annual depreciation for the current period

    for year in range(1, full_years + 1):
        year_factor = (total_years - (year - 1)) / sum_of_years
        annual_depreciation = purchased_price * Decimal(year_factor)
        last_calculated_annual_depreciation = annual_depreciation
        depreciated_value += annual_depreciation
        current_value -= annual_depreciation

    # Fractional year adjustment
    remaining_fraction = asset_age_years - full_years

    if remaining_fraction > 0 and full_years < useful_life:
        year_factor = (total_years - full_years) / sum_of_years
        partial_depreciation = purchased_price * Decimal(year_factor) * remaining_fraction
        last_calculated_annual_depreciation = partial_depreciation # This is the "annual" depreciation for the partial year
        depreciated_value += partial_depreciation
        current_value -= partial_depreciation
    else:
        # If no fractional year, and full_years > 0, then last_calculated_annual_depreciation
        # already holds the value for the last full year.
        # If asset_age_years is 0, last_calculated_annual_depreciation remains 0.
        pass

    current_depreciation_pct = (
        depreciated_value / purchased_price * 100
    ).quantize(
            Decimal('0.1'),
            rounding=ROUND_HALF_UP
    )

    # Calculate annual_depreciation_pct based on the last calculated annual depreciation
    annual_depreciation_pct = (
        last_calculated_annual_depreciation / purchased_price * 100
    ).quantize(
        Decimal("0.1"),
        rounding=ROUND_HALF_UP
    ) if purchased_price != 0 else Decimal(0)


    return {
        "original_cost": round(purchased_price, 2),
        "asset_age_years": round(asset_age_years, 2),
        "annual_depreciation": round(last_calculated_annual_depreciation, 2), # New
        "annual_depreciation_pct": f"{annual_depreciation_pct}%", # New
        "depreciated_value": round(depreciated_value, 2),
        "current_depreciation_pct": f"{current_depreciation_pct}%",
        "current_value": round(max(current_value, 0), 2),
    }

### OLD COMPUTATION ###
# def double_declining_balance(
#     purchased_price: Decimal, 
#     useful_life: int, 
#     asset_age_years: Decimal
# ):
#         depreciation_rate = Decimal(2) / Decimal(useful_life)
#         current_value = purchased_price
#         depreciated_value = Decimal(0)
#         full_years = int(asset_age_years)

#         for year in range(full_years):
#             annual_depreciation = current_value * depreciation_rate
#             depreciated_value += annual_depreciation
#             current_value -= annual_depreciation

#         # Prorated depreciation for the fractional year
#         remaining_fraction = asset_age_years - full_years
#         if remaining_fraction > 0:
#             partial_depreciation = (current_value * depreciation_rate) * remaining_fraction
#             depreciated_value += partial_depreciation
#             current_value -= partial_depreciation

#         current_depreciation_pct = (
#             depreciated_value / purchased_price * 100
#         ).quantize(
#             Decimal('0.1'), rounding=ROUND_HALF_UP
#         )

#         return {
#             "original_cost": round(purchased_price, 2),
#             "asset_age_years": round(asset_age_years, 2),
#             "depreciation_rate": f"{(depreciation_rate * 100).quantize(Decimal('0.1'))}%",
#             "depreciated_value": round(depreciated_value, 2),
#             "current_depreciation_pct": f"{current_depreciation_pct}%",
#             "current_value": round(max(current_value, 0), 2),
#         }
        
# def sum_of_years_digits(
#     purchased_price: Decimal, 
#     useful_life: int, 
#     asset_age_years: Decimal
# ):
#         total_years = useful_life
#         sum_of_years = sum(range(1, total_years + 1))
#         depreciated_value = Decimal(0)
#         current_value = purchased_price
#         full_years = int(asset_age_years)

#         for year in range(1, full_years + 1):
#             year_factor = (total_years - (year - 1)) / sum_of_years
#             annual_depreciation = purchased_price * Decimal(year_factor)
#             depreciated_value += annual_depreciation
#             current_value -= annual_depreciation

#         # Fractional year adjustment
#         remaining_fraction = asset_age_years - full_years
        
#         if remaining_fraction > 0 and full_years < useful_life:
#             year_factor = (total_years - full_years) / sum_of_years
#             partial_depreciation = purchased_price * Decimal(year_factor) * remaining_fraction
#             depreciated_value += partial_depreciation
#             current_value -= partial_depreciation

#         current_depreciation_pct = (
#             depreciated_value / purchased_price * 100
#         ).quantize(
#                 Decimal('0.1'), 
#                 rounding=ROUND_HALF_UP
#         )

#         return {
#             "original_cost": round(purchased_price, 2),
#             "asset_age_years": round(asset_age_years, 2),
#             "depreciated_value": round(depreciated_value, 2),
#             "current_depreciation_pct": f"{current_depreciation_pct}%",
#             "current_value": round(max(current_value, 0), 2),
#         }
        
