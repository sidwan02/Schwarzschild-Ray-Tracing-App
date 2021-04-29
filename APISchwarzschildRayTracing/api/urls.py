from django.urls import path
from .views import position_list

urlpatterns = [
    path('', position_list),
]
