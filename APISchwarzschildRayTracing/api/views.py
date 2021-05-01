from django.shortcuts import render, HttpResponse
from .models import Position
from .serializers import PositionSerializer, RayTracingSerializer
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from .params_to_positions import get_positions_from_params

# Create your views here.


@csrf_exempt
def position_list(request):
    # must have GET if statement branch because otherwise the localhost complains
    if request.method == "GET":
        positions = Position.objects.all()
        serializer = PositionSerializer(positions, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        data = JSONParser().parse(request)
        print("data: ", data)

        serializer_ray_tracing = RayTracingSerializer(data=data)
        if serializer_ray_tracing.is_valid():
            # serializer_ray_tracing.save()
            # https://stackoverflow.com/questions/20431270/convert-from-ordereddict-to-list
            input_items = list(serializer_ray_tracing.validated_data.items())
            # print("input_items", input_items)

            positions = get_positions_from_params(input_items)

            serializer_positions = PositionSerializer(positions, many=True)
            # print(serializer_positions)
            return JsonResponse(serializer_positions.data, status=201, safe=False)
        else:
            return JsonResponse(serializer_ray_tracing.errors, status=400)
