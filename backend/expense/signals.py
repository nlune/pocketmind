import logging
from decimal import Decimal

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from budget.models import Budget
from expense.models import Expense

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Expense)
def update_budget_spend(sender, instance, created, **kwargs):
    if created:
        logger.debug(f"Signal triggered: New Expense created with amount {instance.amount}")
        try:
            budget = Budget.objects.get(category=instance.category)
            budget.spend += Decimal(instance.amount)
            budget.save()
            logger.debug(f"Budget updated: New spend is {budget.spend}")
        except Budget.DoesNotExist:
            logger.warning(f"No Budget found for category {instance.category}")

@receiver(pre_save, sender=Expense)
def update_budget_on_update(sender, instance, **kwargs):
    if instance.pk:
        logger.debug(f"Signal triggered: Expense updated with new amount {instance.amount}")
        old_instance = Expense.objects.get(pk=instance.pk)
        budget = Budget.objects.filter(category=instance.category).first()

        if budget:
            budget.spend -= Decimal(old_instance.amount)
            budget.spend += Decimal(instance.amount)
            budget.save()
            logger.debug(f"Budget updated: New spend after update is {budget.spend}")