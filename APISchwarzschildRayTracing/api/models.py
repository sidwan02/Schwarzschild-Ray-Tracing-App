from django.db import models


# Create your models here.


class Position(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()


class RayTracing(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    delta0 = models.FloatField()

    # def __str__(self):
    #     return "(" + x + ", " + y + ", " + z + ")"
