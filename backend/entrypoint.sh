#!/bin/bash

echo "Making migrations..."
python manage.py makemigrations
if [ $? -ne 0 ]; then
  echo "Error during makemigrations. Exiting..."
  exit 1
fi

echo "Applying migrations..."
python manage.py migrate
if [ $? -ne 0 ]; then
  echo "Error during migrate. Exiting..."
  exit 1
fi

echo "Running seed script..."
bash seed.sh  # Create this file or adjust if seed logic is elsewhere
if [ $? -ne 0 ]; then
  echo "Error during seed script. Exiting..."
  exit 1
fi

echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
