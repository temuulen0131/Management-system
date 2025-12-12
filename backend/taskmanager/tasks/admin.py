from django.contrib import admin
from .models import Client, ClientRequest, Task, TaskLog, TaskComment

admin.site.register(Client)
admin.site.register(ClientRequest)
admin.site.register(Task)
admin.site.register(TaskLog)
admin.site.register(TaskComment)
