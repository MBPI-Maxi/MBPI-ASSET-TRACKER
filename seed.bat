@echo off
echo.
echo ========================================
echo Ensure database is migrated before seeding
echo If you encounter errors, skip and rerun.
echo ========================================
echo.

:: Prompt user to seed assets
set /p SEED_ASSETS=Do you want to seed assets (Y/N)? [Default: N]: 
if /I "%SEED_ASSETS%"=="Y" (
    echo.
    echo Seeding assets...

    cd backend
    python manage.py seeder

    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Seeding failed. Exiting...
        exit /b %ERRORLEVEL%
    )

    echo.
    echo Done.
) else (
    cd backend
    echo Skipping asset seeding.
)

echo.