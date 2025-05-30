# backend/Dockerfile
FROM python:3.11.11

# Set working directory inside the container
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# DEBUG THE FILE
RUN ls -l

# Make both scripts executable
RUN chmod +x entrypoint.sh seed.sh

# Set the entrypoint to start the Django app
ENTRYPOINT ["./entrypoint.sh"]
