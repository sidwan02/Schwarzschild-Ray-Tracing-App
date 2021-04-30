from .models import Position


def get_positions_from_params(input_items):
    x = input_items[0][0]
    y = input_items[1][0]
    delta0 = input_items[2][0]

    position1 = Position(x=0, y=0, z=0)
    position2 = Position(x=1, y=1, z=1)

    positions = [position1, position2]

    return positions
