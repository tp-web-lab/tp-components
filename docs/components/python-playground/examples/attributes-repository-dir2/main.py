from js import document
from geometry import rectangle_area

area = rectangle_area(6, 4)
message = f"Area: {area}"
document.getElementById("result").textContent = message
print(message)
