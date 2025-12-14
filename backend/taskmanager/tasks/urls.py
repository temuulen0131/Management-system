from django.urls import path
from .views import (
    TaskListCreateView,
    TaskDetailView,
    TaskCommentListCreateView,
    TaskLogListView,
)

urlpatterns = [
    path("tasks/", TaskListCreateView.as_view()),
    path("tasks/<int:pk>/", TaskDetailView.as_view()),
    path("tasks/<int:task_id>/comments/", TaskCommentListCreateView.as_view()),
    path("tasks/<int:task_id>/logs/", TaskLogListView.as_view()),
]
