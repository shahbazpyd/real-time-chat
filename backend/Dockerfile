# Stage 1: Build stage with full dependencies
FROM python:3.11-slim as builder

WORKDIR /app

# Set environment variables to prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install build-time dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /app/wheels -r requirements.txt


# Stage 2: Final stage with runtime dependencies
FROM python:3.11-slim

WORKDIR /app

# Copy pre-built wheels from the builder stage
COPY --from=builder /app/wheels /wheels
COPY requirements.txt .
RUN pip install --no-cache /wheels/*

# Copy the application code
COPY . .

# Expose the port the app will run on. Render will set the $PORT env var.
# We don't need to EXPOSE here as Render manages port mapping.

# The command to run the application will be set in Render's dashboard.
# It will be something like: ./build.sh && daphne -b 0.0.0.0 -p  backend.asgi:application
