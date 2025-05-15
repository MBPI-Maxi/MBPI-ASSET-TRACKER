from django.utils import timezone
from datetime import datetime, time
from django.utils.timezone import localtime


def convert_datefield_to_datetime_field(start_date, end_date):
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
    
def convert_timestamp(datetimefield):
    return localtime(datetimefield).strftime(r"%Y-%m-%d %I:%M%p")

def generate_name(asset_employee_id):
    try:
        first_name = asset_employee_id.first_name
        last_name = asset_employee_id.last_name
    except Exception:
        raise ValueError("ID does not contain first_name and last_name")
    
    return f"{first_name} {last_name}" if asset_employee_id else "N/A"
