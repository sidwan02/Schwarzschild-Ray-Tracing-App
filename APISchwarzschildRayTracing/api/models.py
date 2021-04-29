from django.db import models

# Create your models here.


class Position(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()

    # def __str__(self):
    #     return "(" + x + ", " + y + ", " + z + ")"
