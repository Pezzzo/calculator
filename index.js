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

let newNumber = false;
let equals = false;

let resultNumber = '';
let currentNumber = 0;
let sign = '';
let del = false;
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

// ввод скобок
const getBracket = (value) => {
  if (value === ')' && openBracket.textContent === closingBracket.textContent) {
    return;
  }
  if (value === ')' && input[input.length - 1] === '√') {
    input.pop();
  }
  if (newNumber && input[input.length - 1] !== '(') {
    input.push(sign);
  }
  if (value === ')' &&
    typeof input[input.length - 1] === 'string' &&
    input[input.length - 1] !== ')' &&
    input[input.length - 1] !== '√') {
    input.push(Number(currentNumber));
  }
  input.push(value);
};

// вывод всех операций в дополнительное поле
const buttonHandler = (value) => {
  if (value === '=') {
    outputFieldDisplay.textContent = input.join(' ').concat(' ' + value);
  }

  if (outputFieldDisplay.textContent.includes('=')) {
    return;
  }

  if (value === 'plusmn') {
    return;
  }

  if (input[input.length - 1] !== '√' && value === '√') {
    input.push(value);
    outputFieldDisplay.textContent = input.join(' ');
  }

  if (value !== '') {
    outputFieldDisplay.textContent = sign;
  }

  if (value === 'del' && input.length > 0) {
    del = true;
    outputValue.textContent = input[input.length - 1];
  } else if (typeof input[input.length - 1] === 'number' && value !== '=' ||
    value === '√' ||
    input[input.length - 1] === '√' && value !== '√') {
    outputValue.textContent = sign;
  }

  if (value === '(') {
    outputValue.textContent = value;
    newNumber = true;
    openBracket.textContent = `${getBracketCount(value, input.length)}`;
  } else if (value === ')') {
    outputValue.textContent = value;
    closingBracket.textContent = `${getBracketCount(value, input.length)}`;
  }

  if (!isNaN(value) || value === '.' && outputValue.textContent.includes('.')) {
    outputFieldDisplay.textContent = input.join(' ').concat(' ' + currentNumber);
  } else {
    value !== '√' && value !== ')' && value !== '(' && value !== 'del' ?
      outputFieldDisplay.textContent = input.join(' ').concat(' ' + sign) :
      outputFieldDisplay.textContent = input.join(' ');
  }

  if (value === 'del' && input.length === 0) {
    outputFieldDisplay.textContent = outputValue.textContent;
  }

  !outputFieldDisplay.textContent.includes('(') ? openBracket.textContent = '' : '';
  !outputFieldDisplay.textContent.includes(')') ? closingBracket.textContent = '' : '';
};

// ввод чисел
const buttonNumberHaandler = (number) => {
  let num = '0.';

  if (del) {
    newNumber = true;
    del = false;
  } else if (newNumber && input[input.length - 1] !== '(') {
    input.push(sign);
  }

  equals ? cleanAllHandler() : '';

  if (number === '.' && outputValue.textContent.includes('.')) {
    outputFieldDisplay.textContent = input.join(' ').concat('' + currentNumber);
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
  if (del) {
    newNumber = true;
    del = false;
  }

  if (currentNumber === 0) {
    return;
  }
  if (operation === '√' && input[input.length - 1] === '√') {
    return;
  }

  if (operation === '(' || operation === ')') {
    return;
  }

  if (resultNumber !== '' && operation !== '') {
    output = [];
    input = [];
    currentNumber = resultNumber;
    input.push(resultNumber);

    newNumber = true;
    equals = false;
    outputFieldDisplay.textContent = input.join(' ');
    resultNumber = '';
  }

  sign = operation;

  if (typeof input[input.length - 1] === 'number') {
    return;
  }

  if (input[input.length - 1] === '√' || input[input.length - 1] === ')') {
    newNumber = true;

  } else {
    newNumber = true;
    input.push(Number(currentNumber));
  }
};

// получение результата
const resultButtonHandler = () => {
  if (equals) {
    return;
  }
  if (openBracket.textContent !== closingBracket.textContent) {
    outputValue.textContent = 'Ошибка';
    return;
  }

  if (input[input.length - 1] !== currentNumber &&
    input[input.length - 1] !== ')' &&
    input[input.length - 1] !== '√') {
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
    outputValue.textContent = 'На 0 делить нельзя!';
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
  del = false;
  currentNumber = 0;
  resultNumber = '';
  sign = '';
  input = [];
  output = [];
  stack = [];
  closingBracket.textContent = '';
  openBracket.textContent = '';
};


// удаление последнего элемента входного массива
const lastValueOfNumberHandler = () => {
  newNumber = false;
  if (!del && input[input.length - 1] === '(' || !del && input[input.length - 1] === ')') {
    input.pop();
  }

  if (del) {
    input.pop();
  }

  if (input.length < 1) {
    cleanAllHandler();
    return;
  }

  openBracket.textContent = `${getBracketCount('(', input.length)}`;
  closingBracket.textContent = `${getBracketCount(')', input.length)}`;
};

const positiveNegativeButtonHandler = () => {
  outputValue.textContent = -outputValue.textContent;
  currentNumber = outputValue.textContent;
  outputFieldDisplay.textContent = input.join(' ').concat(currentNumber);
};

positiveNegativeButton.addEventListener('click', positiveNegativeButtonHandler);
lastValueOfNumber.addEventListener('click', lastValueOfNumberHandler);
result.addEventListener('click', resultButtonHandler);
cleanAll.addEventListener('click', cleanAllHandler);

calculateWrapper.addEventListener('click', (evt) => {
  const bracket = evt.target.closest('.button-parentheses');
  const outputValue = evt.target.closest('.button');
  const buttonNumber = evt.target.closest('.button-number');
  const operationButton = evt.target.closest('.button-operation');

  bracket ? getBracket(bracket.value) : '';

  buttonNumber ? buttonNumberHaandler(buttonNumber.value) : '';

  operationButton ? buttonOperationHandler(operationButton.value) : '';

  outputValue ? buttonHandler(outputValue.value) : '';

  console.log(input, output, stack, newNumber, currentNumber, equals, sign, del)
});
