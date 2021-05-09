import numpy as np
from calc_ray_trace_integral import schwarzschild_get_ray_cartesian


def something(x, y, z, alpha0, beta0, gamma0):
    # file:///C:/Users/sidwa/OneDrive/OneDriveNew/Personal/Sid/Brown%20University/Personal%20Projects/schwarzschild-ray-tracing-app/CamScanner%2005-08-2021%2023.05.pdf
    assert np.cos(alpha0) ** 2 + np.cos(beta0) ** 2 + np.cos(gamma0) ** 2 == 1

    X_prime = [x, y, z]
    X_prime_unit = X_prime / np.linalg.norm(X_prime)

    velocity = [np.cos(alpha0), np.cos(beta0), np.cos(gamma0)]

    Z_prime = np.cross(X_prime, velocity)
    Z_prime_unit = Z_prime / np.linalg.norm(Z_prime)

    Y_prime_unit = np.cross(Z_prime_unit, X_prime_unit)

    # X_prime_unit and velocity lie on the X'Y' plane
    delta0 = np.arccos(np.dot(X_prime_unit, velocity) / np.linalg.norm(velocity)) # np.linalg.norm(X_prime_unit) = 1 since unit vector

    x0 = np.linalg.norm(X_prime)
    y0 = 0

    x_prime_arr, y_prime_arr = schwarzschild_get_ray_cartesian(x0, y0, delta0)

    # convert primed arr to unprimed
    # get position vectors out of each of the primed coordinates

    positions_primed = [x_prime_arr, y_prime_arr, np.zeros(len(y_prime_arr))]
    primed_unit_axes = [X_prime_unit, Y_prime_unit, Z_prime_unit]

    positions = np.dot(positions_primed, primed_unit_axes)

    return positions[0], positions[1], positions[2]





