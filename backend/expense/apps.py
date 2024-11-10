import logging

from django.apps import AppConfig

logger = logging.getLogger(__name__)


class ExpenseConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "expense"

    def ready(self):
        import expense.signals  # noqa: F401
        logger.info("Expenses signals loaded")
