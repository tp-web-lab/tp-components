import unittest

from main import add, is_even, multiply


class MathTests(unittest.TestCase):
    def test_adds_numbers(self):
        self.assertEqual(add(2, 3), 5)

    def test_multiplies_numbers(self):
        self.assertEqual(multiply(4, 5), 20)

    def test_detects_even_numbers(self):
        self.assertTrue(is_even(8))
        self.assertFalse(is_even(7))