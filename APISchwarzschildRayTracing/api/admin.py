from django.contrib import admin
from .models import Position

# Register your models here.


@admin.register(Position)
class PositionModel(admin.ModelAdmin):
    list_filter = ('x', 'y', 'z')
    list_display = ('x', 'y', 'z')
