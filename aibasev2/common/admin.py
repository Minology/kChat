from django.contrib import admin

# Register your models here.
from common.models import Status, Category, Role, Task, User

admin.site.register(User)
admin.site.register(Role)
admin.site.register(Task)
admin.site.register(Category)
admin.site.register(Status)
