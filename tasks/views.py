from rest_framework.permissions import SAFE_METHODS
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .permissions import IsAdminOrManager


from .models import Client, ClientRequest, Department, Task, TaskComment, TaskLog
from .serializers import (
    ClientSerializer,
    ClientRequestSerializer,
    DepartmentSerializer,
    TaskSerializer,
    TaskCommentSerializer,
    TaskLogSerializer,
)

# =======================
# DEPARTMENT
# =======================
class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]


# =======================
# CLIENT
# =======================
class ClientListCreateView(generics.ListCreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]


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

    def perform_create(self, serializer):
        instance = serializer.save(created_by=self.request.user)
        
        # Create log for task creation
        TaskLog.objects.create(
            task=instance,
            user=self.request.user,
            action_type='STATUS_CHANGE',
            old_value='',
            new_value='pending'
        )


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_update(self, serializer):
        # Get the old instance to compare changes
        old_instance = self.get_object()
        old_status = old_instance.status
        old_assigned_to = old_instance.assigned_to
        
        # Save the updated instance
        instance = serializer.save()
        
        # Create logs for changes
        if old_status != instance.status:
            TaskLog.objects.create(
                task=instance,
                user=self.request.user,
                action_type='STATUS_CHANGE',
                old_value=old_status,
                new_value=instance.status
            )
        
        if old_assigned_to != instance.assigned_to:
            old_name = f'{old_assigned_to.first_name} {old_assigned_to.last_name}' if old_assigned_to else 'Unassigned'
            new_name = f'{instance.assigned_to.first_name} {instance.assigned_to.last_name}' if instance.assigned_to else 'Unassigned'
            
            TaskLog.objects.create(
                task=instance,
                user=self.request.user,
                action_type='ASSIGNMENT_CHANGE',
                old_value=old_name,
                new_value=new_name
            )


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
        queryset = TaskLog.objects.all().order_by('-created_at')
        task_id = self.request.query_params.get('task_id', None)
        
        if task_id:
            queryset = queryset.filter(task_id=task_id)
        
        return queryset


# =======================
# TASK LOGS
# =======================
class TaskLogListView(generics.ListAPIView):
    serializer_class = TaskLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TaskLog.objects.filter(task_id=self.kwargs["task_id"])
