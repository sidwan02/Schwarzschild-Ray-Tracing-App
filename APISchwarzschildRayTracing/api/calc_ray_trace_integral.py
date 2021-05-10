# https://colab.research.google.com/drive/14ngIoAYnXPfBXpThX7jxMALhWRq5826I?authuser=1#scrollTo=RLuJYQJw9GpK

import numpy as np
from scipy.special import ellipkinc as ei

Dcrit = np.sqrt(27)
abstol = 1.0e-12  # Tolerance for D=Dcrit


# Given the impact parameter (D) and mass (M), find the real roots of
# the cubic f(u) = 2Mu^3 - u^2 + 1/D^2
def roots_fu(D, M):
    # Compute discriminant and coffecients of the depressed cubic
    discrim = D * D - 27 * M * M
    p, q = -1 / 12 / M / M, (0.5 / D / D - 1 / 108 / M / M) / M
    ofs = 1 / 6 / M  # Offset to add to roots of depressed cubic

    if discrim < 0:  # Just one real root
        rr = np.zeros(1)
        delta = np.sqrt((4 * p * p * p + 27 * q * q) / 3) / 6
        aa = np.cbrt(-q / 2 + delta)
        bb = np.cbrt(-q / 2 - delta)
        rr[0] = aa + bb + ofs
    elif discrim == 0:  # Multiple real roots
        rr = np.zeros(2)
        rr[0], rr[1] = -ofs, 2 * ofs
    else:  # Three real roots
        rr = np.zeros(3)
        p3 = np.sqrt(-p / 3)
        theta = np.arccos(1.5 * q / p / p3) / 3
        r1 = 2 * p3 * np.cos(theta)
        r2 = 2 * p3 * np.cos(theta - 2 * np.pi / 3)
        r3 = 2 * p3 * np.cos(theta - 4 * np.pi / 3)
        rr = np.sort([r1, r2, r3]) + ofs  # Sort roots in ascending order, add offset

    return rr


def if_D_gt_Dcrit_get_ray(D, r0, theta0, delta0, rstop, npoints):
    # print("greater than")
    # inout = 1 for outward rays at (r0,theta0), and -1 for inward rays
    # updn = 1 for rays above the radial direction, -1 for those below
    inout, updn = np.sign(np.cos(delta0)), np.sign(np.sin(delta0))

    # If ray is entirely tangential then we're at periastron
    if (np.cos(delta0) == 0):
        inout = 1
        b2 = 1 / r0
        Q = np.sqrt((r0 - 2.) * (r0 + 6.))
        b3, b1 = (r0 - 2. - Q) / 4 / r0, (r0 - 2. + Q) / 4 / r0
    else:
        b3, b2, b1 = roots_fu(D, 1)

    periastron = 1 / b2
    # print("periastron: ", periastron)
    m = (b2 - b3) / (b1 - b3)
    CC = np.sqrt(2 / (b1 - b3))

    if (inout == 1):  # outward rays
        # rr = np.linspace(r0, rstop, npoints)
        rr = np.linspace(r0, rstop, npoints)
        uu = 1 / rr
        phi = np.arcsin(np.sqrt((b2 - uu) / (b1 - uu) / m))
        Fi = updn * CC * ei(phi, m)

    if (inout == -1):  # inward rays
        # print("inward ray")
        rf = np.abs(rstop)
        if (rf < periastron):
            print('periastron=', periastron, ' whereas magnitude of rstop=', rf)
            print('rstop cannot be smaller than periastron. bailing...')
            return 0
        elif (rstop > periastron):  # r0 and rstop on the same side of periastron
            # print("r0 and rstop on the same side of periastron")
            rr = np.linspace(r0, rf, npoints)
            uu = 1 / rr
            phi = np.arcsin(np.sqrt((b2 - uu) / (b1 - uu) / m))
            Fi = -updn * CC * ei(phi, m)
        elif (rstop < -periastron) and (r0 == rf):
            if (npoints % 2 == 0):
                rr_in = np.linspace(r0, periastron, int(npoints / 2), endpoint=False)
                uu_in = 1 / rr_in
                phi_in = np.arcsin(np.sqrt((b2 - uu_in) / (b1 - uu_in) / m))
                Fi_in = -updn * CC * ei(phi_in, m)
                # Put both sides of the ray together
                rr = np.concatenate((rr_in, rr_in[::-1]))
                Fi = np.concatenate((Fi_in, -Fi_in[::-1]))
            else:
                rr_in = np.linspace(r0, periastron, int((npoints - 1) / 2))
                uu_in = 1 / rr_in
                phi_in = np.arcsin(np.sqrt((b2 - uu_in) / (b1 - uu_in) / m))
                Fi_in = -updn * CC * ei(phi_in, m)
                # Put both sides of the ray together
                rr = np.concatenate((rr_in, [periastron], rr_in[::-1]))
                Fi = np.concatenate((Fi_in, [0], -Fi_in[::-1]))
        elif (rstop < -periastron) and (r0 != rf):
            # Otherwise, when r0 != rf, the radial excusrion of the ray is
            # from r0 in to periastron and then out to rf
            # r_excur = (r0-periastron) + (rf-periastron)
            r_excur = r0 + rf - 2 * periastron
            # Out of the total path, the part between min(rf,r0) and periastron
            # is symmetric
            r_in = np.amin([r0, rf])
            # So if we want npoints during the entire excursion, the number of
            # points between r_in and periastron should be
            # n_in = npoints*(2*(r_in-periastron)/r_excur)
            # However this excursion of r_in->periastron->r_in is symmetric. So
            # we really need only half as many points to cover this range.
            n_in = int(npoints * (r_in - periastron) / r_excur)
            # We reserve one point for periastron location, and reserve
            # the remaining points are outside r_in and inside r_out = max(r0,rf)
            n_out = npoints - 2 * n_in - 1
            r_out = np.amax([r0, rf])
            # Now first construct the ray between r_out and r_in in n_out points
            rr_out = np.linspace(r_out, r_in, n_out, endpoint=False)
            uu_out = 1 / rr_out
            phi_out = np.arcsin(np.sqrt((b2 - uu_out) / (b1 - uu_out) / m))
            Fi_out = -updn * CC * ei(phi_out, m)
            # And then construct the ray from r_in to almost periastron
            rr_in = np.linspace(r_in, periastron, n_in, endpoint=False)
            uu_in = 1 / rr_in
            phi_in = np.arcsin(np.sqrt((b2 - uu_in) / (b1 - uu_in) / m))
            Fi_in = -updn * CC * ei(phi_in, m)
            # Add everything together to make the final ray
            if (r0 > rf):
                rr = np.concatenate((rr_out, rr_in, [periastron], rr_in[::-1]))
                Fi = np.concatenate((Fi_out, Fi_in, [0], -Fi_in[::-1]))
            else:
                rr = np.concatenate((rr_in, [periastron], rr_in[::-1], rr_out[::-1]))
                Fi = np.concatenate((Fi_in, [0], -Fi_in[::-1], -Fi_out[::-1]))
        else:
            # print('this should not happen! bailing.')
            return 0

    # Rotate so that the polar angle of the starting point matches
    theta_offset = Fi[0] - theta0
    Fi = Fi - theta_offset
    return rr, Fi

def recursive_if_D_gt_Dcrit_get_ray(D, r0, theta0, delta0, rstop, npoints, count):
    step = 0.1
    count = 0
    # print("greater than")
    # inout = 1 for outward rays at (r0,theta0), and -1 for inward rays
    # updn = 1 for rays above the radial direction, -1 for those below
    inout, updn = np.sign(np.cos(delta0)), np.sign(np.sin(delta0))

    # If ray is entirely tangential then we're at periastron
    if (np.cos(delta0) == 0):
        inout = 1
        b2 = 1 / r0
        Q = np.sqrt((r0 - 2.) * (r0 + 6.))
        b3, b1 = (r0 - 2. - Q) / 4 / r0, (r0 - 2. + Q) / 4 / r0
    else:
        b3, b2, b1 = roots_fu(D, 1)

    periastron = 1 / b2
    # print("periastron: ", periastron)
    m = (b2 - b3) / (b1 - b3)
    CC = np.sqrt(2 / (b1 - b3))

    if (inout == 1):  # outward rays
        # rr = np.linspace(r0, rstop, npoints)
        rr = np.linspace(r0, rstop, npoints)
        uu = 1 / rr
        phi = np.arcsin(np.sqrt((b2 - uu) / (b1 - uu) / m))
        Fi = updn * CC * ei(phi, m)

    if (inout == -1):  # inward rays
        # print("inward ray")
        rf = np.abs(rstop)
        if (rf < periastron):
            # print('periastron=', periastron, ' whereas magnitude of rstop=', rf)
            # print('rstop cannot be smaller than periastron. bailing...')
            return 0
        elif (rstop > periastron):  # r0 and rstop on the same side of periastron
            # print("r0 and rstop on the same side of periastron")
            rr = np.linspace(r0, rf, npoints)
            uu = 1 / rr
            phi = np.arcsin(np.sqrt((b2 - uu) / (b1 - uu) / m))
            Fi = -updn * CC * ei(phi, m)
        elif (rstop < -periastron) and (r0 == rf):
            if (npoints % 2 == 0):
                rr_in = np.linspace(r0, periastron, int(npoints / 2), endpoint=False)
                uu_in = 1 / rr_in
                phi_in = np.arcsin(np.sqrt((b2 - uu_in) / (b1 - uu_in) / m))
                Fi_in = -updn * CC * ei(phi_in, m)
                # Put both sides of the ray together
                rr = np.concatenate((rr_in, rr_in[::-1]))
                Fi = np.concatenate((Fi_in, -Fi_in[::-1]))
            else:
                rr_in = np.linspace(r0, periastron, int((npoints - 1) / 2))
                uu_in = 1 / rr_in
                phi_in = np.arcsin(np.sqrt((b2 - uu_in) / (b1 - uu_in) / m))
                Fi_in = -updn * CC * ei(phi_in, m)
                # Put both sides of the ray together
                rr = np.concatenate((rr_in, [periastron], rr_in[::-1]))
                Fi = np.concatenate((Fi_in, [0], -Fi_in[::-1]))
        elif (rstop < -periastron) and (r0 != rf):
            # Otherwise, when r0 != rf, the radial excusrion of the ray is
            # from r0 in to periastron and then out to rf
            # r_excur = (r0-periastron) + (rf-periastron)
            r_excur = r0 + rf - 2 * periastron
            # Out of the total path, the part between min(rf,r0) and periastron
            # is symmetric
            r_in = np.amin([r0, rf])
            # So if we want npoints during the entire excursion, the number of
            # points between r_in and periastron should be
            # n_in = npoints*(2*(r_in-periastron)/r_excur)
            # However this excursion of r_in->periastron->r_in is symmetric. So
            # we really need only half as many points to cover this range.
            n_in = int(npoints * (r_in - periastron) / r_excur)
            # We reserve one point for periastron location, and reserve
            # the remaining points are outside r_in and inside r_out = max(r0,rf)
            n_out = npoints - 2 * n_in - 1
            r_out = np.amax([r0, rf])
            # Now first construct the ray between r_out and r_in in n_out points
            rr_out = np.linspace(r_out, r_in, n_out, endpoint=False)
            uu_out = 1 / rr_out
            phi_out = np.arcsin(np.sqrt((b2 - uu_out) / (b1 - uu_out) / m))
            Fi_out = -updn * CC * ei(phi_out, m)
            # And then construct the ray from r_in to almost periastron
            rr_in = np.linspace(r_in, periastron, n_in, endpoint=False)
            uu_in = 1 / rr_in
            phi_in = np.arcsin(np.sqrt((b2 - uu_in) / (b1 - uu_in) / m))
            Fi_in = -updn * CC * ei(phi_in, m)
            # Add everything together to make the final ray
            if r0 > rf:
                rr = np.concatenate((rr_out, rr_in, [periastron], rr_in[::-1]))
                Fi = np.concatenate((Fi_out, Fi_in, [0], -Fi_in[::-1]))
            else:
                rr = np.concatenate((rr_in, [periastron], rr_in[::-1], rr_out[::-1]))
                Fi = np.concatenate((Fi_in, [0], -Fi_in[::-1], -Fi_out[::-1]))
        else:
            # print('this should not happen! bailing.')
            return 0

    # Rotate so that the polar angle of the starting point matches
    theta_offset = Fi[0] - theta0
    Fi = Fi - theta_offset
    return rr, Fi

def get_next_rr(r_acc, theta_acc, condition):
    if len(r_acc) == (1 or 2):
        # this is the first or second time this function is being executed
        if condition:
            rr = r_acc[-1] + 5e-5
        else:
            rr = r_acc[-1] - 5e-5
    else:
        # delta_theta = np.abs(theta_acc[-1] - theta_acc[-2])
        delta_theta = np.deg2rad(10)
        # print("delta_theta: ", delta_theta)
        if delta_theta < np.deg2rad(10):
            delta_rr = 5e-1
        elif delta_theta < np.deg2rad(20):
            delta_rr = 1e-1
        elif delta_theta < np.deg2rad(30):
            delta_rr = 5e-2
        elif delta_theta < np.deg2rad(40):
            delta_rr = 1e-2
        elif delta_theta < np.deg2rad(50):
            delta_rr = 5e-3
        elif delta_theta < np.deg2rad(60):
            delta_rr = 1e-3
        elif delta_theta < np.deg2rad(70):
            delta_rr = 5e-4
        elif delta_theta < np.deg2rad(80):
            delta_rr = 1e-4
        elif delta_theta < np.deg2rad(90):
            delta_rr = 5e-5
        else:
            print("delta_theta went beyond 90???")

        # print("delta_rr: ", delta_rr)
        if condition:
            rr = r_acc[-1] + delta_rr
        else:
            rr = r_acc[-1] - delta_rr

    return rr

# def if_D_gt_Dcrit_get_ray_new(D, r0, theta0, delta0, r_acc, theta_acc, rstop, condition, npoints): # condition True i.e. ray going to infinity, condition False i.e. ray falling into BH
#     # # print("greater than")
#     # inout = 1 for outward rays at (r0,theta0), and -1 for inward rays
#     # updn = 1 for rays above the radial direction, -1 for those below
#     inout, updn = np.sign(np.cos(delta0)), np.sign(np.sin(delta0))
#
#     # If ray is entirely tangential then we're at periastron
#     if (np.cos(delta0) == 0):
#         inout = 1
#         b2 = 1 / r0
#         Q = np.sqrt((r0 - 2.) * (r0 + 6.))
#         b3, b1 = (r0 - 2. - Q) / 4 / r0, (r0 - 2. + Q) / 4 / r0
#     else:
#         b3, b2, b1 = roots_fu(D, 1)
#
#     periastron = 1 / b2
#     # # print("periastron: ", periastron)
#     m = (b2 - b3) / (b1 - b3)
#     CC = np.sqrt(2 / (b1 - b3))
#
#     if (inout == 1):  # outward rays
#         # rr = np.linspace(r0, rstop, npoints)
#         # rr = np.linspace(r0, rstop, npoints)
#         rr = get_next_rr(r_acc, theta_acc, condition)
#         uu = 1 / rr
#         phi = np.arcsin(np.sqrt((b2 - uu) / (b1 - uu) / m))
#         Fi = updn * CC * ei(phi, m)
#
#     if (inout == -1):  # inward rays
#         # # print("inward ray")
#         rf = np.abs(rstop)
#         if (rf < periastron):
#             # print('periastron=', periastron, ' whereas magnitude of rstop=', rf)
#             # print('rstop cannot be smaller than periastron. bailing...')
#             return 0
#         elif (rstop > periastron):  # r0 and rstop on the same side of periastron
#             # print("r0 and rstop on the same side of periastron")
#             # rr = np.linspace(r0, rf, npoints)
#             rr = get_next_rr(r_acc, theta_acc, condition)
#             uu = 1 / rr
#             phi = np.arcsin(np.sqrt((b2 - uu) / (b1 - uu) / m))
#             Fi = -updn * CC * ei(phi, m)
#         elif (rstop < -periastron) and (r0 == rf):
#             if (npoints % 2 == 0):
#                 # print("bla bla blee")
#                 rr_in = np.linspace(r0, periastron, int(npoints / 2), endpoint=False)
#                 uu_in = 1 / rr_in
#                 phi_in = np.arcsin(np.sqrt((b2 - uu_in) / (b1 - uu_in) / m))
#                 Fi_in = -updn * CC * ei(phi_in, m)
#                 # Put both sides of the ray together
#                 rr = np.concatenate((rr_in, rr_in[::-1]))
#                 Fi = np.concatenate((Fi_in, -Fi_in[::-1]))
#             else:
#                 # rr_in = np.linspace(r0, periastron, int((npoints - 1) / 2))
#                 rr_in = get_next_rr(r_acc, theta_acc, condition)
#                 uu_in = 1 / rr_in
#                 phi_in = np.arcsin(np.sqrt((b2 - uu_in) / (b1 - uu_in) / m))
#                 Fi_in = -updn * CC * ei(phi_in, m)
#                 # Put both sides of the ray together
#                 rr = np.concatenate((rr_in, [periastron], rr_in[::-1]))
#                 Fi = np.concatenate((Fi_in, [0], -Fi_in[::-1]))
#         elif (rstop < -periastron) and (r0 != rf):
#             # # print("blingo")
#             # Otherwise, when r0 != rf, the radial excusrion of the ray is
#             # from r0 in to periastron and then out to rf
#             # r_excur = (r0-periastron) + (rf-periastron)
#             r_excur = r0 + rf - 2 * periastron
#             # Out of the total path, the part between min(rf,r0) and periastron
#             # is symmetric
#             r_in = np.amin([r0, rf])
#             # So if we want npoints during the entire excursion, the number of
#             # points between r_in and periastron should be
#             # n_in = npoints*(2*(r_in-periastron)/r_excur)
#             # However this excursion of r_in->periastron->r_in is symmetric. So
#             # we really need only half as many points to cover this range.
#             # n_in = int(npoints * (r_in - periastron) / r_excur)
#             # We reserve one point for periastron location, and reserve
#             # the remaining points are outside r_in and inside r_out = max(r0,rf)
#             # n_out = npoints - 2 * n_in - 1
#             # r_out = np.amax([r0, rf])
#             # Now first construct the ray between r_out and r_in in n_out points
#             # rr_out = np.linspace(r_out, r_in, n_out, endpoint=False)
#             # # print("r_acc: ", r_acc)
#             rr_out = get_next_rr(r_acc, theta_acc, condition)
#             uu_out = 1 / rr_out
#             phi_out = np.arcsin(np.sqrt((b2 - uu_out) / (b1 - uu_out) / m))
#             Fi_out = -updn * CC * ei(phi_out, m)
#             # And then construct the ray from r_in to almost periastron
#             # rr_in = np.linspace(r_in, periastron, n_in, endpoint=False)
#
#             rr_in = get_next_rr(r_acc, theta_acc, condition)
#             uu_in = 1 / rr_in
#             phi_in = np.arcsin(np.sqrt((b2 - uu_in) / (b1 - uu_in) / m))
#             Fi_in = -updn * CC * ei(phi_in, m)
#             # Add everything together to make the final ray
#             # if (r0 > rf):
#             #     rr = np.concatenate((rr_out, rr_in, [periastron], rr_in[::-1]))
#             #     Fi = np.concatenate((Fi_out, Fi_in, [0], -Fi_in[::-1]))
#             # else:
#             #     rr = np.concatenate((rr_in, [periastron], rr_in[::-1], rr_out[::-1]))
#             #     Fi = np.concatenate((Fi_in, [0], -Fi_in[::-1], -Fi_out[::-1]))
#
#             if r0 > rf:
#                 rr = rr_out
#                 Fi = Fi_out
#             else:
#                 rr = rr_in
#                 Fi = Fi_in
#         else:
#             # print('this should not happen! bailing.')
#             return 0
#
#     # print("rr: ", rr)
#     # # print("Fi: ", Fi)
#
#     # Rotate so that the polar angle of the starting point matches
#     theta_offset = Fi - theta0
#     Fi = Fi - theta_offset
#
#     if (condition and r_acc[-1] <= rstop) or ((not condition) and r_acc[-1] >= rstop):
#         # # print("r_acc: ", r_acc)
#         # # print("rr: ", rr)
#         r_acc.append(rr)
#         theta_acc.append(Fi)
#
#         return if_D_gt_Dcrit_get_ray_new(D, r0, theta0, delta0, r_acc, theta_acc, rstop, condition, npoints)
#     else:
#         # print("DONE")
#         return r_acc, theta_acc


def if_D_lt_Dcrit_get_ray(D, r0, theta0, delta0, rstop, npoints):
    # print("within lesser")
    # inout = 1 for outward rays at (r0,theta0), and -1 for inward rays
    # updn = 1 for rays above the radial direction, -1 for those below
    inout, updn = np.sign(np.cos(delta0)), np.sign(np.sin(delta0))

    # Get the only real root of f(u)
    beta = roots_fu(D, 1)

    # Following Abr & Stegun (7th ed.), pg. 597, sec. 17.4.70 and 17.4.71
    pp_beta = beta * (3 * beta - 1)  # p'(u) at beta
    ppp_beta = 6 * beta - 1  # p"(u) at beta
    lambda2 = np.sqrt(pp_beta)
    m = 0.5 - 0.125 * ppp_beta / lambda2

    # Set up the radial and inverse radial arrays
    rr = np.linspace(r0, rstop, npoints)
    uu = 1 / rr

    u_s = 1 / r0

    phi_s = np.arccos((lambda2 - u_s + beta) / (lambda2 + u_s - beta))
    Fs = ei(phi_s, m)

    phi = np.arccos((lambda2 - uu + beta) / (lambda2 + uu - beta))
    Fr = ei(phi, m)
    theta = (Fs - Fr) / np.sqrt(2 * lambda2)

    theta = inout * updn * theta + theta0

    return rr, theta


# Eq. (231) from Chandrasekhar (1983).
def u_Dcrit(theta, theta0):
    tmp = np.tanh((theta - theta0) / 2)
    return 0.5 * tmp * tmp - 1 / 6


vec_u_Dcrit = np.vectorize(u_Dcrit)


def if_D_eq_Dcrit_get_ray(r0, theta0, delta0, rstop_nturns, npoints):
    # inout = 1 for outward rays at (r0,theta0), and -1 for inward rays
    # updn = 1 for rays above the radial direction, -1 for those below
    inout, updn = np.sign(np.cos(delta0)), np.sign(np.sin(delta0))

    # What should theta_0 in Chandrasekhar's eq. (231) be so that the ray goes
    # through the point (1/r0, 0) in polar coordinates
    theta_0 = -2 * np.arctanh(np.sqrt(2 * (1 / r0 + 1 / 6)))

    if inout == +1:
        umin = 1 / rstop_nturns
        # What is the polar angle of this ray (i.e. the one going thru (1/r0,0) in
        # polar coordinates) at umin
        theta_umin = theta_0 + 2 * np.arctanh(np.sqrt(2 * (umin + 1 / 6)))
        theta_vec = np.linspace(0, theta_umin, npoints)
        u_vec = vec_u_Dcrit(theta_vec, theta_0)
    elif inout == -1:
        num_turns = rstop_nturns
        theta_vec = np.linspace(0, num_turns * 2 * np.pi, npoints)
        u_vec = vec_u_Dcrit(theta_vec, theta_0)
    else:
        # print('undefined direction in D_eq_Dcrit case. bailing.')
        return 0

    # Add offset the angles to rotate such the the ray passes through
    # (r0,theta0), and flip (if needed) to match the direction correctly
    return 1 / u_vec, theta0 - inout * updn * theta_vec


def schwarzschild_get_ray(r0, theta0, delta0, rstop, npoints):
    # Get the impact parameter
    D = r0 * np.abs(np.sin(delta0)) / np.sqrt(1 - 2 / r0)
    D_minus_Dcrit = D - Dcrit

    # print("D: ", D)

    if (np.abs(D_minus_Dcrit) < abstol):
        # print("equal")
        rr, theta = if_D_eq_Dcrit_get_ray(r0, theta0, delta0, rstop, npoints)
    elif (D > Dcrit):
        # print("greater")
        # for r = 10, delta = 100 D > Dcrit
        rr, theta = if_D_gt_Dcrit_get_ray(D, r0, theta0, delta0, rstop, npoints)
        # if rstop > r0:
        #     condition = True
        # else:
        #     condition = False
        # rr, theta = if_D_gt_Dcrit_get_ray_new(D, r0, theta0, delta0, [r0], [theta0], rstop, condition, npoints)
    elif (D < Dcrit):
        # print("lesser")
        rr, theta = if_D_lt_Dcrit_get_ray(D, r0, theta0, delta0, rstop, npoints)

    return rr, theta


# # Test
# r0, theta0 = 6, np.deg2rad(70)
# npts = 500
#
# delta0 = np.deg2rad(-43)
# r_vec1, th_vec1 = schwarzschild_get_ray(r0, theta0, delta0, r0 + 3, npts)
# r_vec2, th_vec2 = schwarzschild_get_ray(r0, theta0, delta0 + np.pi, r0 - r0 + 2, npts)
#
# delta0 = np.deg2rad(-45)
# r_vec3, th_vec3 = schwarzschild_get_ray(r0, theta0, delta0, r0 + 3, npts)
# r_vec4, th_vec4 = schwarzschild_get_ray(r0, theta0, delta0 + np.pi, r0 - r0 + 2, npts)
#
# delta0 = np.deg2rad(-47)
# r_vec5, th_vec5 = schwarzschild_get_ray(r0, theta0, delta0, r0 + 3, npts)
# r_vec6, th_vec6 = schwarzschild_get_ray(r0, theta0, delta0 + np.pi, -r0 - 3, npts)
#
# import matplotlib.pyplot as plt
#
# plt.figure(figsize=(12, 12))
# plt.axes(projection='polar')
# plt.polar(th_vec1, r_vec1, 'r-')
# plt.polar(th_vec2, r_vec2, 'r-')
#
# plt.polar(th_vec3, r_vec3, 'g-')
# plt.polar(th_vec4, r_vec4, 'g-')
#
# plt.polar(th_vec5, r_vec5, 'b-')
# plt.polar(th_vec6, r_vec6, 'b-')
#
# plt.polar(theta0, r0, 'go')  # Starting point in green
# plt.fill_between(np.linspace(0.0, 2 * np.pi, 100), 2 * np.ones(100), color='k')
# plt.show()

def get_rstop(M, r0, delta0):
    D = r0 * np.abs(np.sin(delta0)) / np.sqrt(1 - 2 / r0)
    B = r0 / np.sqrt(1 - 2 / r0) # D is b, B is B(r0) from Astrokubuntu
    D_minus_Dcrit = D - Dcrit
    print("D_minus_Dcrit: ", D_minus_Dcrit)

    if np.absolute(D_minus_Dcrit) < abstol:
        print("hahahahahahahah")
        # number of turns
        rstop = 2
    else:

        escape_to_inf = False

        if (2 * M < r0 < 3 * M) & (delta0 < 2 * np.pi) & (np.sin(delta0) < Dcrit * M / B):
            escape_to_inf = True
        elif (r0 == 3 * M) & (delta0 < np.pi):
            escape_to_inf = True
        elif (r0 > 3 * M) & ((delta0 <= np.pi / 2) or ((delta0 > np.pi / 2) & (np.sin(delta0) > Dcrit * M / B))):
            escape_to_inf = True

        if escape_to_inf:
            # rstop > r0
            if r0 > np.sqrt(20 ** 2 + 40 ** 2):  # values determined from bounds of build traces screen
                rstop = r0 + np.sqrt(20 ** 2 + 40 ** 2) + 5  # 5 buffer
            else:
                rstop = np.sqrt(20 ** 2 + 40 ** 2) + 5  # 5 buffer
        else:
            print("so I've come here...")
            # rstop < r0
            rstop = 2

    # print("delta0: ", delta0)
    if np.pi / 2 < delta0 < np.pi:
        # print("making rstop negative")
        rstop = -rstop

    return rstop


def schwarzschild_get_ray_cartesian(x, y, delta0):
    print("x: ", x)
    print("y: ", y)
    print("delta0: ", delta0)
    M = 1

    delta0 = np.deg2rad(delta0)
    r0 = np.sqrt(x ** 2 + y ** 2)
    theta0 = np.arccos(x / r0)

    print("r0: ", r0)
    print("theta0: ", theta0)

    # # print("D_minus_Dcrit: ", D_minus_Dcrit)

    npoints = 500

    # determining rstop
    rstop = get_rstop(M, r0, delta0)

    # print("rstop: ", rstop)

    r_arr, theta_arr = schwarzschild_get_ray(r0, theta0, delta0, rstop, npoints)

    x_arr = r_arr * np.cos(theta_arr)
    y_arr = r_arr * np.sin(theta_arr)

    return x_arr, y_arr



# unlike in the vscode model, this takes in 3 points (x and y arr have size 3)
def cur_delta(x_arr, y_arr):
    # print('x', x_arr)
    # print('y', y_arr)

    delta_x = np.array([x1 - x2 for x1, x2 in zip(x_arr, x_arr[1:])])

    delta_y = np.array([y1 - y2 for y1, y2 in zip(y_arr, y_arr[1:])])

    delta_m = delta_y / delta_x

    # intersection between two lines
    delta = np.array([np.arctan((m2 - m1) / (1 + m1 * m2))
                      for m1, m2 in zip(delta_m, delta_m[1:])])

    delta = np.take(delta, 0)[0]

    return delta

# def get_r_step():


# def getDistributedPoints(base, start, end, n):
#     exponents = np.linspace(0, n, n)
#     all_values = np.power(base, exponents)
#
#     last_val = all_values[n - 1]
#     denom = last_val / end
#
#     all_values = all_values / denom
#
#     return all_values
#
# # print(getDistributedPoints(2, 2, 10, 100))


# x_arr, y_arr = schwarzschild_get_ray_cartesian(-7.854910932268416, -19.758335949125744, 166.15841300952945)
x_arr, y_arr = schwarzschild_get_ray_cartesian(16.9453133719308, 19.39345238095238, 172.3971992251558)
# r_arr, theta_arr = schwarzschild_get_ray(10, np.deg2rad(0), np.deg2rad(100), 20, 10000)


# import matplotlib.pyplot as plt
#
# # plt.axes(projection = 'polar')
# # plt.polar(theta_arr, r_arr, 'b-')
# #
# # plt.figure(figsize=(12, 12))
#
# plt.plot(x_arr, y_arr)
#
# plt.show()
