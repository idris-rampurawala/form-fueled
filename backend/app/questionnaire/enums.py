from django.db import models


class QuestionTypesEnum(models.TextChoices):
    TEXT = 'TEXT'  # Paragraph question
    MCSS = 'MCSS'  # Mutiple choice single select question
