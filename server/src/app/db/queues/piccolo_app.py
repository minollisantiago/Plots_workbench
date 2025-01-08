"""
Import all of the Tables subclasses in your app here, and register them with
the APP_CONFIG.
"""

from piccolo.conf.apps import AppConfig, table_finder

APP_NAME = "queues"

APP_CONFIG = AppConfig(
    app_name=APP_NAME,
    migrations_folder_path="migrations",
    table_classes=table_finder(modules=["tables"]),
    migration_dependencies=[],
    commands=[],
)
