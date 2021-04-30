from .models import Position
from .ray_tracing_progression import get_ray_trace_coords


def get_positions_from_params(input_items):
    print(input_items)

    x = input_items[0][1]
    y = input_items[1][1]
    z = input_items[2][1]
    delta0 = input_items[3][1]

    # print(x)
    # print(y)
    # print(z)
    # print(delta0)

    (x_trace, y_trace, delta) = get_ray_trace_coords(x, y, delta0)

    print(x_trace)
    print(y_trace)
    print(delta)

    positions = []

    for (x, y, d) in zip(x_trace, y_trace, delta):
        positions.append(Position(x=x, y=y, z=0, delta=d))

    # position1 = Position(x=0, y=0, z=0, delta=0)
    # position2 = Position(x=1, y=1, z=1, delta=0)
    #
    # positions = [position1, position2]

    return positions
