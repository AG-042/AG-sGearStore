from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import UserProfile


class Command(BaseCommand):
    """Seed test users for auth"""

    help = "Seed test users for auth"

    def handle(self, *args, **options):
        users_data = [
            {
                "username": "fan1",
                "email": "fan1@example.com",
                "password": "password123",
                "favorite_teams": ["Arsenal"]
            },
            {
                "username": "fan2",
                "email": "fan2@example.com",
                "password": "password123",
                "favorite_teams": ["PSG"]
            }
        ]

        created_count = 0
        for user_data in users_data:
            if not User.objects.filter(username=user_data["username"]).exists():
                user = User.objects.create_user(
                    username=user_data["username"],
                    email=user_data["email"],
                    password=user_data["password"]
                )
                UserProfile.objects.create(
                    user=user,
                    favorite_teams=user_data["favorite_teams"]
                )
                created_count += 1

        if created_count > 0:
            self.stdout.write(self.style.SUCCESS(f'Created {created_count} test users'))
        else:
            self.stdout.write('All test users already exist')
