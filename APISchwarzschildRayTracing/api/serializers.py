from rest_framework import serializers
from .models import Coordinate2D, RayTracing2D, Coordinate3D, RayTracing3D


class Coordinate2DSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coordinate2D
        fields = ['id', 'x', 'y']


class RayTracing2DSerializer(serializers.ModelSerializer):
    class Meta:
        model = RayTracing2D
        fields = ['id', 'x0', 'y0', 'delta0']


class Coordinate3DSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coordinate3D
        fields = ['id', 'x', 'y', 'z']


class RayTracing3DSerializer(serializers.ModelSerializer):
    class Meta:
        model = RayTracing3D
        fields = ['id', 'x0', 'y0', 'z0', 'alpha0', 'beta0', 'gamma0']
