from django.test import TestCase

# Create your tests here.
from django.contrib.auth import get_user_model

User = get_user_model()

# Check all users
users = User.objects.all()
for user in users:
    print(user.email, user.is_active, user.role)

# Check a specific user
user = User.objects.get(email='regularuser@example.com')
print(user.check_password('password123'))  # Should return True if password is correct
