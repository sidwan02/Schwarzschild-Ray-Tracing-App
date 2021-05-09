from django.shortcuts import render, HttpResponse
from .models import Coordinate2D, Coordinate3D
from .serializers import Coordinate2DSerializer, RayTracing2DSerializer, Coordinate3DSerializer, RayTracing3DSerializer
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from .params_to_coords import get_2D_coords_from_params, get_3D_coords_from_params


# Create your views here.


@csrf_exempt
def get_coordinates_2D(request):
    # must have GET if statement branch because otherwise the localhost complains
    if request.method == "GET":
        positions = Coordinate2D.objects.all()
        serializer = Coordinate2DSerializer(positions, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        data = JSONParser().parse(request)
        print("data: ", data)

        serializer_ray_tracing = RayTracing2DSerializer(data=data)
        if serializer_ray_tracing.is_valid():
            # serializer_ray_tracing.save()
            # https://stackoverflow.com/questions/20431270/convert-from-ordereddict-to-list
            input_items = list(serializer_ray_tracing.validated_data.items())
            # print("input_items", input_items)

            positions = get_2D_coords_from_params(input_items)

            serializer_positions = Coordinate2DSerializer(positions, many=True)
            # print(serializer_positions)
            return JsonResponse(serializer_positions.data, status=201, safe=False)
        else:
            return JsonResponse(serializer_ray_tracing.errors, status=400)

@csrf_exempt
def coords_3D_list(request):
    # must have GET if statement branch because otherwise the localhost complains
    if request.method == "GET":
        positions = Coordinate3D.objects.all()
        serializer = Coordinate3DSerializer(positions, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        data = JSONParser().parse(request)
        print("data: ", data)

        serializer_ray_tracing = RayTracing3DSerializer(data=data)
        if serializer_ray_tracing.is_valid():
            # serializer_ray_tracing.save()
            # https://stackoverflow.com/questions/20431270/convert-from-ordereddict-to-list
            input_items = list(serializer_ray_tracing.validated_data.items())
            # print("input_items", input_items)

            positions = get_3D_coords_from_params(input_items)

            serializer_positions = Coordinate3DSerializer(positions, many=True)
            # print(serializer_positions)
            return JsonResponse(serializer_positions.data, status=201, safe=False)
        else:
            return JsonResponse(serializer_ray_tracing.errors, status=400)
