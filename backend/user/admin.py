from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

User = get_user_model()


@admin.register(User)
class UserAdminView(UserAdmin):
    readonly_fields = ('last_login', 'date_joined',)

    # fields shown when creating a new instance
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2')}
         ),
    )

    # fields when reading / updating an instance
    fieldsets = (
        ('Basics', {'fields': ('email', 'username', 'password')}),
        ('Profile info', {'fields': ('first_name', 'last_name', 'profile_picture')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Groups', {'fields': ('groups',)}),
    )

    # fields which are shown when looking at an list of instances
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    ordering = ('id',)
