students = [
    {'name': 'Ada', 'scores': (90, 95)},
    {'name': 'Bob', 'scores': (80, 70)},
]
top = None
best = -1
for s in students:
    avg = sum(s['scores']) / 2
    if avg > best:
        best = avg
        top = s['name']
print(top, best)
