const display = document.getElementById('input');
const resultDisplay = document.getElementById('show-result');
const HTMLbuttons = document.getElementsByClassName('key');
const buttons = [...HTMLbuttons];
const enterKey = document.getElementById('enter-key');
let resultHistory = [];
let result = 0;
const numericKeyboardKeys = /[0-9\+\-\*\/]/;


const handleClick = (value) => {
    display.value += value;
}

const checkKeyboardKeys = (event) => {
    const key = event.key;
    if (numericKeyboardKeys.test(key)) {
        display.value += key;
    }
}

const clearDisplay = () => {
    display.value = '';
    resultDisplay.innerHTML = '';
}

const resultStyle = () => {
    if(resultDisplay.classList.contains('no-result')){
        resultDisplay.classList.remove('no-result');
        resultDisplay.classList.add('result');

        display.classList.remove('default');
        display.classList.add('with-result');
    }
}

const noResultStyle = () => {
    if(resultDisplay.classList.contains('result')){
        resultDisplay.classList.remove('result');
        resultDisplay.classList.add('no-result');

        display.classList.remove('with-result');
        display.classList.add('default');
    }
}

const displayResult = () => {
   try {
    if(display.value){
        const revisedInput = replaceSymbolsWithOperators(display.value);
        result = eval(revisedInput);
        if(result){
            resultDisplay.innerHTML = result.toString();
            resultHistory.push(result);
        }
        resultStyle();
    }
   } catch (error) {
    resultDisplay.innerHTML = 'undefined';
   }
}

const showHistory = () => {
    if(resultHistory.length > 0){
        const lastData = resultHistory[resultHistory.length -1];
        resultDisplay.innerHTML = lastData.toString();
        resultStyle();
    }
}

const deleteEntry = () => {
    if(display.value){
        const entryArray = display.value.slice(0, -1);
    display.value = entryArray;
    }
}

const replaceSymbolsWithOperators = (expression) => {
    const symbolMap = {
        'x': '*',
        '√': 'Math.sqrt',
        '÷': '/',
        '%': '/100',
        '(': '(',
        ')': ''
    };

    let replacedExpression = expression
        .replace(/(\d+)√(\d+)/g, 'Math.sqrt($1)*$2')
        .replace(/√(\d+)/g, 'Math.sqrt($1)')
        .replace(/(\d+)%(?=\d+)/g, '($1/100)*')
        .replace(/(\d+)%\((\d+)\)/g, '($1/100)*($2)')
        .replace(/(\d+)%/g, '($1/100)')

    replacedExpression = replacedExpression.replace(/[x÷()%]/g, match => {
        return symbolMap[match] || match;
    });

    return replacedExpression;
};

const checkClickedOrPressedButton = (buttonValue) => {
    if(buttonValue === 'clear'){
        clearDisplay();
        noResultStyle();

    } else if(buttonValue === 'enter'){
        displayResult();

    } else if(buttonValue === 'ans'){
       showHistory();

    } else if(buttonValue === 'del' || buttonValue === 'Backspace'){
        deleteEntry();

    } else {
        handleClick(buttonValue);
    }
}


buttons.forEach(button => {
    const buttonValue = button.dataset.value;
    button.addEventListener('click', 
    () => checkClickedOrPressedButton(buttonValue))
});

document.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        checkClickedOrPressedButton('enter');

    } else if(event.key === 'Backspace'){
        checkClickedOrPressedButton('Backspace');

    } else {
        checkKeyboardKeys(event);
    }
});