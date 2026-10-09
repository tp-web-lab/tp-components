from js import document
from pyodide.ffi import create_proxy

title = document.getElementById("title")
button = document.getElementById("btn")
output = document.getElementById("output")


def on_click(event):
    title.style.color = "blue"
    title.textContent = "Clicked from Python!"
    output.textContent = "Button clicked 🎉"

    new_div = document.createElement("div")
    new_div.textContent = "New <div> created from Python"
    document.body.appendChild(new_div)


on_click_proxy = create_proxy(on_click)

print(title.textContent)

button.addEventListener("click", on_click_proxy)