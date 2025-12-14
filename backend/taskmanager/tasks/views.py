from rest_framework.permissions import SAFE_METHODS
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .permissions import IsAdminOrManager


from .models import Client, ClientRequest, Task, TaskComment, TaskLog
from .serializers import (
    ClientSerializer,
    ClientRequestSerializer,
    TaskSerializer,
    TaskCommentSerializer,
    TaskLogSerializer,
)

# =======================
# CLIENT
# =======================
class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminOrManager()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ClientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]


# =======================
# CLIENT REQUEST
# =======================
class ClientRequestListCreateView(generics.ListCreateAPIView):
    queryset = ClientRequest.objects.all()
    serializer_class = ClientRequestSerializer
    permission_classes = [IsAuthenticated]


class ClientRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ClientRequest.objects.all()
    serializer_class = ClientRequestSerializer
    permission_classes = [IsAuthenticated]


# =======================
# TASK
# =======================
class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminOrManager()]

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]


# =======================
# TASK COMMENTS
# =======================
class TaskCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TaskComment.objects.filter(task_id=self.kwargs["task_id"])

    def perform_create(self, serializer):
        task = get_object_or_404(Task, id=self.kwargs["task_id"])
        serializer.save(task=task, user=self.request.user)


# =======================
# TASK LOGS
# =======================
class TaskLogListView(generics.ListAPIView):
    serializer_class = TaskLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TaskLog.objects.filter(task_id=self.kwargs["task_id"])
