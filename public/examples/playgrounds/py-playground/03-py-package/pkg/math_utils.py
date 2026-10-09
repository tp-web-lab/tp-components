import math

from .helper import multiply

def square(value):
    return multiply(value, value)

def hypotenuse(a, b):
    return math.sqrt(square(a) + square(b))