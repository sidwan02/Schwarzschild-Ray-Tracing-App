from django.contrib import admin
from .models import Coordinate2D, Coordinate3D


# Register your models here.


@admin.register(Coordinate2D)
class Coordinate2DModel(admin.ModelAdmin):
    list_filter = ('x', 'y')
    list_display = ('x', 'y')


@admin.register(Coordinate3D)
class Coordinate2DModel(admin.ModelAdmin):
    list_filter = ('x', 'y', 'z')
    list_display = ('x', 'y', 'z')
