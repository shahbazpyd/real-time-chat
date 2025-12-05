#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Start the Daphne server
exec daphne -b 0.0.0.0 -p 8000 backend.asgi:application