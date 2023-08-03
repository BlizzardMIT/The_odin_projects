function add(x, y){
    return Math.round(100 * (x + y)) / 100;
}

function subtract(x, y){
    return Math.round(100 * (x - y)) / 100;
}

function multiply(x, y){
    return Math.round( 100 * x * y) / 100; 
}

function divide(x, y){
    return y === 0 ? "Err!!": Math.round( 100 * x/ y) / 100;
}

function modulus(x, y){
    return x % y;
}

let num1 = Number.MIN_SAFE_INTEGER;
let operator = '';
let num2 = Number.MIN_SAFE_INTEGER;


function operate(func, x, y){
    switch(func){
        case '+':
            return add(x, y);
        case '-':
            return subtract(x, y);
        case 'x':
            return multiply(x, y);
        case '/':
            return divide(x, y);
        case '%':
            return modulus(x, y);
    }
}

const numbers = document.querySelectorAll('.num');
const display = document.querySelector('.current');
const history = document.querySelector('.history');
const equals = document.querySelector('.equals');
const operators = document.querySelectorAll('.operator');
const fullClear = document.querySelector('.all-clear');
const singleClear = document.querySelector('.single-clear');
const btns = document.querySelectorAll('.btn');
const dotBtn = document.querySelector('.dot');

numbers.forEach(number => {
    number.addEventListener('click', ()=> handleNumberInput(number.textContent));
});

operators.forEach(method => {
    method.addEventListener('click', () => handleOperatorInput(method.textContent));
});

// Add hover over event on the buttons
btns.forEach(btn =>{
    btn.addEventListener('mouseover', () =>{
        if (btn.textContent === '.' && display.textContent.includes('.')){
            return;
        }
        btn.classList.add('btn-hover')
    })
    btn.addEventListener('mouseout', () =>{
        btn.classList.remove('btn-hover')
    })
})

function handleNumberInput(input){
    // console.log('num1: ${num1} op: ${operator} num2: ${num2}');
    // handing two dots
    if (input === '.' && display.textContent.includes('.')){
        return;
    }
    
    // handle big numbers
    if (display.textContent.length > 8 || history.textContent.length > 13){
        display.textContent = 'Too Large';
        return;
    }

    // if input is .
    if (input === '.'){
        if (display.textContent.length === 0 || isNaN(parseFloat(display.textContent))){
            //if display is empty or display is non number
            display.textContent = '0.';
            populateNumber(0);
        } else{
            //display is not empty
            display.textContent += input;
            populateNumber(display.textContent.slice(0, -1));
        }
    } else {
        // else input is a number
        if (!isNaN(parseFloat(display.textContent)) && display.textContent !== '0'){
            // if display already contain a number
            display.textContent += input;
        } else{
            display.textContent += input;
        }
        populateNumber(parseFloat(display.textContent));
    }

}

function handleOperatorInput(input){
    // console.log('num1: ${num1} op: ${operator} num2: ${num2}');
    // input is an operator
    if (input === '='){
        calculate(input);
    } else {
        display.textContent = input;
        populateOperator(input);
    }
}

function populateNumber(num) {
    if (operator === ''){
        num1 = num;
    } else {
        num2 = num;
    }
}

function populateOperator(input) {
    if (operator === '' || num2 === Number.MIN_SAFE_INTEGER){
        operator = input;
    } else{
        calculate(input);
    }
}


function calculate(input) {
    // if any number is empty for this call send error
    if (num1 === Number.MIN_SAFE_INTEGER || num2 === Number.MIN_SAFE_INTEGER){
        // do nothing rather than throwing error
        // display.textContent = 'Err!!';
        // resetVariables();
    } else {
        let result = operate(operator, num1, num2);
        history.textContent = "Ans: " + result;

        if (input === '=') {
            display.textContent = result;
            operator = '';
        } else{
            operator = input;
        }
        num1 = result;
        num2 = Number.MIN_SAFE_INTEGER;
    }
}

// full clear
fullClear.addEventListener('click', () => deleteAll());

function deleteAll() {
    display.textContent = '0';
    history.textContent = 'Ans: ';
    resetVariables();
}

function resetVariables(){
    num1 = Number.MIN_SAFE_INTEGER;
    operator = '';
    num2 = Number.MIN_SAFE_INTEGER;
}

// single clear
singleClear.addEventListener('click', () => deleteLastChar());

function deleteLastChar(){
    // if display === 0, do nothing
    if (display.textContent === '0'){
        return;
    }

    // if last char === .
    if (display.textContent.slice(-1) === '.') {
        display.textContent = display.textContent.slice(0, -1);
        return;
    }

    // if display contains a number
    // check if num2 is empty,
    // if num2 is empty, then last digit from num1
    // else remove last digit from num2
    if (!isNaN(parseFloat(display.textContent))) {
        if (num2 === Number.MIN_SAFE_INTEGER) {
            num1 = num1 / 10;
        } else {
            num2 = num2 / 10;
        }
        if (display.textContent.length === 1) {
            display.textContent = 0;
        } else {
            display.textContent = display.textContent.slice(0, -1);
        }
    } else {
        // if display contains operator
        operator = '';
        display.textContent = display.textContent.slice(0, -1);
    }
}

// keyboard support
document.addEventListener('keydown', (event) => {
    let pressedKey = event.key;
    pressedKey = pressedKey === 'Enter' ? '=' :pressedKey;
    pressedKey = pressedKey === '*' ? 'x' : pressedKey;
    let operatorKeys = 'x+-/=%';

    if (!isNaN(parseInt(pressedKey)) || pressedKey === '.') {
        // if input is number
        handleNumberInput(pressedKey);
    } else if (operatorKeys.includes(pressedKey)){
        // operator key
        handleOperatorInput(pressedKey);    
    } else if (pressedKey === 'Backspace'){
        deleteLastChar();
    } else if (pressedKey === 'Delete'){
        deleteAll();
    }
});