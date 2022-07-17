'use strict';

const calculateWrapper = document.querySelector('.calculator-wrapper');
const outputValueField = document.querySelector('.current-operations-field');

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

let inputValues = [];
let outputValues = [];
let stack = [];

let newNumber = false;
let equals = false;
let sqrt = false;

let resultNumber = '';
let currentNumber = 0;
let sign = '';
let del = false;
outputFieldDisplay.textContent = '0';

if (inputValues.length === 0) {
  outputFieldDisplay.textContent = '0';
}

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
  if (value === ')' && openBracket.textContent === closingBracket.textContent) {
    return;
  }

  if (value === ')' && inputValues[inputValues.length - 1] === '√') {
    inputValues.pop();
  }

  if (newNumber && inputValues[inputValues.length - 1] !== '(') {
    inputValues.push(sign);
  }

  if (value === ')' &&
    typeof inputValues[inputValues.length - 1] === 'string' &&
    inputValues[inputValues.length - 1] !== ')' &&
    inputValues[inputValues.length - 1] !== '√') {
    inputValues.push(Number(currentNumber));
  }

  inputValues.push(value);
};

// вывод всех операций в дополнительное поле
const buttonHandler = (value) => {
  if (value === '=' && inputValues[inputValues.length - 1] === '(' ||
    value === '=' && inputValues[inputValues.length - 1] === sign) {
    return;
  }

  if (outputFieldDisplay.textContent.includes('=')) {
    return;
  }

  if (value === 'plusmn') {
    return;
  }

  if (inputValues.length === 0 && value !== '' && currentNumber === 0) {
    return;
  }

  if (inputValues[inputValues.length - 1] !== '√' && value === '√') {
    inputValues.push(value);
    outputFieldDisplay.textContent = inputValues.join(' ');
    sqrt = true;
  }

  if (value === 'del' && inputValues.length > 0) {
    del = true;
    outputValueField.textContent = inputValues[inputValues.length - 1];
  } else if (typeof inputValues[inputValues.length - 1] === 'number' && value !== '=' ||
    value === '√' ||
    inputValues[inputValues.length - 1] === '√' && value !== '√') {
    outputValueField.textContent = sign;
  }

  if (value === '(') {
    outputValueField.textContent = value;
    newNumber = true;
    openBracket.textContent = `${getBracketCount(value, inputValues.length)}`;
  } else if (value === ')') {
    outputValueField.textContent = value;
    closingBracket.textContent = `${getBracketCount(value, inputValues.length)}`;
  }

  if (!isNaN(value) || value === '.' && outputValueField.textContent.includes('.')) {
    !sqrt ? outputFieldDisplay.textContent = inputValues.join(' ').concat(' ' + currentNumber) :
      outputFieldDisplay.textContent = inputValues.join(' ');
  } else {
    value !== '√' && value !== ')' && value !== '(' && value !== 'del' ?
      outputFieldDisplay.textContent = inputValues.join(' ').concat(' ' + sign) :
      outputFieldDisplay.textContent = inputValues.join(' ');
  }

  if (value === 'del' && inputValues.length === 0) {
    outputFieldDisplay.textContent = outputValueField.textContent;
  }

  !outputFieldDisplay.textContent.includes('(') ? openBracket.textContent = '' : '';
  !outputFieldDisplay.textContent.includes(')') ? closingBracket.textContent = '' : '';
};

// ввод чисел
const buttonNumberHaandler = (number) => {
  let num = '0.';

  if (sqrt) {
    return;
  }

  if (del) {
    newNumber = true;
    del = false;
  } else if (newNumber && inputValues[inputValues.length - 1] !== '(') {
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
    number === '.' ? outputValueField.textContent = num : outputValueField.textContent = number;
    currentNumber = outputValueField.textContent;
  }
};

// ввод знака
const buttonOperationHandler = (operation) => {
  if (inputValues[inputValues.length - 1] === '√' && operation !== '√') {
    sqrt = false;
  }

  if (inputValues[inputValues.length - 1] === '√' && operation === '√') {
    return;
  }

  if (operation === '(' || operation === ')') {
    return;
  }

  if (currentNumber === 0) {
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

  if (outputFieldDisplay.textContent.slice(-1) === '(' && operation !== '(') {
    outputFieldDisplay.textContent = inputValues.join(' ');
    return;
  }

  if (inputValues[inputValues.length - 1] === '√' || inputValues[inputValues.length - 1] === ')') {
    newNumber = true;
  } else {
    newNumber = true;
    inputValues.push(Number(currentNumber));
  }
};

// получение результата
const resultButtonHandler = () => {
  if (equals) {
    return;
  }

  if (openBracket.textContent !== closingBracket.textContent ||
    typeof inputValues[inputValues.length - 1] === 'number') {
    outputValueField.textContent = 'Ошибка';
    return;
  }

  if (inputValues[inputValues.length - 1] !== currentNumber &&
    inputValues[inputValues.length - 1] !== ')' &&
    inputValues[inputValues.length - 1] !== '√') {
    inputValues.push(Number(currentNumber));
  }

  if (inputValues[inputValues.length - 1] !== Number) {
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
        if (item === ')' && lastEl === '(') {
          stack.pop();
          return;
        }

        if (item === '(' || lastEl === '(') {
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

        if (lastEl === '(' && item === '(') {
          return;
        }

        if (Operators[lastEl] === Operators[item]) {
          outputValues.push(lastEl);
          stack.pop();
          stack.push(item);
        }

        if (item === ')') {
          while (stack[stack.length - 1] !== '(') {
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
    } else if (item === '√') {
      let x = stack.pop();
      stack.push(Math.sqrt(x));
    } else {
      stack.push(parseFloat(item));
    }
  });

  outputValueField.textContent = stack.pop().toFixed(10);

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
  closingBracket.textContent = '';
  openBracket.textContent = '';
};


// удаление последнего элемента входного массива
const lastValueOfNumberHandler = () => {
  if (inputValues[inputValues.length - 1] === '√') {
    inputValues.pop();
  sqrt = false;
  }

  newNumber = false;

  if (del) {
    inputValues.pop();
  } else if (!del && inputValues[inputValues.length - 1] === '(' || !del && inputValues[inputValues.length - 1] === ')') {
    inputValues.pop();
  }

  if (inputValues.length < 1) {
    cleanAllHandler();
    return;
  }

  openBracket.textContent = `${getBracketCount('(', inputValues.length)}`;
  closingBracket.textContent = `${getBracketCount(')', inputValues.length)}`;
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

  bracket ? getBracket(bracket.value) : '';

  buttonNumber ? buttonNumberHaandler(buttonNumber.value) : '';

  operationButton ? buttonOperationHandler(operationButton.value) : '';

  outputValue ? buttonHandler(outputValue.value) : '';

  console.log(inputValues, outputValues, stack, currentNumber, sign, newNumber, equals, del, sqrt)
});
