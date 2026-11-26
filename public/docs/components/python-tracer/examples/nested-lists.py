shared = [1, 2]
rows = [shared, [3, 4], shared]

print(rows)
print(rows[0] is rows[2])

rows[0].append(5)
print(rows)
