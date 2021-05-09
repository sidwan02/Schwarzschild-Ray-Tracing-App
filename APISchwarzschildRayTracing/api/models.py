from django.db import models


# Create your models here.


class Coordinate2D(models.Model):
    x = models.FloatField()
    y = models.FloatField()


class Coordinate3D(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()


class RayTracing2D(models.Model):
    x0 = models.FloatField()
    y0 = models.FloatField()
    delta0 = models.FloatField()

    # def __str__(self):
    #     return "(" + x + ", " + y + ", " + z + ")"


class RayTracing3D(models.Model):
    x0 = models.FloatField()
    y0 = models.FloatField()
    z0 = models.FloatField()
    alpha0 = models.FloatField()
    beta0 = models.FloatField()
    gamma0 = models.FloatField()
