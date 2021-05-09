import numpy as np

from .calc_ray_trace_3D import schwarzschild_3D_get_ray_cartesian
from .models import Coordinate2D, Coordinate3D
# from .calc_ray_trace_diffequ import get_ray_trace_coords
from .calc_ray_trace_integral import schwarzschild_get_ray_cartesian


def get_2D_coords_from_params(input_items):
    print(input_items)

    x0 = input_items[0][1]
    y0 = input_items[1][1]
    delta0 = input_items[2][1]

    # print(x)
    # print(y)
    # print(z)
    # print(delta0)

    # (x_trace, y_trace, delta) = get_ray_trace_coords(x, y, delta0)
    (x_trace, y_trace) = schwarzschild_get_ray_cartesian(x0, y0, delta0)

    print(x_trace)
    print(y_trace)

    positions = []

    for (x, y) in zip(x_trace, y_trace):
        positions.append(Coordinate2D(x=x, y=y))

    # position1 = Position(x=0, y=0, z=0, delta=0)
    # position2 = Position(x=1, y=1, z=1, delta=0)
    #
    # positions = [position1, position2]

    return positions

def get_3D_coords_from_params(input_items):
    print(input_items)

    x0 = input_items[0][1]
    y0 = input_items[1][1]
    z0 = input_items[2][1]
    alpha0 = input_items[3][1]
    beta0 = input_items[4][1]
    gamma0 = input_items[5][1]

    # print(x)
    # print(y)
    # print(z)
    # print(delta0)

    # (x_trace, y_trace, delta) = get_ray_trace_coords(x, y, delta0)
    (x_trace, y_trace, z_trace) = schwarzschild_3D_get_ray_cartesian(x0, y0, z0, alpha0, beta0, gamma0)

    print(x_trace)
    print(y_trace)
    print(z_trace)

    positions = []

    for (x, y, z) in zip(x_trace, y_trace, z_trace):
        positions.append(Coordinate3D(x=x, y=y, z=z))

    # position1 = Position(x=0, y=0, z=0, delta=0)
    # position2 = Position(x=1, y=1, z=1, delta=0)
    #
    # positions = [position1, position2]

    return positions
