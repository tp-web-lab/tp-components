class Counter:
    def __init__(self, value=0):
        self.value = value

    def increment(self):
        self.value += 1
        return self.value


class StepCounter(Counter):
    def __init__(self, value, step):
        super().__init__(value)
        self.step = step

    def increment(self):
        super().increment()
        self.value += self.step - 1
        return self.value


counter = StepCounter(3, 2)
print(counter.increment())
print(counter.increment())
print(isinstance(counter, Counter))
