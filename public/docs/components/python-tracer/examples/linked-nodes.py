class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

first = Node(1)
second = Node(2)
first.next = second
second.next = first
alias = first

print(alias.next.value)
