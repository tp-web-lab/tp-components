class Counter:
    def __init__(self, value=0):
        self.value = value

    def increment(self):
        self.value += 1
        return self.value

counter = Counter(3)
alias = counter

print(counter.increment())
print(alias.value)
print(alias is counter)
