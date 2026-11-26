try:
    result = 1 / 0
except ZeroDivisionError:
    print("caught")
finally:
    print("done")
