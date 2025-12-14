from django.urls import path
from .views import (
    DepartmentListCreateView,
    DepartmentDetailView,
    ClientListCreateView,
    ClientDetailView,
    ClientRequestListCreateView,
    ClientRequestDetailView,
    TaskListCreateView,
    TaskDetailView,
    TaskCommentListCreateView,
    TaskLogListView,
)
from .auth_views import (
    register_user,
    login_user,
    logout_user,
    current_user,
    UserListView,
    UserDetailView,
)

urlpatterns = [
    # Authentication endpoints
    path("auth/register/", register_user, name="auth-register"),
    path("auth/login/", login_user, name="auth-login"),
    path("auth/logout/", logout_user, name="auth-logout"),
    path("auth/me/", current_user, name="auth-current-user"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    
    # Department endpoints
    path("departments/", DepartmentListCreateView.as_view(), name="department-list"),
    path("departments/<int:pk>/", DepartmentDetailView.as_view(), name="department-detail"),
    
    # Client endpoints
    path("clients/", ClientListCreateView.as_view(), name="client-list"),
    path("clients/<int:pk>/", ClientDetailView.as_view(), name="client-detail"),
    
    # Client Request endpoints
    path("client-requests/", ClientRequestListCreateView.as_view(), name="clientrequest-list"),
    path("client-requests/<int:pk>/", ClientRequestDetailView.as_view(), name="clientrequest-detail"),
    
    # Task endpoints
    path("tasks/", TaskListCreateView.as_view(), name="task-list"),
    path("tasks/<int:pk>/", TaskDetailView.as_view(), name="task-detail"),
    path("tasks/<int:task_id>/comments/", TaskCommentListCreateView.as_view(), name="task-comments"),
    
    # Task logs
    path("task-logs/", TaskLogListView.as_view(), name="task-log-list"),
]
