from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
# Create your models here.

class Event(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    type = models.CharField(max_length=50)
    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")

    def __str__(self):
        return self.title

class Profile(models.Model):
    STAGE_CHOICES = (
        ("NEW", "NEW"),
        ("QUALIFIED", "QUALIFIED"),
        ("UNQUALIFIED", "UNQUALIFIED"),
        ("WON", "WON"),
        ("NEGOTIATION", "NEGOTIATION"),
        ("LOST", "LOST"),
        ("INTERESTED", "INTERESTED"),
        ("CONTACTED", "CONTACTED"),
        ("CHURNED", "CHURNED"),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=300, null=True)
    position = models.CharField(max_length=300, null=True)
    email = models.CharField(max_length=100, null=True)
    image = models.ImageField(upload_to="images", default="default.jpg")
    stage = models.CharField(max_length=50, default="NEW", choices=STAGE_CHOICES)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.user

def create_user_profile(sender: User, instance, created, **kwargs):
    print(instance)
    if created:
        Profile.objects.create(user=instance)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
    
class Task(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(null=True)
    type = models.CharField(max_length=50)
    link = models.TextField(null=True)
    link_image = models.TextField(null=True)
    date = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(Profile)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
class HistoryAbsent(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    type = models.CharField(max_length=50)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="absent")

    def __str__(self):
        return self.title
    
class Customer(models.Model):
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=100, db_index=True)
    phone = models.CharField(max_length=100)
    address = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="projects")
    expiration_date = models.DateTimeField()
    image = models.ImageField(upload_to="images", default="default.jpg")
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    tasks = models.ManyToManyField(Task)
    collaborative = models.ManyToManyField(Profile)
    leader = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="leader")

    def __str__(self):
        return self.title

class UserTask():
    def __init__(self, user: str, total: int):
        self.label = user
        self.value = total
    