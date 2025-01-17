from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Event, Task, HistoryAbsent, Profile, Customer, Project

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "email", "last_name"]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "style": {"input_type": "password"}
            }
        }
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ "last_name" ,"email"]

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", 'user', 'full_name', 'position', 'image', 'email', 'stage']
        extra_kwargs = {
            "id":
            {
                "read_only": True
            },
            "user":
            {
                "read_only": True
            } 
        }

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "title", "content", "type", "date", "created_at", "author"]
        extra_kwargs = { 
            "id":
            {
                "read_only": True
            },
            "created_at":
            {
                "read_only": True
            },
            "author":
            {
                "read_only": True
            }
        }

class UpdateTypeTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["type", "completed"]


class HistoryAbsentSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryAbsent
        fields = ["id","title", "content", "type", "date", "created_at", "author"]
        extra_kwargs = { 
            "id":
            {
                "read_only": True
            },
            "created_at":
            {
                "read_only": True
            },
            "author":
            {
                "read_only": True
            }
        }

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "email", "phone", "address"]
        extra_kwargs = { 
            "id":
            {
                "read_only": True
            }
        }

class ProjectSerializer(serializers.ModelSerializer):
    tasks = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='id'
    )
    collaborative = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='id'
    )
    class Meta:
        model = Project
        fields = ["id", "title", "description", "customer", "expiration_date", "completed" , "image", "tasks", "collaborative"]
        extra_kwargs = { 
            "id":
            {
                "read_only": True
            }
        }

class ProjectNotRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "title", "description", "customer", "image","expiration_date", "completed"]
        extra_kwargs = { 
            "id":
            {
                "read_only": True
            }
        }

class TaskSerializer(serializers.ModelSerializer):
    project_set = ProjectNotRelationshipSerializer(many=True, read_only=True)
    users = ProfileSerializer(many=True, read_only=True)
    class Meta:
        model = Task
        fields = ["id", "title", "content", "type", "link", "link_image", "date", "created_at", "users", "completed", "project_set"]
        extra_kwargs = { 
            "id":
            {
                "read_only": True
            },
            "users": {
                "read_only": True
            },
            "project_set": {
                "read_only": True
            },
            "created_at":
            {
                "read_only": True
            },
        }