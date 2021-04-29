from django.shortcuts import render, HttpResponse
from .models import Position
from .serializers import PositionSerializer, RayTracingSerializer
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from params_to_positions import get_positions_from_params
# Create your views here.


@csrf_exempt
def position_list(request):
    # get all positions
    # if request.method == "GET":
    #     positions = Position.objects.all()
    #     serializer = PositionSerializer(positions, many=True)
    #     return JsonResponse(serializer.data, safe=False)
    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer_ray_tracing = RayTracingSerializer(data)
        if serializer_ray_tracing.is_valid():
            # serializer_ray_tracing.save()
            input_items = serializer_ray_tracing.validated_data.items()

            positions = get_positions_from_params(input_items)


            serializer_positions = PositionSerializer(positions, many=False)
            return JsonResponse(serializer_positions.data, status=201)
        else:
            return JsonResponse(serializer_ray_tracing.errors, status=400)
