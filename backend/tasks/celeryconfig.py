import os

# Broker settings
broker_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

# Result backend
result_backend = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

# Task serialization format
task_serializer = 'json'

# Result serialization format
result_serializer = 'json'

# Timezone
timezone = 'UTC'

# Enable UTC
enable_utc = True

# Task routes
task_routes = {
    'tasks.search_tasks.*': {'queue': 'search'},
    'tasks.verification_tasks.*': {'queue': 'verification'},
    'tasks.maintenance_tasks.*': {'queue': 'maintenance'},
}

# Task time limits
task_time_limit = 1800  # 30 minutes
task_soft_time_limit = 1500  # 25 minutes

# Maximum number of tasks a worker can execute before it's replaced
worker_max_tasks_per_child = 200

# Concurrency
worker_concurrency = 4

# Task acks late
task_acks_late = True

# Task reject on worker lost
task_reject_on_worker_lost = True

# Task default rate limit
task_default_rate_limit = '10/m'  # 10 tasks per minute

# Imports
imports = (
    'tasks.search_tasks',
    'tasks.verification_tasks',
    'tasks.maintenance_tasks',
)