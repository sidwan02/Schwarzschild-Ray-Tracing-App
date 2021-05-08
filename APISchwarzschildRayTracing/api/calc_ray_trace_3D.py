import numpy as np
from calc_ray_trace_integral import schwarzschild_get_ray_cartesian

def something(x, y, z, theta0, phi0):
    # find the primed coordinates
    X_prime = np.array([x, y, z])
    velocity = np.array([np.sin(phi0) * np.cos(theta0), np.sin(phi0) * np.sin(theta0), np.cos(phi0)])

    Z_prime = np.cross(X_prime, velocity)

    Y_prime = np.cross(Z_prime, X_prime)

    y0 = 0

    P = np.array([x, y, z])
    S = np.array([0, 0, 0]) # arbitrary point lying on line
    PS = S - P

    x0 = np.abs(np.dot(Y_prime, PS) / np.linalg.norm(PS)) # distance b/w point and line

    # velocity and X_prime in same plane, simply find angle b/w those two vectors
    delta0 = np.dot(X_prime, velocity) / (np.linalg.norm(X_prime) * np.linalg.norm(velocity))

    x_arr_prime, y_arr_prime = schwarzschild_get_ray_cartesian(x0, y0, delta0)

    # get the unprimed values
    # three unknowns x, y, z; three equations for X, Y, Z dist
    # Notice, y_arr_prime = y' dist and so on

    y_arr_prime * np.linalg.norm(Y_prime) * np.sqrt(x**2 + y**2 + z**2) = x * Y_prime[0] + y * Y_prime[1] + z * Y_prime[2]

    x_arr_prime * np.linalg.norm(X_prime) * np.sqrt(x ** 2 + y ** 2 + z ** 2) = x * X_prime[0] + y * X_prime[1] + z * \
                                                                                X_prime[2]

    0 = x * Z_prime[0] + y * Z_prime[1] + z * Z_prime[2]
