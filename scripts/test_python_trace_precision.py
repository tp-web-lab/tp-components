"""Recorder regression tests; run with python3 scripts/test_python_trace_precision.py."""
import json
import math
import sys
import unittest
from pathlib import Path
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'src/components/python-tracer/vendor'))
from pg_encoder import encode_primitive

class PrecisionTests(unittest.TestCase):
    def test_finite_values_survive_json_round_trip(self):
        for value in (3.00009155413138, 75.00014999664018, 1e-12, 0.1 + 0.2, -1.2345678901234567, 5e-324, 1.7976931348623157e308):
            with self.subTest(value=value):
                saved = json.loads(json.dumps(encode_primitive(value)))
                restored = float(saved[1]) if isinstance(saved, list) else saved
                self.assertEqual(restored, value)
    def test_integral_float_and_negative_zero(self):
        for value in (55.0, -0.0, 1e20):
            saved = encode_primitive(value)
            self.assertEqual(saved, ['SPECIAL_FLOAT', repr(value)])
            self.assertEqual(math.copysign(1, float(saved[1])), math.copysign(1, value))
    def test_nonfinite_values_remain_valid_json(self):
        for value, label in ((float('inf'), 'Infinity'), (float('-inf'), '-Infinity'), (float('nan'), 'NaN')):
            self.assertEqual(json.loads(json.dumps(encode_primitive(value), allow_nan=False)), ['SPECIAL_FLOAT', label])

if __name__ == '__main__':
    unittest.main()
