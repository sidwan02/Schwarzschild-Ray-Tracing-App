from rest_framework import serializers
from .models import Position, RayTracing


class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['id', 'x', 'y', 'z', 'delta']


class RayTracingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RayTracing
        fields = ['id', 'x', 'y', 'z', 'delta0']
