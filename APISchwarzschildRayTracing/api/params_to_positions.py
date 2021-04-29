from .models import Position


def get_positions_from_params(input_items):
    x = input_items[0][1]
    y = input_items[1][1]
    delta0 = input_items[2][1]

    dummy_position = Position(x=0, y=0, z=0)

    return dummy_position
