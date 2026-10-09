import unittest
from double import double

class DoubleTests(unittest.TestCase):
    def test_positive(self):
        self.assertEqual(double(3), 6)

    def test_zero(self):
        self.assertEqual(double(0), 0)

    def test_negative(self):
        self.assertEqual(double(-2), -4)
