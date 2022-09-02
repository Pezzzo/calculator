'use strict';

const calculateWrapper = document.querySelector('.calculator-wrapper');
const outputValueField = document.querySelector('.current-operations-field');

const openBracket = document.querySelector('.open-bracket');
const closeBracket = document.querySelector('.closing-bracket');

const outputFieldDisplay = document.querySelector('.operations-field');
const positiveNegativeButton = document.querySelector('.button-positive-negative');
const lastValueOfNumber = document.querySelector('.del-one-char');
const cleanAll = document.querySelector('.clean');
const result = document.querySelector('.result-button');

const OPEN_BRACKET = '(';
const CLOSE_BRACKET = ')';
const SQUARE_ROOT = '√';

const Operators = {
  '+': 1,
  '−': 1,
  '×': 2,
  '÷': 2,
  '%': 3,
  '^': 3,
  '√': 3,
};

let inputValues = [];
let outputValues = [];
let stack = [];

let newNumber = false;
let equals = false;
let sqrt = false;
let del = false;

let resultNumber = '';
let sign = '';
let currentNumber = 0;

outputFieldDisplay.textContent = '0';


// счётчик скобок
const getBracketCount = (bracket, length) => {
  let count = 0;
  for (let i = 0; i < length; i++) {
    if (inputValues[i] === bracket) {
      count++;
    }
  }
  return count;
};


// ввод скобок
const getBracket = (value) => {
  if (value === CLOSE_BRACKET && openBracket.textContent === closeBracket.textContent) {
    return;
  }

  if (value === CLOSE_BRACKET && inputValues[inputValues.length - 1] === SQUARE_ROOT) {
    inputValues.pop();
  }

  if (newNumber && inputValues[inputValues.length - 1] !== OPEN_BRACKET) {
    inputValues.push(sign);
  }

  if (value === CLOSE_BRACKET &&
    typeof inputValues[inputValues.length - 1] === 'string' &&
    inputValues[inputValues.length - 1] !== CLOSE_BRACKET &&
    inputValues[inputValues.length - 1] !== SQUARE_ROOT) {
    inputValues.push(Number(currentNumber));
  }

  inputValues.push(value);
};

// вывод всех операций в дополнительное поле
const buttonHandler = (value) => {
  if (value === '=' && inputValues[inputValues.length - 1] === OPEN_BRACKET ||
    value === '=' && inputValues[inputValues.length - 1] === sign ||
    outputFieldDisplay.textContent.includes('=') ||
    value === 'plusmn' ||
    inputValues.length === 0 && value !== '' && currentNumber === 0) {
    return;
  }

  if (inputValues[inputValues.length - 1] !== SQUARE_ROOT && value === SQUARE_ROOT) {
    inputValues.push(value);
    outputFieldDisplay.textContent = inputValues.join(' ');
    sqrt = true;
  }

  if (value === 'del' && inputValues.length > 0) {
    del = true;
    outputValueField.textContent = inputValues[inputValues.length - 1];
  } else if (typeof inputValues[inputValues.length - 1] === 'number' && value !== '=' ||
    value === SQUARE_ROOT ||
    inputValues[inputValues.length - 1] === SQUARE_ROOT && value !== SQUARE_ROOT) {
    outputValueField.textContent = sign;
  }

  if (value === OPEN_BRACKET) {
    outputValueField.textContent = value;
    newNumber = true;
    openBracket.textContent = `${getBracketCount(value, inputValues.length)}`;
  } else if (value === CLOSE_BRACKET) {
    outputValueField.textContent = value;
    closeBracket.textContent = `${getBracketCount(value, inputValues.length)}`;
  }

  if (!isNaN(value) || value === '.' && outputValueField.textContent.includes('.')) {
    !sqrt ? outputFieldDisplay.textContent = inputValues.join(' ').concat(' ' + currentNumber) :
      outputFieldDisplay.textContent = inputValues.join(' ');
  } else {
    value !== SQUARE_ROOT && value !== CLOSE_BRACKET && value !== OPEN_BRACKET && value !== 'del' ?
      outputFieldDisplay.textContent = inputValues.join(' ').concat(' ' + sign) :
      outputFieldDisplay.textContent = inputValues.join(' ');
  }

  if (value === 'del' && inputValues.length === 0) {
    outputFieldDisplay.textContent = outputValueField.textContent;
  }

  !outputFieldDisplay.textContent.includes(OPEN_BRACKET) ? openBracket.textContent = '' : '';
  !outputFieldDisplay.textContent.includes(CLOSE_BRACKET) ? closeBracket.textContent = '' : '';
};


// ввод чисел
const buttonNumberHaandler = (number) => {
  let decimalFirst = '0.';

  if (sqrt) {
    return;
  }

  if (del) {
    newNumber = true;
    del = false;
  } else if (newNumber && inputValues[inputValues.length - 1] !== OPEN_BRACKET) {
    inputValues.push(sign);
  }

  equals ? cleanAllHandler() : '';

  if (number === '.' && outputValueField.textContent.includes('.')) {
    outputFieldDisplay.textContent = inputValues.join(' ').concat('' + currentNumber);
    return;
  }

  if (!newNumber) {
    outputValueField.textContent === '0' && number !== '.' ?
      outputValueField.textContent = number : outputValueField.textContent += number;
    currentNumber = outputValueField.textContent;
  } else {
    newNumber = false;
    number === '.' ? outputValueField.textContent = decimalFirst : outputValueField.textContent = number;
    currentNumber = outputValueField.textContent;
  }
};


// ввод знака
const buttonOperationHandler = (operation) => {
  if (inputValues[inputValues.length - 1] === SQUARE_ROOT && operation !== SQUARE_ROOT) {
    sqrt = false;
  } else if (inputValues[inputValues.length - 1] === SQUARE_ROOT && operation === SQUARE_ROOT) {
    return;
  }

  if (operation === OPEN_BRACKET || operation === CLOSE_BRACKET || currentNumber === 0) {
    return;
  }

  if (del) {
    newNumber = true;
    del = false;
  }

  if (resultNumber !== '' && operation !== '') {
    outputValues = [];
    inputValues = [];
    currentNumber = resultNumber;
    inputValues.push(resultNumber);

    newNumber = true;
    equals = false;
    outputFieldDisplay.textContent = inputValues.join(' ');
    resultNumber = '';
  }

  sign = operation;

  if (typeof inputValues[inputValues.length - 1] === 'number') {
    return;
  }

  if (outputFieldDisplay.textContent.slice(-1) === OPEN_BRACKET && operation !== OPEN_BRACKET) {
    outputFieldDisplay.textContent = inputValues.join(' ');
    return;
  }

  if (inputValues[inputValues.length - 1] === SQUARE_ROOT || inputValues[inputValues.length - 1] === CLOSE_BRACKET) {
    newNumber = true;
  } else {
    newNumber = true;
    inputValues.push(Number(currentNumber));
  }
};


// получение результата
const resultButtonHandler = () => {

  let lastValue = inputValues[inputValues.length - 1];

  if (equals) {
    return;
  }

  if (openBracket.textContent !== closeBracket.textContent ||
    typeof lastValue === 'number') {
    outputValueField.textContent = 'Ошибка';
    return;
  }

  if (lastValue !== currentNumber &&
    lastValue !== CLOSE_BRACKET &&
    lastValue !== SQUARE_ROOT) {
    inputValues.push(Number(currentNumber));
  }

  if (lastValue !== Number) {
    outputFieldDisplay.textContent = inputValues.join(' ').concat(' ' + '=');
  }

  getReverseNotation(inputValues);

  if (stack.length !== 0) {
    while (stack.length > 0) {
      outputValues.push(stack[stack.length - 1]);
      stack.pop();
    }
  }

  if (sign === '' && currentNumber !== 0) {
    outputValueField.textContent = +currentNumber;
  } else {
    outputValueField.textContent = getOperationResult(outputValues);
  }

  resultNumber = +outputValueField.textContent;

  sign = '';
  equals = true;
};


// получение обратной нотации
let getReverseNotation = () => {

  inputValues.forEach((item) => {

    if (typeof item !== 'string') {
      outputValues.push(item);
    }
    if (typeof item === 'string') {
      let lastEl = stack[stack.length - 1];

      if (stack.length === 0) {
        stack.push(item);

      } else {
        if (item === CLOSE_BRACKET && lastEl === OPEN_BRACKET) {
          stack.pop();
          return;
        }

        if (item === OPEN_BRACKET || lastEl === OPEN_BRACKET) {
          stack.push(item);
        }

        if (Operators[item] < Operators[lastEl]) {

          while (Operators[item] <= Operators[stack[stack.length - 1]]) {
            outputValues.push(stack[stack.length - 1]);
            stack.pop();
          }
          stack.push(item);
        }

        if (Operators[item] > Operators[lastEl]) {
          stack.push(item)
        }

        if (lastEl === OPEN_BRACKET && item === OPEN_BRACKET) {
          return;
        }

        if (Operators[lastEl] === Operators[item]) {
          outputValues.push(lastEl);
          stack.pop();
          stack.push(item);
        }

        if (item === CLOSE_BRACKET) {
          while (stack[stack.length - 1] !== OPEN_BRACKET) {
            outputValues.push(stack[stack.length - 1]);
            stack.pop();
          }
          stack.pop();
        }
      }
    }
  });
};


// выполнение операций
const getOperationResult = () => {
  const MAX_LENGTH = 10;
  let stack = [];

  const operations = {
    '+': (x, y) => x + y,
    '−': (x, y) => x - y,
    '×': (x, y) => x * y,
    '÷': (x, y) => x / y,
    '%': (x, y) => x * y / 100,
    '^': (x, y) => x ** y,
  };

  outputValues.forEach((item) => {
    if (item in operations) {
      let [y, x] = [stack.pop(), stack.pop()];
      stack.push(operations[item](x, y));
    } else if (item === SQUARE_ROOT) {
      let x = stack.pop();
      stack.push(Math.sqrt(x));
    } else {
      stack.push(parseFloat(item));
    }
  });

  outputValueField.textContent = stack.pop().toFixed(MAX_LENGTH);

  if (outputValueField.textContent === 'Infinity') {
    outputValueField.textContent = 'На 0 делить нельзя!';
    return outputValueField.textContent;
  }

  if (outputValueField.textContent === 'NaN') {
    outputValueField.textContent = 'Ошибка';
    return outputValueField.textContent;
  }

  return +outputValueField.textContent;
};


// общий сброс
const cleanAllHandler = () => {
  outputValueField.textContent = '0';
  outputFieldDisplay.textContent = '0';
  newNumber = false;
  equals = false;
  del = false;
  sqrt = false;
  currentNumber = 0;
  resultNumber = '';
  sign = '';
  inputValues = [];
  outputValues = [];
  stack = [];
  closeBracket.textContent = '';
  openBracket.textContent = '';
};


// удаление последнего элемента входного массива
const lastValueOfNumberHandler = () => {
  if (inputValues[inputValues.length - 1] === SQUARE_ROOT) {
    inputValues.pop();
    sqrt = false;
  }

  newNumber = false;

  if (del) {
    inputValues.pop();
  } else if (!del && inputValues[inputValues.length - 1] === OPEN_BRACKET || !del && inputValues[inputValues.length - 1] === CLOSE_BRACKET) {
    inputValues.pop();
  }

  if (inputValues.length < 1) {
    cleanAllHandler();
    return;
  }

  openBracket.textContent = `${getBracketCount(OPEN_BRACKET, inputValues.length)}`;
  closeBracket.textContent = `${getBracketCount(CLOSE_BRACKET, inputValues.length)}`;
};

const positiveNegativeButtonHandler = () => {
  outputValueField.textContent = -outputValueField.textContent;
  currentNumber = outputValueField.textContent;
  outputFieldDisplay.textContent = inputValues.join(' ').concat(currentNumber);
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

  bracket ? getBracket(bracket.value) : null;

  buttonNumber ? buttonNumberHaandler(buttonNumber.value) : null;

  operationButton ? buttonOperationHandler(operationButton.value) : null;

  outputValue ? buttonHandler(outputValue.value) : null;
});
