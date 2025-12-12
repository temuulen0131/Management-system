from django.db import models
from django.contrib.auth.models import User


# ---------------------
# CLIENT MODEL
# ---------------------
class Client(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    department = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ---------------------
# CLIENT REQUEST MODEL
# ---------------------
class ClientRequest(models.Model):
    PRIORITY_CHOICES = [
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
    ]

    STATUS_CHOICES = [
        ("NEW", "New"),
        ("REVIEWING", "Reviewing"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("CONVERTED", "Converted to Task"),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    category = models.CharField(max_length=100)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="MEDIUM")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="NEW")
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Request #{self.id} from {self.client.name}"


# ---------------------
# TASK MODEL
# ---------------------
class Task(models.Model):
    CATEGORY_CHOICES = [
        ("SOFTWARE", "Software"),
        ("HARDWARE", "Hardware"),
        ("NETWORK", "Network"),
        ("ACCOUNT", "Account Access"),
        ("OTHER", "Other"),
    ]

    STATUS_CHOICES = [
        ("NEW", "New"),
        ("IN_PROGRESS", "In Progress"),
        ("WAITING", "Waiting"),
        ("DONE", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    PRIORITY_CHOICES = [
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
        ("URGENT", "Urgent"),
    ]

    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()

    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="tasks_created"
    )
    assigned_to = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="tasks_assigned"
    )

    client_request = models.OneToOneField(
        ClientRequest, null=True, blank=True, on_delete=models.SET_NULL
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="NEW")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="MEDIUM")

    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Task #{self.id} - {self.category}"


# ---------------------
# TASK LOG MODEL
# ---------------------
class TaskLog(models.Model):
    ACTION_TYPES = [
        ("STATUS_CHANGE", "Status Change"),
        ("COMMENT_ADDED", "Comment Added"),
        ("TASK_ASSIGNED", "Task Assigned"),
        ("UPDATE", "Update"),
    ]

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="logs")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    old_value = models.TextField(null=True, blank=True)
    new_value = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log for Task #{self.task.id}"


# ---------------------
# TASK COMMENT MODEL
# ---------------------
class TaskComment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    comment = models.TextField()
    is_internal = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        uname = self.user.username if self.user else "Unknown"
        return f"Comment on Task #{self.task.id} by {uname}"
