#!/bin/bash

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "Creating virtual environment..."
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
fi

# Start the FastAPI server
echo "Starting Granada Search Engine API..."
uvicorn search_engine:app --host 0.0.0.0 --port 8000 --reload