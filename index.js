'use strict';

const calculateWrapper = document.querySelector('.calculator-wrapper');
const outputValue = document.querySelector('.current-operations-field');

const signMultiply = document.querySelector('.button-multiply');
const signdivide = document.querySelector('.button-divide');
const signminus = document.querySelector('.button-minus');
const outputFieldDisplay = document.querySelector('.operations-field');
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

let newNumber = false;
let equals = false;
let additionalOperations = false;
let resultOperationSquare = 0;
let currentNumber = 0;
let intermediateNumber;
let sign = '';
let string = '';

const buttonHandler = (value) => {
  const lastValue = value;
  if (value === '') {
    return;
  }

  if (outputValue.textContent === '0' && value === 'plusmn') {
    return
  }

  if (
    outputFieldDisplay.textContent.includes('(-)') && value === 'plusmn' ||
    outputFieldDisplay.textContent.includes('=') ||
    outputFieldDisplay.textContent.includes('square') && sign === '' ||
    outputFieldDisplay.textContent.includes('%') && lastValue === '%' ||
    outputFieldDisplay.textContent.includes('square root') && sign === ''
    ) {
      return;
    }

    outputFieldDisplay.textContent === '0' && value !== '.' ?
    outputFieldDisplay.textContent = value : outputFieldDisplay.textContent += value;

    string = outputFieldDisplay.textContent;


  if (value === 'plusmn') {
    if (currentNumber.includes('-')) {
      outputFieldDisplay.textContent = string.replace(/plusmn/g, '(-)');
    }
    return;
  }
};

// ввод чисел
const buttonNumberHaandler = (number) => {
  let num = '0.';
  if (equals) {
    cleanAllHandler();
  }
  if (number === '.' && outputValue.textContent.includes('.')) {
    return;
  }
  if (!newNumber) {
    outputValue.textContent === '0' && number !== '.' ?
      outputValue.textContent = number : outputValue.textContent += number;
    currentNumber = outputValue.textContent;
  } else {
    newNumber = false;
    number === '.' ? outputValue.textContent = num : outputValue.textContent = number;
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

  if (currentNumber === 0 || equals) {
    input = [];
    output = [];
    stack = [];
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
  equals = true;
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
  if (outputValue.textContent === 'Infinity') {
    outputValue.textContent = 'Нельзя делить на ноль';
    return outputValue.textContent;
  }
  return +outputValue.textContent;
};

let getResultOperationSquare = (num) => {
  if (additionalOperations) {
    return;
  }
  if (!Number.isInteger(num)) {
    outputValue.textContent = +num.toFixed(10);
  } else {
    outputValue.textContent = num;
  }
  currentNumber = +outputValue.textContent;
  additionalOperations = true;
};

const squareHandler = () => {
  resultOperationSquare = Math.pow(outputValue.textContent, 2);
  getResultOperationSquare(resultOperationSquare);
  additionalOperations = true;
};

const squareRootHandler = () => {
  resultOperationSquare = Math.sqrt(outputValue.textContent);
  getResultOperationSquare(resultOperationSquare);
  additionalOperations = true;
};

// общий сброс
const cleanAllHandler = () => {
  outputValue.textContent = '0';
  outputFieldDisplay.textContent = '0';
  newNumber = false;
  equals = false;
  additionalOperations = false;
  currentNumber = 0;
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

    if (outputFieldDisplay.textContent.length > 1 ) {
    outputFieldDisplay.textContent = outputFieldDisplay.textContent.substring(0, outputFieldDisplay.textContent.length - 1);
  } else {
    outputFieldDisplay.textContent = '0';
  }
};

const positiveNegativeButtonHandler = () => {
  outputValue.textContent = -outputValue.textContent;
  currentNumber = outputValue.textContent;
  string = outputFieldDisplay.textContent;
};

positiveNegativeButton.addEventListener('click', () => positiveNegativeButtonHandler());

squareRoot.addEventListener('click', () => squareRootHandler());
square.addEventListener('click', () => squareHandler());
lastValueOfNumber.addEventListener('click', lastValueOfNumberHandler);
result.addEventListener('click', () => resultButtonHandler());
cleanAll.addEventListener('click', () => cleanAllHandler());

calculateWrapper.addEventListener('click', (evt) => {
  const outputValue = evt.target.closest('.button');
  const buttonNumber = evt.target.closest('.button-number');
  const operationButton = evt.target.closest('.button-operation');

  outputValue ? buttonHandler(outputValue.value) : '';

  buttonNumber ? buttonNumberHaandler(buttonNumber.value) : '';

  operationButton ? buttonOperationHandler(operationButton.value) : '';

  console.log(input, output, stack, currentNumber, sign,  equals, additionalOperations,newNumber)
});
