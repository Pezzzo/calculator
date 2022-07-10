'use strict';

const calculateWrapper = document.querySelector('.calculator-wrapper');
const outputValue = document.querySelector('.current-operations-field');

const outputFieldDisplay = document.querySelector('.operations-field');
const positiveNegativeButton = document.querySelector('.button-positive-negative');
const lastValueOfNumber = document.querySelector('.del-one-char');
const cleanAll = document.querySelector('.clean');
const result = document.querySelector('.result-button');

const operators = {
  '+': 1,
  '−': 1,
  '×': 2,
  '÷': 2,
  '%': 3,
  '^': 3,
  '√': 3,
};

let input = [];
let output = [];
let stack = [];
let display = [];

let lastSign = '';
let newNumber = false;
let equals = false;
let currentNumber = 0;
let intermediateNumber;
let sign = '';
outputFieldDisplay.textContent = '0';

// вывод всех операций
const buttonHandler = (value) => {
  if (outputFieldDisplay.textContent.includes('=')) {
    return;
  }

  if (value === '√' && outputFieldDisplay.textContent.length - 1 === '√') {
    return
  }

  if (value === 'plusmn') {
    return;
  }

  if (value === '=') {
    display.push(currentNumber);
    display.push(value);
    outputFieldDisplay.textContent = display.join(' ');
  }

  if (!isNaN(value) || value === '.' && outputValue.textContent.includes('.')) {
    outputFieldDisplay.textContent = display.join(' ').concat(' ' + currentNumber);
  } else {
    outputFieldDisplay.textContent = display.join(' ');
  }
};

// ввод чисел
const buttonNumberHaandler = (number) => {
  let num = '0.';

  equals ? cleanAllHandler() : '';

  if (number === '.' && outputValue.textContent.includes('.')) {
    outputFieldDisplay.textContent = display.join(' ').concat('' + currentNumber);
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

  if (operation === '√' && display[display.length - 1] === '√') {
    return;
  }

  if (sign === '√') {
    display.push('√');
  }

  outputValue.textContent = operation;
  sign = operation;
  lastSign = operation;

  if (newNumber) {
    input.pop();
    input.push(operation);

    display.pop();
    display.push(operation);
    outputFieldDisplay.textContent = display.join(' ');
    return;
  }

  sign = operation;
  input.push(Number(currentNumber));
  display.push(currentNumber);
  display.push(operation);
  newNumber = true;
  input.push(sign);


  if (sign === '√') {
    input.push(NaN);
    input.push('');
  }
};

// получение результата
const resultButtonHandler = () => {
  if (currentNumber === 0 || equals) {
    input = [];
    output = [];
    stack = [];
    return;
  }

  if (sign === '√') {
    input.pop();
    input.pop();
    display.pop();
  }

  currentNumber = outputValue.textContent;
  input.push(Number(currentNumber));

  getReverseNotation(input);
  if (stack.length === 3) {
    output.push(stack[stack.length - 1]);
    output.push(stack[1]);
    output.push(stack[0]);
    stack = [];

  } else if (stack.length === 2) {
    output.push(stack[stack.length - 1]);
    output.push(stack[0]);
    stack = [];

  } else {
    output.push(stack[stack.length - 1]);
    stack = [];
  }

  if (sign === '' && currentNumber !== 0) {
    outputValue.textContent = currentNumber;
  } else {
    outputValue.textContent = getOperationResult(output);
  }

  sign = '';
  equals = true;
};

// получение обратной нотации
let getReverseNotation = (input) => {
  input.forEach((item) => {

    if (typeof item !== 'string') {
      output.push(item)
    }

    if (typeof item === 'string') {

      let firstEl = stack[0];
      let secondEl = stack[1];
      let lastEl = stack[stack.length - 1];

      if (stack.length === 0) {
        stack.push(item);
      } else {

        if (operators[item] < operators[lastEl]) {
          if (stack.length === 3) {
            output.push(lastEl);
            output.push(secondEl);
            output.push(firstEl);

          } else if (stack.length === 2) {
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
  console.log(input)
};

// выполнение операций
const getOperationResult = (output) => {
  let stack = [];

  const operations = {
    '+': (x, y) => x + y,
    '−': (x, y) => x - y,
    '×': (x, y) => x * y,
    '÷': (x, y) => x / y,
    '%': (x, y) => x * (y / 100),
    '^': (x, y) => x ** y,
    '√': (x) => Math.sqrt(x)
  };

  output.forEach((item) => {
    if (item in operations) {
      let [y, x] = [stack.pop(), stack.pop()];
      stack.push(operations[item](x, y));
    }
    else {
      stack.push(parseFloat(item));
    }
  });

  outputValue.textContent = stack.pop().toFixed(10);
  if (outputValue.textContent === 'Infinity') {
    outputValue.textContent = 'Нельзя делить на ноль!';
    return outputValue.textContent;
  }
  if (outputValue.textContent === 'NaN') {
    outputValue.textContent = 'Ошибка';
    return outputValue.textContent;
  }
  return +outputValue.textContent;
};

// общий сброс
const cleanAllHandler = () => {
  outputValue.textContent = '0';
  outputFieldDisplay.textContent = '0';
  newNumber = false;
  equals = false;
  currentNumber = 0;
  sign = '';
  lastSign = '';
  input = [];
  output = [];
  stack = [];
  display = [];
};

//сброс последнего символа
const lastValueOfNumberHandler = () => {
  intermediateNumber = '';
  outputValue.textContent.length <= 1 ?
    intermediateNumber = 0 : intermediateNumber += outputValue.textContent.slice(0, -1);
  outputValue.textContent = intermediateNumber;
  currentNumber = outputValue.textContent;
  intermediateNumber = '';

  if (outputFieldDisplay.textContent.length > 1) {
    outputFieldDisplay.textContent = outputFieldDisplay.textContent.substring(0, outputFieldDisplay.textContent.length - 1);
  } else {
    outputFieldDisplay.textContent = '0';
  }
};

const positiveNegativeButtonHandler = () => {
  outputValue.textContent = -outputValue.textContent;
  currentNumber = outputValue.textContent;
  outputFieldDisplay.textContent = display.join(' ').concat(currentNumber);
};

positiveNegativeButton.addEventListener('click', () => positiveNegativeButtonHandler());
lastValueOfNumber.addEventListener('click', lastValueOfNumberHandler);
result.addEventListener('click', () => resultButtonHandler());
cleanAll.addEventListener('click', () => cleanAllHandler());

calculateWrapper.addEventListener('click', (evt) => {
  const outputValue = evt.target.closest('.button');
  const buttonNumber = evt.target.closest('.button-number');
  const operationButton = evt.target.closest('.button-operation');

  buttonNumber ? buttonNumberHaandler(buttonNumber.value) : '';

  operationButton ? buttonOperationHandler(operationButton.value) : '';

  outputValue ? buttonHandler(outputValue.value) : '';

  console.log(input, output, stack, newNumber, currentNumber, equals, sign, lastSign)
});
