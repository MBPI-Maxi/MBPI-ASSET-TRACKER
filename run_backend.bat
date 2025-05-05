@echo off
cd backend

echo Making migrations...
python manage.py makemigrations
IF %ERRORLEVEL% NEQ 0 (
    echo Error during makemigrations. Exiting...
    exit /b %ERRORLEVEL%
)

echo Applying migrations...
python manage.py migrate
IF %ERRORLEVEL% NEQ 0 (
    echo Error during migrate. Exiting...
    exit /b %ERRORLEVEL%
)

echo Starting Django server...
python manage.py runserver