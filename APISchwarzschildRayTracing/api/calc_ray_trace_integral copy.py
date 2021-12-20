# https://colab.research.google.com/drive/14ngIoAYnXPfBXpThX7jxMALhWRq5826I?authuser=1#scrollTo=RLuJYQJw9GpK
import math

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
            print("bobo")
            rr = np.linspace(r0, rf, npoints)
            uu = 1 / rr
            phi = np.arcsin(np.sqrt((b2 - uu) / (b1 - uu) / m))
            Fi = -updn * CC * ei(phi, m)
        elif (rstop < -periastron) and (r0 == rf):
            print("hoho haha")
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
            print("ginky")
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


def if_D_gt_Dcrit_get_ray_recusive_main(D, r0, theta0, delta0, rstop, npoints):
    print("delta0: ", delta0)
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
        print("hi")
        # rr = np.linspace(r0, rstop, npoints)
        rr = np.linspace(r0, rstop, npoints)

        # uu = 1 / rr
        # phi = np.arcsin(np.sqrt((b2 - uu) / (b1 - uu) / m))
        # Fi = updn * CC * ei(phi, m)

        def gt_recurring(r_acc, theta_acc, condition, count, maximum_r_change):
            # print("r_acc: ", r_acc)
            recursionCompleted = False

            if condition:
                if r_acc[-1] >= rstop:
                    recursionCompleted = True
            else:
                if r_acc[-1] <= rstop:
                    recursionCompleted = True

            if recursionCompleted:
                r_acc.pop()

                return r_acc, np.array(theta_acc), count
            else:

                rr, maximum_r_change = get_next_rr(r_acc, theta_acc, condition, maximum_r_change)
                uu = 1 / rr
                phi = np.arcsin(np.sqrt((b2 - uu) / (b1 - uu) / m))
                Fi = updn * CC * ei(phi, m)

                # print("Fi: ", Fi)

                r_acc.append(rr)
                theta_acc.append(Fi)

                # print("r_acc: ", r_acc)
                # print("theta_acc: ", theta_acc)

                return gt_recurring(r_acc, theta_acc, condition, count + 1, maximum_r_change)

        if inout == 1:
            condition = True
        else:
            condition = False

        # rr, Fi, count = gt_recurring([r0], [theta0], condition, 0, 0.01)
        rr, Fi, count = gt_recurring([r0], [], condition, 0, maximum_r_change=1e-5)
        print(count)

    if (inout == -1):  # inward rays
        # print("inward ray")
        rf = np.abs(rstop)
        if (rf < periastron):
            print('periastron=', periastron, ' whereas magnitude of rstop=', rf)
            print('rstop cannot be smaller than periastron. bailing...')
            return 0
        elif (rstop > periastron):  # r0 and rstop on the same side of periastron
            print("same side")

            def gt_recurring(r_acc, theta_acc, condition, count, maximum_r_change):
                # print("r_acc: ", r_acc)
                recursionCompleted = False

                if condition:
                    # if r_acc[-1] >= rf:
                    if r_acc[-1] >= rf:
                        r_acc.pop()
                        theta_acc.pop()
                        recursionCompleted = True
                else:
                    if r_acc[-1] <= rf:
                        r_acc.pop()
                        theta_acc.pop()
                        recursionCompleted = True

                if recursionCompleted:
                    return r_acc, np.array(theta_acc), count
                else:
                    rr, maximum_r_change = get_next_rr(r_acc, theta_acc, condition, maximum_r_change)
                    uu = 1 / rr
                    phi = np.arcsin(np.sqrt((b2 - uu) / (b1 - uu) / m))
                    Fi = -updn * CC * ei(phi, m)

                    r_acc.append(rr)
                    theta_acc.append(Fi)

                    # print("r_acc: ", r_acc[-1])
                    # print("theta_acc: ", theta_acc[-1])

                    # print(len(r_acc) == len(theta_acc))

                    return gt_recurring(r_acc, theta_acc, condition, count + 1, maximum_r_change)

            if rstop > r0:
                condition = True
            else:
                condition = False

            rr, Fi, count = gt_recurring([r0], [theta0], condition, 0, maximum_r_change=0.01)
            print(count)

            print(rr[-1])
            print(Fi[-1])

        elif (rstop < -periastron) and (r0 == rf):
            print("rstop < -periastron")

            def gt_recurring(r_acc, theta_acc, condition, count, maximum_r_change):
                # print("r_acc: ", r_acc)
                recursionCompleted = False

                if r_acc[-1] >= periastron:
                    recursionCompleted = True

                if recursionCompleted:
                    return r_acc, np.array(theta_acc), count
                else:
                    rr_in, maximum_r_change = get_next_rr(r_acc, theta_acc, condition, maximum_r_change)
                    uu_in = 1 / rr_in
                    phi_in = np.arcsin(np.sqrt((b2 - uu_in) / (b1 - uu_in) / m))
                    Fi_in = -updn * CC * ei(phi_in, m)

                r_acc.append(rr)
                theta_acc.append(Fi)

                # print("r_acc: ", r_acc)
                # print("theta_acc: ", theta_acc)

                return gt_recurring(r_acc, theta_acc, condition, count + 1, maximum_r_change)

            rr_in, Fi_in, count = gt_recurring([r0], [theta0], True, 0, maximum_r_change=0.01)
            print(count)

            if (count % 2 == 0):
                # Put both sides of the ray together
                rr = np.concatenate((rr_in, rr_in[::-1]))
                Fi = np.concatenate((Fi_in, -Fi_in[::-1]))
            else:
                # Put both sides of the ray together
                rr = np.concatenate((rr_in, [periastron], rr_in[::-1]))
                Fi = np.concatenate((Fi_in, [0], -Fi_in[::-1]))
        elif (rstop < -periastron) and (r0 != rf):
            print("(rstop < -periastron) and (r0 != rf)")

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

            def gt_recurring_1(r_acc, theta_acc, condition, count, maximum_r_change):
                # print("r_acc: ", r_acc)
                recursionCompleted = False

                if r_acc[-1] >= r_out:
                    recursionCompleted = True

                if recursionCompleted:
                    r_acc.pop()

                    # # final
                    # final_uu = 1 / r_out
                    # final_phi = np.arcsin(np.sqrt((b2 - final_uu) / (b1 - final_uu) / m))
                    # final_Fi = -updn * CC * ei(final_phi, m)
                    #
                    # r_acc.append(r_out)
                    # theta_acc.append(final_Fi)

                    return r_acc, np.array(theta_acc), count
                else:
                    rr_out, maximum_r_change = get_next_rr(r_acc, theta_acc, condition, maximum_r_change)
                    uu_out = 1 / rr_out
                    # print(uu_out)
                    phi_out = np.arcsin(np.sqrt(np.abs(b2 - uu_out) / np.abs(b1 - uu_out) / m))

                    Fi_out = -updn * CC * ei(phi_out, m)

                r_acc.append(rr_out)
                theta_acc.append(Fi_out)

                # print("r_acc: ", r_acc)
                # print("theta_acc: ", theta_acc)

                return gt_recurring_1(r_acc, theta_acc, condition, count + 1, maximum_r_change)

            # rr_out = np.linspace(r_out, r_in, n_out, endpoint=False)
            # And then construct the ray from r_in to almost periastron
            # rr_in = np.linspace(r_in, periastron, n_in, endpoint=False)

            def gt_recurring_2(r_acc, theta_acc, condition, count, maximum_r_change):
                # print("r_acc: ", r_acc)
                recursionCompleted = False

                if r_acc[-1] >= r_in:
                    recursionCompleted = True

                if recursionCompleted:
                    r_acc.pop()  # this is because r_acc always contains 1 more element than theta_acc

                    # # final
                    # final_uu = 1 / periastron
                    # final_phi = np.arcsin(np.sqrt((b2 - final_uu) / (b1 - final_uu) / m))
                    # final_Fi = -updn * CC * ei(final_phi, m)
                    #
                    # r_acc.append(periastron)
                    # theta_acc.append(final_Fi)

                    return r_acc, np.array(theta_acc), count
                else:
                    rr_in, maximum_r_change = get_next_rr(r_acc, theta_acc, condition, maximum_r_change)
                    uu_in = 1 / rr_in
                    # print("uu_in: ", uu_in)
                    # print("b2: ", b2)
                    # print("b1: ", b1)
                    # print("m: ", m)
                    phi_in = np.arcsin(np.sqrt(np.abs(b2 - uu_in) / np.abs(b1 - uu_in) / m))
                    print(phi_in)
                    Fi_in = -updn * CC * ei(phi_in, m)

                r_acc.append(rr_in)
                theta_acc.append(Fi_in)

                # print("r_acc: ", r_acc)
                # print("theta_acc: ", theta_acc)

                return gt_recurring_2(r_acc, theta_acc, condition, count + 1, maximum_r_change)

            # print(r_out)
            # print(r_in)
            # print(periastron)

            # rr_out, Fi_out, count = gt_recurring_1([r_in], [], True, 0, maximum_r_change=0.01)
            # # rr_out, Fi_out, count = (np.array([]), np.array([]), 0)

            rr_out, Fi_out, count = gt_recurring_1([periastron], [], True, 0, maximum_r_change=0.01)
            # rr_out, Fi_out, count = (np.array([]), np.array([]), 0)

            print(count)
            rr_in, Fi_in, count = gt_recurring_2([periastron], [], True, 0, maximum_r_change=0.001)
            # rr_in, Fi_in, count = (np.array([]), np.array([]), 0)

            print(count)

            # rr, Fi, count = gt_recurring_1([r_in], [], True, 0, maximum_r_change=0.01)
            # print(count)

            # Add everything together to make the final ray
            if (r0 > rf):

                print("hobo")

                rr = np.concatenate((rr_out[::-1], rr_in[::-1], [periastron], rr_in))
                # Fi = np.concatenate((Fi_out, Fi_in, [0], -Fi_in[::-1]))
                Fi = np.concatenate((Fi_out[::-1], Fi_in[::-1], [0], -Fi_in))
            else:

                print("gobo")

                # rr = np.concatenate((rr_in[::-1], [periastron], rr_in, rr_out))
                # # Fi = np.concatenate((Fi_in, [0], -Fi_in[::-1], -Fi_out[::-1]))
                # Fi = np.concatenate((Fi_in[::-1], [0], -Fi_in, -Fi_out))
                #
                # rr = np.concatenate((rr_in[::-1], [periastron], rr_in, rr_out))
                # # Fi = np.concatenate((Fi_in, [0], -Fi_in[::-1], -Fi_out[::-1]))
                # Fi = np.concatenate((Fi_in[::-1], [0], -Fi_in, -Fi_out))

                rr = np.concatenate((rr_in[::-1], [periastron], rr_out))
                # Fi = np.concatenate((Fi_in, [0], -Fi_in[::-1], -Fi_out[::-1]))
                Fi = np.concatenate((Fi_in[::-1], [0], -Fi_out))


        else:
            # print('this should not happen! bailing.')
            return 0

    # Rotate so that the polar angle of the starting point matches
    theta_offset = Fi[0] - theta0
    Fi = Fi - theta_offset
    return rr, Fi


def get_next_rr(r_acc, theta_acc, condition, maximum_r_change):
    if len(r_acc) <= 5:
        if condition:
            # rr = r_acc[-1] + 1e-3
            rr = r_acc[-1] + 1e-5
        else:
            # rr = r_acc[-1] - 1e-3
            rr = r_acc[-1] - 1e-5
    else:
        # if consistently theta change is decreasing, then increase maximum_r_change

        x_arr = r_acc[:-1] * np.cos(theta_acc)
        y_arr = r_acc[:-1] * np.sin(theta_acc)

        delta_x = np.array([x1 - x2 for x1, x2 in zip(x_arr[:-1], x_arr[1:])])
        delta_y = np.array([y1 - y2 for y1, y2 in zip(y_arr[:-1], y_arr[1:])])

        delta_m = delta_y / delta_x

        # intersection between two lines
        delta = np.abs(np.array([np.arctan((m2 - m1) / (1 + m1 * m2))
                                 for m1, m2 in zip(delta_m[:-1], delta_m[1:])]))

        # rememebr, the lower the delta, the more sharp the angle, an angle of pi/2 means straight line.

        last_few = delta[-3:]
        last_few_5 = delta[-5:]

        #
        # last_few_rev = last_few[::-1]
        # last_few_sorted = sorted(last_few)

        # print("last_few: ", last_few)
        # print("r: ", r_acc[-2])

        if all(last_few[i] <= last_few[i + 1] for i in range(len(last_few) - 1)):
            # if the array is in ascending order, that means theta changes are becoming larger
            maximum_r_change *= 0.96
        # else:
        #     maximum_r_change *= 1.5

        if all(last_few_5[i] >= last_few_5[i + 1] for i in range(len(last_few_5) - 1)):
            maximum_r_change *= 1.2
        elif all(last_few_5[i] / last_few_5[i + 1] >= 1 / 2 for i in range(len(last_few_5) - 1)):
            maximum_r_change *= 1.01
        elif all(last_few[i] >= last_few[i + 1] for i in range(len(last_few) - 1)):
            maximum_r_change *= 1.1
        elif all(last_few[i] / last_few[i + 1] >= 1 / 2 for i in range(len(last_few) - 1)):
            maximum_r_change *= 1.02

        # if all(last_few_5[i] / last_few_5[i + 1] >= 1/2 for i in range(len(last_few_5) - 1)):
        #     maximum_r_change *= 1.2
        # elif all(last_few[i] / last_few[i+1] >= 1/2 for i in range(len(last_few)-1)):
        #     maximum_r_change *= 1.1

        # print("----")
        # print("maximum_r_change: ", maximum_r_change)

        #
        # if all(map(lambda x, y: x == y, last_few_rev, last_few_sorted)):
        #     # values are in ascending order technically cuz we use the reverse of last few
        #     maximum_r_change *= 2
        #
        # if all(map(lambda x, y: x == y, last_few, last_few_sorted)):
        #     # values are in ascending order in the last few

        # print("new: ", maximum_r_change)

        if math.isnan(theta_acc[-1]):
            print("is nan")
            print("rstop is not 1, there is some issue because the ray should be falling into BH")

        angle_change = abs(theta_acc[-1] - theta_acc[-2])
        # print("theta_acc: ", theta_acc)
        # print("angle_change: ", angle_change)

        orders_of_mag = angle_change ** 3 / maximum_r_change
        # print("orders_of_mag: ", orders_of_mag)

        # delta_rr = max(jump_dist / orders_of_mag, maximum_r_change)
        # delta_rr = min(maximum_r_change / orders_of_mag, maximum_r_change)
        delta_rr = min(maximum_r_change / orders_of_mag, maximum_r_change)

        delta_rr = min(delta_rr, 1)

        # print("delta_rr", delta_rr)

        if condition:
            rr = r_acc[-1] + delta_rr
        else:
            rr = r_acc[-1] - delta_rr

    return rr, maximum_r_change

def if_D_lt_Dcrit_get_ray(D, r0, theta0, delta0, rstop, npoints):
    # print("within lesser")
    # inout = 1 for outward rays at (r0,theta0), and -1 for inward rays
    # updn = 1 for rays above the radial direction, -1 for those below
    inout, updn = np.sign(np.cos(delta0)), np.sign(np.sin(delta0))
    print(inout)

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


def if_D_lt_Dcrit_get_ray_recusive_main(D, r0, theta0, delta0, rstop, npoints):
    print("within lesser")
    print("r0: ", r0)
    print("rstop: ", rstop)
    # inout = 1 for outward rays at (r0,theta0), and -1 for inward rays
    # updn = 1 for rays above the radial direction, -1 for those below
    inout, updn = np.sign(np.cos(delta0)), np.sign(np.sin(delta0))

    # print(rstop)

    # Get the only real root of f(u)
    beta = roots_fu(D, 1)

    # Following Abr & Stegun (7th ed.), pg. 597, sec. 17.4.70 and 17.4.71
    pp_beta = beta * (3 * beta - 1)  # p'(u) at beta
    ppp_beta = 6 * beta - 1  # p"(u) at beta
    lambda2 = np.sqrt(pp_beta)
    m = 0.5 - 0.125 * ppp_beta / lambda2

    # Set up the radial and inverse radial arrays
    # rr = np.linspace(r0, rstop, npoints)

    rstop_original = rstop
    print("rstop_original: ", rstop_original)

    def lr_recurring(r_acc, theta_acc, condition, maximum_r_change):
        # print("r_acc: ", r_acc)
        recursionCompleted = False

        # if condition:
        #     if r_acc[-1] >= rstop:
        #         recursionCompleted = True
        # else:
        #     if r_acc[-1] <= rstop:
        #         recursionCompleted = True

        print("cur r: ", r_acc[-1])
        if r_acc[-1] >= rstop:
            recursionCompleted = True

        # if r_acc[-1] < 2:
        #     recursionCompleted = True

        if recursionCompleted:
            r_acc.pop()

            return r_acc, theta_acc
        else:
            rr, maximum_r_change = get_next_rr(r_acc, theta_acc, condition, maximum_r_change)
            # print("rr: ", rr)

            uu = 1 / rr

            u_s = 1 / r0

            phi_s = np.arccos((lambda2 - u_s + beta) / (lambda2 + u_s - beta))
            Fs = ei(phi_s, m)

            phi = np.arccos((lambda2 - uu + beta) / (lambda2 + uu - beta))
            Fr = ei(phi, m)
            theta = (Fs - Fr) / np.sqrt(2 * lambda2)

            theta = inout * updn * theta + theta0
            # print("theta: ", theta)

            r_acc.append(rr)
            theta_acc.append(theta[0])

            # print("r_acc: ", r_acc)
            # print("theta_acc: ", theta_acc)

            return lr_recurring(r_acc, theta_acc, condition, maximum_r_change)

    # if rstop > r0:
    #     condition = True
    # else:
    #     condition = False

    # rr, theta = lr_recurring([r0], [theta0], condition, 0.01)

    if rstop > r0:
        print("going away from bh")

        if delta0 == 0:
            rr = np.linspace(r0, rstop, 70)
            theta = np.repeat(theta0, 70)
        else:
            # rr, theta = lr_recurring([r0], [], True, 0.01)
            rr, theta = lr_recurring([r0], [], True, 5e-3)

    else:
        print("falling into bh")
        # now going outward but since it was originally going into blackhole must reverse our outward
        # going values; also need to set rstop to r0

        # rstop_dummy = rstop

        rstop = r0

        print("AA rstop_original: ", rstop_original)

        rr, theta = lr_recurring([rstop_original], [], True, 1e-3)
        rr = rr[::-1]
        theta = theta[::-1]

    print(len(rr))

    return rr, theta


# Eq. (231) from Chandrasekhar (1983).
def u_Dcrit(theta, theta0):
    tmp = np.tanh((theta - theta0) / 2)
    return 0.5 * tmp * tmp - 1 / 6


vec_u_Dcrit = np.vectorize(u_Dcrit)


def if_D_eq_Dcrit_get_ray(r0, theta0, delta0, rstop_nturns, npoints):
    delta0 = delta0 + np.pi
    print("delta0: ", delta0)
    # inout = 1 for outward rays at (r0,theta0), and -1 for inward rays
    # updn = 1 for rays above the radial direction, -1 for those below
    inout, updn = np.sign(np.cos(delta0)), np.sign(np.sin(delta0))

    print("inout: ", inout)

    # What should theta_0 in Chandrasekhar's eq. (231) be so that the ray goes
    # through the point (1/r0, 0) in polar coordinates
    theta_0 = -2 * np.arctanh(np.sqrt(2 * (1 / r0 + 1 / 6)))
    print("theta_0: ", theta_0)

    if inout == +1:
        umin = 1 / rstop_nturns
        print("umin: ", umin)
        # What is the polar angle of this ray (i.e. the one going thru (1/r0,0) in
        # polar coordinates) at umin
        theta_umin = theta_0 + 2 * np.arctanh(np.sqrt(2 * (umin + 1 / 6)))
        # print("theta_umin: ", theta_umin)
        theta_vec = np.linspace(0, theta_umin, npoints)
        # print("theta_vec: ", theta_vec)
        u_vec = vec_u_Dcrit(theta_vec, theta_0)
        print("u_vec: ", u_vec)
    elif inout == -1:
        num_turns = rstop_nturns
        theta_vec = np.linspace(0, num_turns * 2 * np.pi, npoints)
        u_vec = vec_u_Dcrit(theta_vec, theta_0)
        print("u_vec: ", u_vec)
    else:
        print('undefined direction in D_eq_Dcrit case. bailing.')
        return 0

    # Add offset the angles to rotate such the the ray passes through
    # (r0,theta0), and flip (if needed) to match the direction correctly
    return 1 / u_vec, theta0 - inout * updn * theta_vec


def schwarzschild_get_ray(r0, theta0, delta0, rstop, npoints):
    # Get the impact parameter
    D = r0 * np.abs(np.sin(delta0)) / np.sqrt(1 - 2 / r0)
    D_minus_Dcrit = D - Dcrit

    print("D: ", D)
    print("D_minus_Dcrit: ", D_minus_Dcrit)

    if (np.abs(D_minus_Dcrit) < abstol):
        print("equal")
        rr, theta = if_D_eq_Dcrit_get_ray(r0, theta0, delta0, rstop, npoints)

    #     for some reason the direction is mirrored across the x axis.
        theta = - theta
    elif (D > Dcrit):
        # print("greater")
        # for r = 10, delta = 100 D > Dcrit
        # rr, theta = if_D_gt_Dcrit_get_ray(D, r0, theta0, delta0, rstop, npoints)
        rr, theta = if_D_gt_Dcrit_get_ray_recusive_main(D, r0, theta0, delta0, rstop, npoints)
        # if rstop > r0:
        #     condition = True
        # else:
        #     condition = False
        # rr, theta = if_D_gt_Dcrit_get_ray_new(D, r0, theta0, delta0, [r0], [theta0], rstop, condition, npoints)
    elif (D < Dcrit):
        # print("lesser")
        # rr, theta = if_D_lt_Dcrit_get_ray(D, r0, theta0, delta0, rstop, npoints)
        rr, theta = if_D_lt_Dcrit_get_ray_recusive_main(D, r0, theta0, delta0, rstop, npoints)

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
    B = r0 / np.sqrt(1 - 2 / r0)  # D is b, B is B(r0) from Astrokubuntu
    D_minus_Dcrit = D - Dcrit
    print("D_minus_Dcrit: ", D_minus_Dcrit)

    if np.absolute(D_minus_Dcrit) < abstol:
        print("hahahahahahahah")
        # number of turns
        rstop = 2
    else:

        delta0 = abs(delta0)

        escape_to_inf = False

        if (2 * M < r0 < 3 * M) & (delta0 < 2 * np.pi) & (np.sin(delta0) < Dcrit * M / B):
            escape_to_inf = True
            print("case 1")
        elif (r0 == 3 * M) & (delta0 < np.pi / 2):
            escape_to_inf = True
            print("case 2")
        elif (r0 > 3 * M) & ((delta0 <= np.pi / 2) or ((delta0 > np.pi / 2) & (np.sin(delta0) > Dcrit * M / B))):
            escape_to_inf = True
            print("case 3")


        print("escape_to_inf: ", escape_to_inf)
        if escape_to_inf:
            # rstop > r0
            if r0 > np.sqrt(20 ** 2 + 40 ** 2):  # values determined from bounds of build traces screen
                rstop = r0 + np.sqrt(20 ** 2 + 40 ** 2) + 5  # 5 buffer
            else:
                rstop = np.sqrt(20 ** 2 + 40 ** 2) + 5  # 5 buffer
        else:
            print("so I've come here...")
            # rstop < r0
            # rstop = 2
            rstop = 1

    # rstop = 1
    # print("delta0: ", delta0)
    if (np.pi / 2 < np.abs(delta0) < np.pi) and (rstop != 1):
        print("making rstop negative")
        rstop = -rstop
        # rstop = rstop

    return rstop


def schwarzschild_get_ray_cartesian(x, y, delta0):
    print("x: ", x)
    print("y: ", y)
    print("delta0: ", delta0)
    M = 1

    delta0 = np.deg2rad(delta0)
    r0 = np.sqrt(x ** 2 + y ** 2)
    theta0 = np.arccos(np.abs(x) / r0)
    # theta0 = np.arcsin(y / r0)

    print("r0: ", r0)
    print("theta0: ", theta0)

    # # print("D_minus_Dcrit: ", D_minus_Dcrit)

    npoints = 500

    # determining rstop
    rstop = get_rstop(M, r0, delta0)
    # rstop = 20

    print("rstop: ", rstop)

    # delta0 = np.rad2deg(delta0)

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


# x_arr, y_arr = schwarzschild_get_ray_cartesian(-7.854910932268416, -19.758335949125744, 166.15841300952945)

# hi
# r_arr, theta_arr = schwarzschild_get_ray(3.1, 0, np.deg2rad(90), 10, 183)

# same side
# r_arr, theta_arr = schwarzschild_get_ray(3.1, 0, np.deg2rad(100), 10, 183)
# print(r_arr[-1])
# print(theta_arr[-1])

# x_arr, y_arr = schwarzschild_get_ray_cartesian(-12.575892530168806, -28.240477062406995, 172.3370949374974)
# x_arr, y_arr = schwarzschild_get_ray_cartesian(6, 70, 3)
# x_arr, y_arr = schwarzschild_get_ray_cartesian(3.1, 0, 93.2)

x_arr, y_arr = schwarzschild_get_ray_cartesian(3, 0, 0)

# r_arr, theta_arr = schwarzschild_get_ray(6, np.deg2rad(70), np.deg2rad(45), 10, 183)
# x = 3.1 * np.cos(np.deg2rad(45))
# y = 3.1 * np.sin(np.deg2rad(45))
# delta0 = 172.34
#
# x = 10
# y = 10
# delta0 = 0

# x_arr, y_arr = schwarzschild_get_ray_cartesian(3.1, 0, 93.16)
# x_arr, y_arr = schwarzschild_get_ray_cartesian(3.1, 0, 30)


# rstop < -periastron
# r_arr, theta_arr = schwarzschild_get_ray(3.1, 0, np.deg2rad(80), 10, 183)

# (rstop < -periastron) and (r0 != rf)
# r_arr, theta_arr = schwarzschild_get_ray(3.1, np.deg2rad(45), np.deg2rad(94), 10, 183)
# #
# import matplotlib.pyplot as plt
#
#
# # plt.axes(projection='polar')
# # plt.polar(theta7_arr, r_arr, 'b-', marker='o')
# #
# # plt.figure(figsize=(12, 12))
# #
# # fig = plt.figure()
# # ax = fig.add_subplot(111)
# # #
# # #
# # ax.set_aspect('equal', adjustable='box')
# #
# #
# plt.plot(x_arr, y_arr, marker='o')
# # plt.plot(x_arr, y_arr)
#
# plt.title('Ray from (' + str(round(x_arr[0], 2)) + ', ' + str(round(y_arr[0], 2)) + ') with delta0 ' + str(delta0))
# #
# plt.show()
