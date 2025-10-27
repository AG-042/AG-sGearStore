from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class UserProfile(models.Model):
    """UserProfile for fans with teams like ['PSG']"""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorite_teams = models.JSONField(default=list)
    gear_points = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.user.username}'s Profile"
