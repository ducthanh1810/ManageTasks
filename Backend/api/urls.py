from django.urls import path
from . import views

urlpatterns = [
    # User url
    path("users/", views.UserListView.as_view(), name = "list-users"),
    path("users/name/", views.getUsernameView.as_view(), name = "list-usernames"),
    path("users/update/<pk>/", views.UpdateUserView.as_view(), name = "update-user"),
    path("profiles/", views.ProfilesView.as_view(), name = "profiles"),
    path("profile/update/<pk>/", views.UpdateProfileView.as_view(), name = "update-profile"),
    path("profile/update/<pk>", views.UpdateProfileView.as_view(), name = "update-profile"),

    # Events url
    path("events/", views.EventListCreate.as_view(), name = "event-list"),
    path("events/update/<pk>/", views.UpdateEventView.as_view(), name = "update-events"),
    path("events/delete/<int:pk>/", views.EventDelete.as_view(), name = "delete-event"),

    # Task url
    path("tasks/", views.TaskListCreate.as_view(), name = "task-list"),
    path("tasks/type/<pk>/", views.UpdateTypeTaskView.as_view(), name = "update-type-tasks"),
    path("tasks/update/<pk>/", views.UpdateTaskView.as_view(), name = "update-tasks"),
    path("tasks/delete/<int:pk>/", views.TaskDelete.as_view(), name = "delete-task"),
    
    # Absent url
    path("absent/", views.AbsentListCreate.as_view(), name = "absent-list"),
    path("absent/delete/<int:pk>/", views.AbsentDelete.as_view(), name = "delete-absent"),
    path("absent/update/<pk>/", views.UpdateAbsentView.as_view(), name = "update-absent"),

    # Project url
    path("project/<int:pk>", views.ProjectView.as_view(), name = "project"),
    path("projects/", views.ProjectsView.as_view(), name = "projects-list"),
    path("project/contacts/", views.ProjectContactsViewSet.as_view(), name = "project-contacts"),
    path("project/contacts/<int:pk>/", views.UpdateProjectCollaborative.as_view(), name = "update-project-collaborative"),

    # Customerd url
    path("customer/<int:pk>/", views.CustomerView.as_view(), name = "customer"),
    path("customer/<int:pk>", views.CustomerView.as_view(), name = "customer"),
    path("customers/", views.CustomersView.as_view(), name = "customers-list"),
    path("customer/project/", views.CustomerProjectView.as_view(), name = "customer-project"),
    
    # Other url
    path("total/", views.TotalCountView.as_view(), name = "total"),
]