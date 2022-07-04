'use strict';

const calculateWrapper = document.querySelector('.calculator-wrapper');
const outputValue = document.querySelector('.current-operations-field');

const signMultiply = document.querySelector('.button-multiply');
const signdivide = document.querySelector('.button-divide');
const signminus = document.querySelector('.button-minus');
const displayOperations = document.querySelector('.operations-field');
const positiveNegativeButton = document.querySelector('.button-positive-negative');
const lastValueOfNumber = document.querySelector('.del-one-char');
const square = document.querySelector('.square');
const squareRoot = document.querySelector('.square-root');
const cleanAll = document.querySelector('.clean');
const result = document.querySelector('.result-button');

const operators = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
};

let input = [];
let output = [];
let stack = [];
let displayOutput = [];

let newNumber = false;
// let equals = false;
let currentNumber = 0;
let intermediateNumber;
let sign = '';
let lastSign = '';


const buttonHandler = (value) => {
  // if (equals) {
  //   displayOutput = ['0'];
  //   return;
  // }
  displayOutput.push(value);
};

// ввод чисел
const buttonNumberHaandler = (number) => {
  if (lastSign === '=') {
    cleanAllHandler();
  }
  // equals = true;
  if (number === '.' && outputValue.textContent.includes('.')) {
    return;
  }
  if (!newNumber) {
    outputValue.textContent === '0' && number !== '.'?
      outputValue.textContent = number : outputValue.textContent += number;
    currentNumber = outputValue.textContent;
  } else {
    newNumber = false;
    outputValue.textContent = number;
    currentNumber = outputValue.textContent;
  }
};

// ввод знака
const buttonOperationHandler = (operation) => {
  if (currentNumber === 0) {
    return;
  }
  if (operation === '+' || operation === '-' || operation === '*' || operation === '/') {
    outputValue.textContent = operation;
  }

  operation === '*' ? outputValue.textContent = signMultiply.textContent : '';
  operation === '/' ? outputValue.textContent = signdivide.textContent : '';
  operation === '-' ? outputValue.textContent = signminus.textContent : '';

  input.push(Number(currentNumber))
  sign = operation;
  newNumber = true;
  input.push(sign)
}

// получение результата
const resultButtonHandler = () => {

  if (currentNumber === 0 || lastSign === '=') {
    return;
  }
  currentNumber = outputValue.textContent;
  input.push(Number(currentNumber));

  getReverseNotation(input);
  if (stack.length === 2) {
    output.push(stack[stack.length - 1]);
    output.push(stack[0]);
    stack = [];
  } else {
    output.push(stack[stack.length - 1]);
    stack = [];
  }
  outputValue.textContent = getOperationResult(output);
  sign = '';
  lastSign = '=';
  // equals = false;
}

// получение обратной нотации
let getReverseNotation = (input) => {

  input.forEach((item) => {
    if (typeof item !== 'string') {
      output.push(item)
    }
    if (typeof item === 'string') {
      let lastEl = stack[stack.length - 1];
      let firstEl = stack[0]
      if (stack.length === 0) {
        stack.push(item);
      } else {

        if (operators[item] < operators[lastEl]) {
          if (stack.length === 2) {
            output.push(lastEl);
            output.push(firstEl);
          } else {
            output.push(lastEl);
          }
          stack = [];
          stack.push(item);
        }

        if (operators[lastEl] === operators[item]) {
          output.push(lastEl);
          stack.pop();
          stack.push(item);
        }
        if (operators[lastEl] < operators[item]) {
          stack.push(item);
        }
      }
    }
  });
};

// выполнение операций
const getOperationResult = (output) => {
  const operations = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
    '%': (x, y) => x * (y / 100),
  };
  let stack = [];

  output.forEach((item) => {
    if (item in operations) {
      let [y, x] = [stack.pop(), stack.pop()];
      stack.push(operations[item](x, y));
    } else {
      stack.push(parseFloat(item));
    }
  });
  outputValue.textContent = stack.pop().toFixed(10);
  return +outputValue.textContent;
};

const squareHandler = () => {
  outputValue.textContent = Math.pow(outputValue.textContent, 2).toFixed(10);
  currentNumber = +outputValue.textContent;
};

const squareRootHandler = () => {
  outputValue.textContent = Math.sqrt(outputValue.textContent).toFixed(10);
  currentNumber = +outputValue.textContent;

};

// общий сброс
const cleanAllHandler = () => {
  outputValue.textContent = '0';
  newNumber = false;
  currentNumber = 0;
  lastSign = '';
  // equals = '';
  sign = '';
  input = [];
  output = [];
  stack = [];
};

//сброс последнего символа
const lastValueOfNumberHandler = () => {
  intermediateNumber = '';
  outputValue.textContent.length <= 1 ?
    intermediateNumber = 0 : intermediateNumber += outputValue.textContent.slice(0, -1);
  outputValue.textContent = intermediateNumber;
  currentNumber = outputValue.textContent;
  intermediateNumber = '';
};

positiveNegativeButton.addEventListener('click', () => {
  outputValue.textContent = -outputValue.textContent;
  currentNumber = outputValue.textContent;
});

squareRoot.addEventListener('click', () => squareRootHandler());
square.addEventListener('click', () => squareHandler());
lastValueOfNumber.addEventListener('click', lastValueOfNumberHandler);
result.addEventListener('click', () => resultButtonHandler());
cleanAll.addEventListener('click', () => cleanAllHandler());

calculateWrapper.addEventListener('click', (evt) => {
  const button = evt.target.closest('.button');
  const buttonNumber = evt.target.closest('.button-number');
  const operationButton = evt.target.closest('.button-operation');

  button ? buttonHandler(button.value) : '';

  buttonNumber ? buttonNumberHaandler(buttonNumber.value) : '';

  operationButton ? buttonOperationHandler(operationButton.value) : '';

  console.log(input, output, stack, currentNumber, sign, displayOutput, lastSign)
  displayOperations.textContent = displayOutput.join('');
});
