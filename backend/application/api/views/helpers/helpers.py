from application.models import Employee
from django.utils import timezone
from datetime import datetime, time, date
from django.utils.timezone import localtime
from django.db.models.query import QuerySet
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
    
    return paginator.get_paginated_response(serializer.data)

    