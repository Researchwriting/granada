import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module
os.environ.setdefault('CELERY_CONFIG', 'tasks.celeryconfig')

app = Celery('granada')

# Load task modules from all registered apps
app.config_from_object('tasks.celeryconfig')

# Configure periodic tasks
app.conf.beat_schedule = {
    'run-daily-search': {
        'task': 'tasks.search_tasks.run_daily_search',
        'schedule': crontab(hour=1, minute=0),  # Run at 1:00 AM every day
    },
    'verify-opportunities': {
        'task': 'tasks.verification_tasks.verify_opportunities',
        'schedule': crontab(hour='*/3', minute=30),  # Run every 3 hours
    },
    'cleanup-old-opportunities': {
        'task': 'tasks.maintenance_tasks.cleanup_old_opportunities',
        'schedule': crontab(day_of_week=0, hour=2, minute=0),  # Run at 2:00 AM every Sunday
    },
}

app.conf.timezone = 'UTC'

if __name__ == '__main__':
    app.start()