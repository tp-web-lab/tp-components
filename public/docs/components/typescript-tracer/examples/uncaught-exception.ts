function fail() {
  throw new TypeError("Invalid value");
}

const value = 42;
fail();
console.log("This line is not reached");
