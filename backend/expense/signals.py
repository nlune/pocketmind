import logging
from decimal import Decimal

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from budget.models import Budget
from expense.models import Expense

logger = logging.getLogger(__name__)

TOTAL_BUDGET_CATEGORY_NAME = "Expenses"


@receiver(post_save, sender=Expense)
def update_budget_spend(sender, instance, created, **kwargs):
    if instance.is_recurring:
        logger.debug(f"Recurring expense with amount {instance.amount} - not updating budget.")
        return

    if created:
        logger.debug(f"Signal triggered: New Expense created with amount {instance.amount}")
        try:
            budget = Budget.objects.get(category=instance.category)
            budget.spend += Decimal(instance.amount)
            budget.save()
            logger.debug(f"Budget updated: New spend is {budget.spend}")
        except Budget.DoesNotExist:
            logger.warning(f"No Budget found for category {instance.category}")

        try:
            total_budget = Budget.objects.get(category__name=TOTAL_BUDGET_CATEGORY_NAME)
            total_budget.spend += Decimal(instance.amount)
            total_budget.save()
            logger.debug(f"Total Budget updated: New total spend is {total_budget.spend}")
        except Budget.DoesNotExist:
            logger.warning(f"No Total Budget found with category name '{TOTAL_BUDGET_CATEGORY_NAME}'")


@receiver(pre_save, sender=Expense)
def update_budget_on_update(sender, instance, **kwargs):
    if instance.is_recurring:
        logger.debug(f"Recurring expense with amount {instance.amount} - not updating budget.")
        return

    if instance.pk:
        logger.debug(f"Signal triggered: Expense updated with new amount {instance.amount}")
        old_instance = Expense.objects.get(pk=instance.pk)
        budget = Budget.objects.filter(category=instance.category).first()

        if budget:
            budget.spend -= Decimal(old_instance.amount)
            budget.spend += Decimal(instance.amount)
            budget.save()
            logger.debug(f"Budget updated: New spend after update is {budget.spend}")
