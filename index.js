const display = document.querySelector('.calculator-display');
const keysButtons = document.querySelectorAll('.btnKeys');
const operatorsButtons = document.querySelectorAll('.operator');
const clearButton = document.querySelector('.all-clear-btn');
const equalButton = document.querySelector('.equal-btn');
const decimalButton = document.querySelector('.decimal-btn');
const backSpaceButton = document.querySelector('.back-space-btn');

let displayValue = 0;
let firstValue = null;
let secondValue = null;
let operator = null;
let result = 0;
let waitingForSecondValue = false;

/* Creating an object called calculator, and adding four properties to it. */
const calculator = {
    add: (num1, num2) => {
        return num1 + num2;
    },
    subtract: (num1, num2) => {
        return num1 - num2; 
    },
    multiply: (num1, num2) => {
        return num1 * num2;
    },
    divide: (num1, num2) => {
        return num1 / num2;
    }
};

/* Destructuring the add, subtract, multiply, 
and divide properties from the calculator object. */
const { add, subtract, multiply, divide} = calculator;

/**
 * If the displayValue is longer than 10 characters, slice it to 10 characters. If the displayValue is
 * Infinity, NaN, undefined, or null, change it to a string. Otherwise, leave it alone
*/
const updateDisplay = () => {
    if (displayValue.length > 10) {
        displayValue = displayValue.slice(0, 10);
    } else if (displayValue === 'Infinity') {
        displayValue = 'really?';
    } else if (displayValue === 'NaN') {
        displayValue = 'you broke it';
    } else if (displayValue === 'undefined') {
        displayValue = 'you broke it';
    } else if (displayValue === 'null') {
        displayValue = 'you broke it';
    } else {
        displayValue = displayValue;
    }
    display.value = displayValue;
    display.textContent = displayValue; 
};

/**
 * If the user is waiting for a second value, then set the displayValue to the value of the key that
 * was clicked. Otherwise, if the displayValue is 0, then set the displayValue to the value of the key
 * that was clicked. Otherwise, add the value of the key that was clicked to the displayValue
 * @param key - The event object that is passed to the function.
*/
const updateDisplayValue = (key) => {
    /* Destructuring the value property from the key.target object. */
    const { value } = key.target;
    if (waitingForSecondValue === true) {
        displayValue = value;
        waitingForSecondValue = false;
    } else {
        displayValue === 0 ? displayValue = value : displayValue += value;
    } 
    updateDisplay();
};

/**
 * It takes in an operator, and two numbers, and returns the result of the operation
 * @param operator - the operator to be used
 * @param num1 - The first number
 * @param num2 - the second number entered by the user
 * @returns The result of the operation.
*/
const operate = (operator, num1, num2) => {
    if (operator === '+') {
        return add(num1, num2);
    } else if (operator === '-') {
        return subtract(num1, num2);
    } else if (operator === 'x') {
        return multiply(num1, num2);
    } else if (operator === '/') {
        return divide(num1, num2);
    } else {
        return 'Error';
    }
}

/**
 * If the user has already entered an operator, and is waiting for the second value, then just update
 * the operator. Otherwise, if the user has not yet entered a value, then set the first value to the
 * current display value. Otherwise, if the user has already entered an operator and a first value,
 * then perform the operation and update the display. Finally, if the user has not yet entered an
 * operator, then set the first value to the current display value
 * @param key - the event object
 * @returns the result of the operation.
*/
const handleOperator = (key) => {
    
    const { value } = key.target;
    if (operator && waitingForSecondValue) {
        operator = value;
        return;
    } else if (firstValue === null) {
        firstValue = parseFloat(displayValue);
    } else if (operator) {
        const currentValue = parseFloat(displayValue);
        result = operate(operator, firstValue, currentValue);
        displayValue = String(result);
        updateDisplay();
        firstValue = result;
    } else {
        firstValue = parseFloat(displayValue);
    }
    waitingForSecondValue = true;
    operator = value;
};  


/**
 * If the firstValue is null or undefined, then it returns. 
 * Otherwise, it sets the result to the value of the operate function. 
 * It then sets the displayValue to the result, updates the display, 
 * sets the firstValue to the result, sets the operator to null, 
 * and sets waitingForSecondValue to true
 * @returns the result of the operation.
*/
const handleEqual = () => {
    /* Checking to see if the firstValue is null or undefined. 
    If it is, then it returns. */
    if (!firstValue || !operator) {
        return;
    }
    const currentValue = parseFloat(displayValue);
    result = operate(operator, firstValue, currentValue);
    displayValue = String(result);
    updateDisplay();
    firstValue = result;
    operator = null;
    waitingForSecondValue = true;
};

/**
 * The handleClear function sets all the variables to their default values.
*/
const handleClear = () => {
    displayValue = 0;
    firstValue = null;
    secondValue = null;
    operator = null;
    result = 0;
    waitingForSecondValue = false;
    updateDisplay();
};

/**
 * If the displayValue includes a decimal point, do nothing; 
 * otherwise, add a decimal point to the
 * displayValue and update the display
 * @returns the value of the displayValue variable.
*/
const handleDecimal = () => {
    if (displayValue.includes('.')) {
        return;
    }
    displayValue += '.';
    updateDisplay();
};


/**
 * It removes the last character from the displayValue string
 */
const handleBackSpace = () => {
    displayValue = displayValue.slice(0, -1);
    updateDisplay();
};

/* Add a event listener a click and a keydown for each buttons */
keysButtons.forEach((key) => {
    key.addEventListener('click', updateDisplayValue);
});

/* Looping through the operatorsButtons, and adding an event listener to each button 
that have operator class*/
operatorsButtons.forEach((operator) => {
    operator.addEventListener('click', handleOperator);
});
 

/* Adding event listeners to the equalButton, clearButton,decimalButton and backSpaceButton. */
equalButton.addEventListener('click', handleEqual);
clearButton.addEventListener('click', handleClear);
decimalButton.addEventListener('click', handleDecimal);
backSpaceButton.addEventListener('click', handleBackSpace);

/* Add keyboard support! */
/* Add a event listener to the window object, and listen for a keydown event. */
window.addEventListener('keydown', (event) => {
    event.target.value = event.key;
    /* If the key that was pressed is a number, then call the updateDisplayValue function. */
    if (event.key >= 0 && event.key <= 9) {
        updateDisplayValue(event);
    }
    else if (event.key === ',') {
        handleDecimal();
    } else if (event.key === 'Backspace') {
        handleBackSpace();
    } else if (event.key === 'Enter') {
        handleEqual();
    } else if (event.key === 'Escape') {
        handleClear();
    } else if ( event.key === '+' || 
                event.key === '-' || 
                event.key === 'x' || 
                event.key === '/'
                ) {
        handleOperator(event);
    } else {
        return;
    }
});
