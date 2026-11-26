"""Expression recording preserves Python evaluation semantics and source positions."""
import sys
import unittest
from pathlib import Path
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'src/components/python-tracer/vendor'))
import pg_logger


def record(source):
    return pg_logger.exec_script_str_local(source, None, False, False, lambda code, trace: trace)


class ExpressionTests(unittest.TestCase):
    def test_constant_expression_order_and_ranges(self):
        source = 'print(3 * (2 * 4 + (3 + 5)) + ((10 - 7) + 6))'
        trace = record(source)
        expressions = [s for s in trace if 'expression' in s]
        self.assertEqual([s['expression']['value'] for s in expressions], [8, 8, 16, 48, 3, 9, 57])
        self.assertEqual([source[s['source_range']['start']:s['source_range']['end']] for s in expressions],
                         ['2 * 4', '3 + 5', '2 * 4 + (3 + 5)', '3 * (2 * 4 + (3 + 5))', '10 - 7', '(10 - 7) + 6', '3 * (2 * 4 + (3 + 5)) + ((10 - 7) + 6)'])
        self.assertEqual(trace[-1]['stdout'], '57\n')
        self.assertFalse(any(name.startswith('__tp_expression_') for s in trace for name in s.get('globals', {})))

    def test_side_effects_short_circuit_and_chained_comparisons(self):
        source = '''calls = []
def f(x):
    calls.append(x)
    return x
print(f(2) + f(3))
print(False and f(99))
print(True or f(98))
print(f(1) < f(2) < f(3))
print(f(4) if True else f(97))
print(calls)
'''
        trace = record(source)
        self.assertEqual(trace[-1]['stdout'], '5\nFalse\nTrue\nTrue\n4\n[2, 3, 1, 2, 3, 4]\n')
        self.assertFalse(any('exception_msg' in s for s in trace))

    def test_unicode_multiline_and_exception(self):
        source = 'emoji = "😀"; result = (2 +\n 3)\nprint(result)'
        step = next(s for s in record(source) if 'expression' in s)
        a, b = step['source_range']['start'], step['source_range']['end']
        self.assertEqual(source.encode('utf-16-le')[2*a:2*b].decode('utf-16-le'), '2 +\n 3')
        trace = record('print((2 + 3) / 0)')
        self.assertEqual([s['expression']['value'] for s in trace if 'expression' in s], [5])
        self.assertTrue(any('ZeroDivisionError' in s.get('exception_msg', '') for s in trace))

    def test_operator_overloads_and_closures(self):
        source = '''class Number:
    def __init__(self, value):
        self.value = value
    def __add__(self, other):
        return Number(self.value + other.value)
def make_counter():
    count = 0
    def tick():
        nonlocal count
        count = count + 1
        return count
    return tick
counter = make_counter()
print((Number(2) + Number(3)).value)
print(counter() + counter())
'''
        trace = record(source)
        self.assertEqual(trace[-1]['stdout'], '5\n3\n')
        self.assertFalse(any('exception_msg' in s for s in trace))
        self.assertTrue(any(isinstance(s.get('expression', {}).get('value'), list) and s['expression']['value'][0] == 'REF' for s in trace))

    def test_annotations_and_match_patterns_remain_native(self):
        source = """from __future__ import annotations
def f(x: int | str) -> int | str:
    match x:
        case -1:
            return 2 + 3
    return x
print(f.__annotations__)
print(f(-1))
"""
        trace = record(source)
        self.assertEqual(trace[-1]['stdout'], "{'x': 'int | str', 'return': 'int | str'}\n5\n")

    def test_helper_name_does_not_hide_user_variables(self):
        record('print(1 + 2)')
        trace = record('__tp_expression_0__ = 10\nprint(__tp_expression_0__ + 1)')
        self.assertEqual(trace[-1]['stdout'], '11\n')
        self.assertEqual(trace[-1]['globals']['__tp_expression_0__'], 10)

    def test_short_circuit_does_not_repeat_truth_test(self):
        source = """checks = []
class Flag:
    def __bool__(self):
        checks.append(1)
        return True
value = Flag() or False
print(checks)
"""
        self.assertEqual(record(source)[-1]['stdout'], '[1]\n')

if __name__ == '__main__':
    unittest.main()
