import numpy as np
from calc_ray_trace_integral import schwarzschild_get_ray_cartesian


def find_third_dir_cos(ang1, ang2):
    ang1 = np.deg2rad(ang1)
    ang2 = np.deg2rad(ang2)

    return np.rad2deg(np.arccos(1 - ((np.cos(ang1)) ** 2 + (np.cos(ang2)) ** 2)))


print("booboo")
print(find_third_dir_cos(90, 0))


def something(x, y, z, alpha0, beta0, gamma0):
    alpha0 = np.deg2rad(alpha0)
    beta0 = np.deg2rad(beta0)
    gamma0 = np.deg2rad(gamma0)

    # file:///C:/Users/sidwa/OneDrive/OneDriveNew/Personal/Sid/Brown%20University/Personal%20Projects/schwarzschild-ray-tracing-app/CamScanner%2005-08-2021%2023.05.pdf
    assert np.cos(alpha0) ** 2 + np.cos(beta0) ** 2 + np.cos(gamma0) ** 2 == 1

    X_prime = [x, y, z]
    X_prime_unit = X_prime / np.linalg.norm(X_prime)

    velocity = [np.cos(alpha0), np.cos(beta0), np.cos(gamma0)]

    Z_prime = np.cross(X_prime, velocity)
    Z_prime_unit = Z_prime / np.linalg.norm(Z_prime)

    Y_prime_unit = np.cross(Z_prime_unit, X_prime_unit)

    # X_prime_unit and velocity lie on the X'Y' plane
    delta0 = np.arccos(
        np.dot(X_prime_unit, velocity) / np.linalg.norm(velocity))  # np.linalg.norm(X_prime_unit) = 1 since unit vector

    x0 = np.linalg.norm(X_prime)
    y0 = 0

    x_prime_arr, y_prime_arr = schwarzschild_get_ray_cartesian(x0, y0, np.rad2deg(delta0))

    # convert primed arr to unprimed
    # get position vectors out of each of the primed coordinates
    x_arr = []
    y_arr = []
    z_arr = []
    for (x_prime, y_prime) in zip(x_prime_arr, y_prime_arr):
        position = np.dot(x_prime, X_prime_unit) + np.dot(y_prime, Y_prime_unit)  # np.dot(0, Z_prime_unit) = 0

        x_arr.append(position[0])
        y_arr.append(position[1])
        z_arr.append(position[2])

    # print()
    return np.array(x_arr), np.array(y_arr), np.array(z_arr)


# if gamma = 90 that means xy plane direction only cuz think of spherical coordinates how the phi comes from +ve z
# x0 = 5
# y0 = 3
# z0 = 6
# alpha0 = 60
# beta0 = 60
# gamma0 = 135
# x_arr, y_arr, z_arr = something(x0, y0, z0, alpha0, beta0, gamma0)
#
# import matplotlib.pyplot as plt
#
# fig = plt.figure()
#
# ax = plt.axes(projection='3d')
# ax.set_xlabel('$X$')
# ax.set_ylabel('$Y$')
# ax.set_zlabel('$Z$')
#
# ax.scatter3D(x_arr, y_arr, z_arr)
# ax.scatter3D(0, 0, 0)
#
# ax.set_title("Start = <" + str(x0) + ", " + str(y0) + ", " + str(z0) + "> \n velocity = <" + str(alpha0) + "°, " + str(beta0) + "°, " + str(gamma0) + "°>")
#
# plt.show()
