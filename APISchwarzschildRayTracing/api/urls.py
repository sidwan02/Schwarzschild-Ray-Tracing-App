from django.urls import path
from .views import get_coordinates_2D, coords_3D_list

urlpatterns = [
    path('2D/', get_coordinates_2D),
    path('3D/', coords_3D_list),
]
