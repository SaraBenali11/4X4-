FROM python:3.11-slim

WORKDIR /app

# Install build dependencies (if any) and pip dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend app
COPY . /app

# Expose port
EXPOSE 5000

CMD ["python", "app.py"]
