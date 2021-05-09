from django.contrib import admin
from .models import Position2D

# Register your models here.


@admin.register(Position2D)
class PositionModel(admin.ModelAdmin):
    list_filter = ('x', 'y', 'z')
    list_display = ('x', 'y', 'z')
