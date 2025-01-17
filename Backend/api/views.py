from django.shortcuts import render
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework import generics, status
from django.views.generic.edit import UpdateView 
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, EventSerializer, TaskSerializer, HistoryAbsentSerializer, UpdateUserSerializer, UpdateTypeTaskSerializer
from .serializers import CustomerSerializer, ProfileSerializer, ProjectSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import Task, Event, HistoryAbsent, Project, Customer, Profile, UserTask
from datetime import date, timedelta, datetime
from typing import List

# ---------------------- User API Views ----------------------
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        type = self.request.GET.get('type')
        user = User.objects.all()
        if (type == 'getUsers'):
            user = User.objects.values('last_name').distinct()
        return user
    
class getUsernameView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, *args, **kwargs):
        users = User.objects.values("id", 'last_name').distinct()
        return Response(users, 200)

class UpdateUserView(generics.UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]
    fields = ['last_name', 'email']

    def get_queryset(self):
        user = User.objects.filter(username=self.request.user)
        return user
    
    def perform_update(self, serializer):
        serializer.save()

class GetIdentity(APIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = Profile.objects.filter(user=self.request.user).first()
        return Response(ProfileSerializer(user).data, status=status.HTTP_200_OK)

class ProfilesView(APIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = Profile.objects.all()
        return Response(ProfileSerializer(queryset, many=True).data, status=status.HTTP_200_OK)

class UpdateProfileView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()
        
# ---------------------- Event API Views ----------------------
class EventListCreate(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Event.objects.all().order_by('-date')
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')
        if (start and end is not None):
            queryset = Event.objects.filter(date__gte = (date.today()-timedelta(days=1))).order_by('date')[int(start):int(end)]
        return queryset
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author = self.request.user)
        else:
            print(serializer.errors)

class EventDelete(generics.DestroyAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(author = user)
    
class UpdateEventView(generics.UpdateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    fields = ['title', 'content', 'type', 'date']

    def get_queryset(self):
            user = Event.objects.filter(author=self.request.user)
            return user
    
    def perform_update(self, serializer):
        serializer.save()

# ---------------------- Task API Views ----------------------
class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.all().order_by('-date')
        completed_eq = self.request.GET.get('completed_eq', 'false')
        date_gte = self.request.GET.get('date_gte')
        project_id = self.request.GET.get('project_eq')
        task_id = self.request.GET.get('id')

        if task_id is not None:
            queryset = queryset.filter(id=task_id)
            return queryset
        if project_id:
            queryset = Project.objects.filter(id=project_id).first().tasks.all()
        if completed_eq.lower() == 'false':
            queryset = queryset.filter(completed=False).order_by('-date')
        if date_gte is not None:
            try:
                queryset = queryset.filter(date__gte=date_gte)
            except:
                pass

        return queryset
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

class TaskDelete(generics.DestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.all()
    
# class UpdateTaskView(generics.UpdateAPIView):
#     serializer_class = TaskSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#             tasks = Task.objects.all()
#             return tasks
    
class UpdateTaskView(APIView):
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]
    
    def put(self, request, pk, format=None):
        data = request.data
        snippet = Task.objects.get(pk=pk)
        if (request.data.get('title')):
            snippet.title = data.get('title')
        if (data.get('content')):
            snippet.content = data.get('content')
        if (data.get('type')):
            try:
                snippet.type = dict(data.get('type'))["value"]
            except:
                snippet.type = data.get('type')

        if (data.get('users')):
            list_users = data.get('users')
            if list_users:
                snippet.users.clear()
                for user in list_users:
                    snippet.users.add(Profile.objects.get(user=user["value"]))
        if (data.get('date')):
            snippet.date = data.get('date')
        if (data.get('completed')):
            snippet.completed = data.get('completed')
        if (data.get('project')):
            snippet.project_set.clear()
            snippet.project_set.add(Project.objects.get(id=data.get('project')))
        snippet.save()
        return Response(status=status.HTTP_200_OK)

   

class UpdateTypeTaskView(generics.UpdateAPIView):
    serializer_class = UpdateTypeTaskSerializer
    permission_classes = [IsAuthenticated]
    fields = ["type"]
    def get_queryset(self):
            tasks = Task.objects.all()
            return tasks

    def perform_update(self, serializer):
        serializer.save()


class ProjectTasksView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        project = Project.objects.get(id=pk)
        tasks = project.tasks.all()
        total : List[UserTask] = []
        serializer = TaskSerializer(tasks, many=True)
        count_tasks = len(serializer.data)
        for task in serializer.data:
            users = task.get('users')
            for user in users:
                isHave = False
                for user_task in total:
                    if user_task.label == user.get('full_name'):
                        user_task.value += 1
                        isHave = True
                        break
                if not isHave:
                    total.append(UserTask(user.get('full_name'), 1))
                                 
        data = {
            "total": count_tasks,
            "total_working": sum(x.value for x in total if x.value > 0),
            "tasks": [x.__dict__ for x in total]
        }
        return Response(data, status=status.HTTP_200_OK)


# ---------------------- Absent API Views ----------------------
class AbsentListCreate(generics.ListCreateAPIView):
    serializer_class = HistoryAbsentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = HistoryAbsent.objects.all().order_by('-date')
        start = self.request.GET.get('start')
        end = self.request.GET.get('end')
        date = self.request.GET.get('date')

        if (start and end is not None):
            queryset = HistoryAbsent.objects.all().order_by('-date')[int(start):int(end)]
        if (date is not None):
            queryset = HistoryAbsent.objects.filter(date=datetime.now())
        return queryset
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author = self.request.user)
        else:
            print(serializer.errors)

class AbsentDelete(generics.DestroyAPIView):
    serializer_class = HistoryAbsentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return HistoryAbsent.objects.filter(author = user)
    
class UpdateAbsentView(generics.UpdateAPIView):
    serializer_class = HistoryAbsentSerializer
    permission_classes = [IsAuthenticated]
    fields = ['title', 'content', 'type', 'date']

    def get_queryset(self):
            user = HistoryAbsent.objects.filter(author=self.request.user)
            return user
    
    def perform_update(self, serializer):
        serializer.save()
        
class TotalCountView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        task_count = Task.objects.filter(completed=False).exclude(type = "Done").count()
        absent_count = HistoryAbsent.objects.filter(date__gte = (date.today()-timedelta(days=1))).count()
        event_count = Event.objects.filter(date__gte = (date.today()-timedelta(days=1))).count()
        return Response({"task_count": task_count, "absent_count": absent_count, "event_count": event_count}, 200)
    
# ---------------------- Customer API Views ----------------------
class CustomersView(generics.ListCreateAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Customer.objects.all().order_by('-created_at')
        start = self.request.GET.get('start', None)
        end = self.request.GET.get('end', None)
        name_contains = self.request.GET.get('name_contains')
        if (start and end is not None):
            queryset = Customer.objects.all().order_by('created_at')[int(start):int(end)]
        if name_contains:
            queryset = Customer.objects.filter(name__startswith=name_contains)
        return queryset
    
    def perform_create(self, serializer):
        serializer.save()          

class CustomerView(APIView):
    def get(self, request, pk):
        customer = Customer.objects.get(id=pk)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        customer = Customer.objects.get(id=pk)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

class CustomerProjectView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Project.objects.all().order_by('-created_at')
        start = self.request.GET.get('start', None)
        end = self.request.GET.get('end', None)
        customer_id = self.request.GET.get('customer.id_eq', None)
        if customer_id:
            queryset = Project.objects.filter(customer_id=customer_id)
            if start and end:
                queryset = Project.objects.filter(customer_id=customer_id)[int(start):int(end)]
        return queryset
# ---------------------- Project API Views ----------------------

class ProjectsView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Project.objects.all().order_by('-created_at')
        start = self.request.GET.get('start', None)
        end = self.request.GET.get('end', None)
        if start and end:
            queryset = Project.objects.all().order_by('-created_at')[int(start):int(end)]
        return queryset

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(leader = profile)

class ProjectView(APIView):
    def get(self, request, pk):
        project = Project.objects.get(id=pk)
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        project = Project.objects.get(id=pk)
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectContactsViewSet(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        start = self.request.GET.get('start', None)
        end = self.request.GET.get('end', None)
        project_id = self.request.GET.get('project.id_eq', None)
        if project_id:
            queryset = Project.objects.filter(id=project_id).first().collaborative.all()
            if start and end:
                queryset = Project.objects.filter(id=project_id).first().collaborative.all()[int(start):int(end)]
        return Response(ProfileSerializer(queryset, many=True).data, status=status.HTTP_200_OK)

class UpdateProjectCollaborative(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        collaborative_id = request.data.get('collaborative_id')
        action = request.data.get('action')
        project = Project.objects.get(id=pk)
        if action == "add":
            project.collaborative.add(Profile.objects.get(id=collaborative_id))
        elif action == "remove":
            project.collaborative.remove(Profile.objects.get(id=collaborative_id))
        project.save()
        return Response(status=status.HTTP_200_OK)