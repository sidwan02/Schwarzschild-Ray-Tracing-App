import numpy as np
from scipy.integrate import solve_ivp


def diff_equation_num_solver(phi, y):
    u = y[0]
    w = y[1]

    dudphi = w
    dwdphi = (3 * (u * u)) - u

    return [dudphi, dwdphi]


# https://scicomp.stackexchange.com/questions/16325/dynamically-ending-ode-integration-in-scipy


# https://numpy.org/doc/stable/reference/generated/numpy.matrix.html
# https://math.stackexchange.com/questions/1332311/finding-the-jacobian-of-a-system-of-1st-order-odes
# https://stackoverflow.com/questions/50599105/using-jacobian-matrix-in-solve-ivp


def jac(t, y):
    jac_mat = np.matrix([[0, 1], [(6 * y[0]), 0]])
    return jac_mat


def get_ray_trace_coords(x_ray, y_ray, delta0):
    def limit_200(t, y):  # when r i.e. M/u = 100 <=> u - M/100 = 0
        global flag
        if flag == 1:
            test = y[0] - M / 200
            flag = 0
        else:
            test = y[0] - M / 200
        return test

    def limit_100(t, y):
        # when x' = -100 i.e. x * np.cos(theta) + y * np.sin(theta) = -100
        # i.e. r * np.cos(phi) * np.cos(theta) + r * np.sin(phi) * np.sin(theta) = -100
        # i.e. M/u * np.cos(phi) * np.cos(theta) + M/u * np.sin(phi) * np.sin(theta) = -100
        # <=> u + (M * np.cos(phi) * np.cos(theta) + M * np.sin(phi) * np.sin(theta))/100 = 0
        global flag
        phi = t
        u = y[0]
        # fprint('x', (M/y[0]) * np.cos(t))
        if flag == 1:
            if y_ray >= 0:
                test = u + (M * np.cos(phi) * np.cos(theta) +
                            M * np.sin(phi) * np.sin(theta)) / 100
            elif y_ray < 0:
                test = u + (M * np.cos(phi) * np.cos(theta) -
                            M * np.sin(phi) * np.sin(theta)) / 100
            # test = y[0] + (M * np.cos(t))/100
            # test = u - M/200
            # test = np.ndarray.tolist(test)
            flag = 0
        else:
            # test = y[0] + (M * np.cos(t))/100
            # test = u - M/200
            if y_ray >= 0:
                test = u + (M * np.cos(phi) * np.cos(theta) +
                            M * np.sin(phi) * np.sin(theta)) / 100
            elif y_ray < 0:
                test = u + (M * np.cos(phi) * np.cos(theta) -
                            M * np.sin(phi) * np.sin(theta)) / 100
        return test

    def limit_2(t, y):  # when r i.e. M/u = 2 <=> u - M/2 = 0
        global flag
        if flag == 1:
            test = y[0] - M / 2
            # test = np.ndarray.tolist(test)
            flag = 0
        else:
            test = y[0] - M / 2
        return test

    # Define terminal condition and type-change flag
    limit_200.terminal = True
    limit_100.terminal = True
    limit_2.terminal = True
    global flag
    flag = 1

    # Interval of Integration
    phi0 = 0
    phif = 1000 * np.pi

    # Initial Constants:
    M = 1

    # if you define this in the for loop only the last scatter will display

    # fascal = int(input("Have max step? Yes = 0 or No = 1: "))
    step = 1e-1

    delta_max = []
    all_b = []

    def delta_evolution(x, y, y_beam):
        delta_x = np.array([x1 - x2 for x1, x2 in zip(x, x[1:])])

        delta_y = np.array([y1 - y2 for y1, y2 in zip(y, y[1:])])

        delta_m = delta_y / delta_x

        # intersection between two lines
        delta = np.array([np.arctan((m2 - m1) / (1 + m1 * m2))
                          for m1, m2 in zip(delta_m, delta_m[1:])])

        def cumulative_sum(d):
            if d.size >= 2:
                d_new = d[1:]
                d_new[0] += d[0]
                return [d[0]] + cumulative_sum(d_new)
            elif d.size == 0:  # if x or y has only 2 points then 1 line and 0 angles
                return []
            else:
                return [d[0]]

        delta = cumulative_sum(delta)

        delta = np.insert(delta, 0, 0)

        delta = np.append(delta, delta[-1]) * 180 / np.pi

        # print('delta', delta)

        delta_max.append(delta[-1])

        return delta

    r0 = np.sqrt(np.square(x_ray) + np.square(y_ray))
    # for some reason not having negative makes the source in the negative of the y_beam param
    theta = -np.arctan(y_ray / np.abs(x_ray))
    # print('r0', r0)
    # print('theta', theta)

    delta0 = delta0 * np.pi / 180
    if x_ray < 0:
        delta0 = np.pi - delta0

    if delta0 == 0:
        m = (y_ray - 0) / (x_ray - 0)
        x_trace = np.linspace(x_ray, 200, 2)
        y_trace = m * x_trace

        delta = [0]

    else:
        # Initial State
        u0 = 1 / r0
        w0 = -u0 / (np.tan(delta0))

        y0 = [u0, w0]

        sol = solve_ivp(diff_equation_num_solver, t_span=[
            phi0, phif], y0=y0, method='LSODA', dense_output=True, events=(limit_200, limit_2),
                        jac=jac, max_step=step)

        # print(sol)
        u = sol.y[0]
        w = sol.y[1]
        phi = sol.t
        # print('phi', phi)
        # print(len(phi))

        # convert polar to cartesian coordinates
        r = M / u
        # print("r: ", r)

        x = r * np.cos(phi)
        y = r * np.sin(phi)

        # https://www.sparknotes.com/math/precalc/conicsections/section5/#:~:text=So%20far%2C%20we%20have%20only,%2B%20Ey%20%2B%20F%20%3D%200.&text=Figure%20%25%3A%20The%20x%20and,x%27%20and%20y%27%20axes.
        x_prime = x * np.cos(theta) + y * np.sin(theta)
        y_prime = -x * np.sin(theta) + y * np.cos(theta)

        # need to reflect in the primed axis to get all delta 360 coverage otherwise reflection will be in the unprimed axis and will original from two different sources (half each)
        minus_x_prime = x * np.cos(theta) + (-y) * np.sin(theta)
        minus_y_prime = -x * np.sin(theta) + (-y) * np.cos(theta)
        # print('len', minus_x_prime)

        # print('hi')

        if x_ray < 0:
            # reflect across y axis
            x_prime = -x_prime

        if y_ray >= 0 and delta0 > 0:
            x_trace = x_prime
            y_trace = y_prime

            delta = delta_evolution(x_prime, y_prime, y_ray)

        else:
            x_trace = minus_x_prime
            y_trace = minus_y_prime

            delta = delta_evolution(
                minus_x_prime, minus_y_prime, y_ray)

    print("x_trace: ", x_trace)
    print("y_trace: ", y_trace)
    print("delta: ", delta)

    return x_trace, y_trace, delta


# caution: delta0 wrt the line attaching the AGN and the light ray origin.
get_ray_trace_coords(100, 0, 90)
