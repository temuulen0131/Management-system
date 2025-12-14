from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Client,
    ClientRequest,
    Department,
    Task,
    TaskComment,
    TaskLog,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"


class ClientRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientRequest
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ["created_by"]

    def get_created_by_name(self, obj):
        if obj.created_by:
            if obj.created_by.first_name and obj.created_by.last_name:
                return f"{obj.created_by.first_name} {obj.created_by.last_name}"
            return obj.created_by.username
        return "Unknown"
    
    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            if obj.assigned_to.first_name and obj.assigned_to.last_name:
                return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}"
            return obj.assigned_to.username
        return None

    def create(self, validated_data):
        request = self.context["request"]

        validated_data["created_by"] = request.user

        return super().create(validated_data)


class TaskCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TaskComment
        fields = "__all__"


class TaskLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TaskLog
        fields = "__all__"
