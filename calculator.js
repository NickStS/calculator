"use strict";

let input = document.getElementById('input'),
  number = document.querySelectorAll('.numbers div'),
  operator = document.querySelectorAll('.TopPanel div, .RightPanel div'),
  result = document.getElementById('result'),
  clear = document.getElementById('clear'),
  deleteLast = document.getElementById('delete'),
  resultDisplayed = false;


let decimalEntered = false;


for (let i = 0; i < number.length; i++) {
  number[i].addEventListener("click", function (e) {
    
    let currentString = input.innerHTML;
    let lastChar = currentString[currentString.length - 1];

    if (currentString === "" && e.target.innerHTML === ".") {
      return;
    }

    if (lastChar === "." && e.target.innerHTML == ".") {
      return;
    }


    if (e.target.innerHTML === "." && decimalEntered) {
      return;
    }

    if (resultDisplayed === false) {
      input.innerHTML += e.target.innerHTML;
      if (e.target.innerHTML === ".") {
        decimalEntered = true;
      }
    } else if (resultDisplayed === true && ["+", "-", "×", "÷"].includes(lastChar)) {
      resultDisplayed = false;
      input.innerHTML += e.target.innerHTML;
    } else if (!(lastChar === "." && e.target.innerHTML === ".")) {
      input.innerHTML += e.target.innerHTML;
      if (e.target.innerHTML === ".") {
        decimalEntered = true;
      }
    }
  });
}

for (let i = 0; i < operator.length; i++) {
  operator[i].addEventListener("click", function(e) {

    let currentString = input.innerHTML;
    let lastChar = currentString[currentString.length - 1];

    if (["+", "-", "×", "÷"].includes(lastChar)) {
      let newString = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
      input.innerHTML = newString;
    } else if (currentString.length == 0) {
      console.log("enter a number first");
    } else {
      input.innerHTML += e.target.innerHTML;
      decimalEntered = false;
    }
  });
}

result.addEventListener("click", function() {
  let inputString = input.innerHTML;

  inputString = inputString.replace(/(?:^|[-+×÷])(\d+(?:\.\d+)?)\s*([×÷])\s*(\d+(?:\.\d+)?)/g, function(match, num1, operator, num2) {
    if (operator === "×") {
      return parseFloat(num1) * parseFloat(num2);
    } else if (operator === "÷") {
      if (parseFloat(num2) !== 0) {
        return parseFloat(num1) / parseFloat(num2);
      } else {
        return "NaN";
      }
    }
  });

  let result = inputString.split("+").reduce((acc, val) => acc + parseFloat(val), 0);
  result = result - inputString.split("-").slice(1).reduce((acc, val) => acc + parseFloat(val), 0);

  input.innerHTML = result;
  resultDisplayed = true;
});

clear.addEventListener("click", function() {
  input.innerHTML = "";
  decimalEntered = false;
});

let currentInput = '';

deleteLast.addEventListener("click", function() {
  let currentInput = input.innerHTML;
  currentInput = currentInput.slice(0, -2);
  input.innerHTML = currentInput;
  if (decimalEntered && currentInput[currentInput.length - 1] === ".") {
    decimalEntered = false;
  }
});


operator.forEach(btn => {
  btn.addEventListener("click", function() {
    btn.classList.add("active");
    setTimeout(function() {
      btn.classList.remove("active");
    }, 200);
  });
});

result.addEventListener("click", function() {
  result.classList.add("active");
  setTimeout(function() {
    result.classList.remove("active");
  }, 200);
});
