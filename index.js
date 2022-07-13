'use strict';

const calculateWrapper = document.querySelector('.calculator-wrapper');
const outputValue = document.querySelector('.current-operations-field');

const openBracket = document.querySelector('.open-bracket');
const closingBracket = document.querySelector('.closing-bracket');


const outputFieldDisplay = document.querySelector('.operations-field');
const positiveNegativeButton = document.querySelector('.button-positive-negative');
const lastValueOfNumber = document.querySelector('.del-one-char');
const cleanAll = document.querySelector('.clean');
const result = document.querySelector('.result-button');

const Operators = {
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

let sqrt = false;
let newNumber = false;
let equals = false;

let resultNumber = '';
let currentNumber = 0;
let sign = '';
let lastSign = '';
let intermediateNumber;
outputFieldDisplay.textContent = '0';

// счётчик скобок
const getBracketCount = (bracket, length) => {
  let count = 0;
  for (let i = 0; i < length; i++) {
    if (input[i] === bracket) {
      count++;
    }
  }
  return count;
};

// вывод всех операций
const buttonHandler = (value) => {
  if (outputFieldDisplay.textContent.includes('=')) {
    return;
  }

  if (value === 'plusmn') {
    return;
  }

  if (value === '(') {
    input.push(value);
    display.push(value);
    outputValue.textContent = value;
    newNumber = true;
    openBracket.textContent = `${getBracketCount(value, input.length)}`;
  } else if (value === ')') {
    closingBracket.textContent = `${getBracketCount(value, input.length)}`;
  }

  if (value === '=' && lastSign === ')') {
    display.push(value);
    outputFieldDisplay.textContent = display.join(' ');
  } else if (value === '=') {
    display.push(currentNumber);
    display.push(value);
    outputFieldDisplay.textContent = display.join(' ');
  }

  if (!isNaN(value) || value === '.' && outputValue.textContent.includes('.')) {
    outputFieldDisplay.textContent = display.join(' ').concat(' ' + currentNumber);
  } else {
    outputFieldDisplay.textContent = display.join(' ');
  }

  if (value === '' && display[display.length - 1] === '(' ||
    value === '' && display[display.length - 1] === ')') {
    outputFieldDisplay.textContent = outputFieldDisplay.textContent.slice(0, -1);
  }

  !outputFieldDisplay.textContent.includes('(') ? openBracket.textContent = '' : '';
  !outputFieldDisplay.textContent.includes(')') ? closingBracket.textContent = '' : '';
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

  if (getBracketCount(')', input.length) >= getBracketCount('(', input.length)) {
    return;
  }

  if (operation === '(') {
    return;
  }

  if (sign === ')') {
    input.push(operation);
    display.push(operation);
  }

  if (resultNumber !== '' && operation !== '') {
    output = [];
    input = [];
    display = [];
    currentNumber = resultNumber;

    input.push(resultNumber);
    display.push(resultNumber);
    display.push(operation);
    input.push(sign);

    newNumber = true;
    equals = false;
    outputFieldDisplay.textContent = display.join(' ');
    resultNumber = '';
  }

  outputValue.textContent = operation;
  sign = operation;
  lastSign = operation;

  if (operation === '√' && input[input.length - 1] === '√') {
    return;
  }

  if (newNumber) {

    if (input[input.length - 1] === '√') {
      input.push(operation);
      display.push(operation);
    }
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
};

// получение результата
const resultButtonHandler = () => {

  if (openBracket.textContent !== closingBracket.textContent) {
    outputValue.textContent = 'Ошибка';
    return;
  }

  if (currentNumber === 0 || equals) {
    input = [];
    output = [];
    stack = [];
    return;
  }

  lastSign === '√' ? outputFieldDisplay.textContent = display.join(' ').concat(' ' + '=') : '';

  if (sign === '√') {
    display.pop();
  }

  if (input[input.length - 1] !== currentNumber && input[input.length - 1] !== ')' && input[input.length - 1] !== '√') {
    input.push(Number(currentNumber));
  }

  getReverseNotation(input);

  if (stack.length !== 0) {
    while (stack.length > 0) {
      output.push(stack[stack.length - 1]);
      stack.pop();
    }
  }

  if (sign === '' && currentNumber !== 0) {
    outputValue.textContent = +currentNumber;
  } else {
    outputValue.textContent = getOperationResult(output);
  }

  resultNumber = +outputValue.textContent;

  sign = '';
  equals = true;
};

// получение обратной нотации
let getReverseNotation = (input) => {

  input.forEach((item) => {

    if (typeof item !== 'string') {
      output.push(item);
    }
    if (typeof item === 'string') {
      let lastEl = stack[stack.length - 1];

      if (stack.length === 0) {
        stack.push(item);
      } else {
        if (item === '(' || lastEl === '(') {
          stack.push(item);
        }

        if (Operators[item] < Operators[lastEl]) {

          while (Operators[item] <= Operators[stack[stack.length - 1]]) {
            output.push(stack[stack.length - 1]);
            stack.pop();
          }
          stack.push(item);
        }

        if (Operators[item] > Operators[lastEl]) {
          stack.push(item)
        }

        if (lastEl === '(' && item === '(') {
          return;
        }

        if (Operators[lastEl] === Operators[item]) {
          output.push(lastEl);
          stack.pop();
          stack.push(item);
        }

        if (item === ')') {
          while (stack[stack.length - 1] !== '(') {
            output.push(stack[stack.length - 1]);
            stack.pop();
          }
          stack.pop();
        }
      }
      console.log(stack)
      console.log(input)
    }
  });
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
  };

  output.forEach((item) => {
    if (item in operations) {
      let [y, x] = [stack.pop(), stack.pop()];
      stack.push(operations[item](x, y));
    }
    else if (item === '√') {
      let z = stack.pop();
      stack.push(Math.sqrt(z));
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
  sqrt = false;
  currentNumber = 0;
  resultNumber = '';
  sign = '';
  lastSign = '';
  input = [];
  output = [];
  stack = [];
  display = [];
  closingBracket.textContent = '';
  openBracket.textContent = '';
};

//сброс последнего символа
const lastValueOfNumberHandler = () => {
  intermediateNumber = '';

  if (outputValue.textContent.length <= 1) {
    intermediateNumber = 0;
  } else {
    intermediateNumber += outputValue.textContent.slice(0, -1);
  }

  outputValue.textContent = intermediateNumber;
  currentNumber = outputValue.textContent;
  intermediateNumber = '';

  if (outputFieldDisplay.textContent.length > 1) {
    outputFieldDisplay.textContent = outputFieldDisplay.textContent.substring(0, outputFieldDisplay.textContent.length - 1);
  } else {
    outputFieldDisplay.textContent = '0';
  }

  if (display[display.length - 1] === '(' || display[display.length - 1] === ')') {
    display.pop();
    input.pop();
  }
  openBracket.textContent = `${getBracketCount('(', input.length)}`;
  closingBracket.textContent = `${getBracketCount(')', input.length)}`;
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

  console.log(input, output, stack, newNumber, currentNumber, equals, sqrt, sign, lastSign)
});
