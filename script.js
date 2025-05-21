const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg =document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector('#uppercase')
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number")
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
// variable for all check boxes
const allCheckBox = document.querySelectorAll("input[type=CheckBox]");
const symbols = '~`!@#$%^&*()-_=+[{]}\\|:;",<.>/?';


let password = "";
let passwordLength = 10;
let checkCount = 0;
//set circle color to white

//set password length
handleSlider();
setIndicator("#ccc");
function handleSlider(){
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow  
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRadInteger(min, max){
  return Math.floor( Math.random() * (max-min))+min;
   
}

function generateRandumNumber(){
    return getRadInteger(0,9);
}

function generateLowerCase(){
    // this will change the asky value into alphabet
    return String.fromCharCode(getRadInteger(97,123))
}

function generateUpperCase(){
    // this will change the asky value into alphabet
    return String.fromCharCode(getRadInteger(65,91))
}

function generateSymbol(){
    const randNum = getRadInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}


 async function copyContent(){
    try{
       await navigator.clipboard.writeText(passwordDisplay.value);   
       copyMsg.innerText = "Copied";
    }catch(e){
       copyMsg.innerText = "failed"; 
    }
    // this make copied text visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active")
    }, 600);
    
}

function shuffalPassword(array){
    //fisher yate mathod.
     for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
     }
     let str ="";
     array.forEach((el)=>(str+=el));
     return str; 
}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;

    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})
inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});
 

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
});

generateBtn.addEventListener('click',()=>{
    //none of the checked box selected
    if(checkCount==0){
        return;
    }
    if(passwordLength <checkCount){
        passwordLength= checkCount;
        handleSlider();
    }
    //let start to find new password
    //remove old password
    password="";

    //let put the stuff mentioned by checkbox
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password += generateRandumNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }



    let funArr = [];
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }

     if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }

     if(numberCheck.checked){
        funArr.push(generateRandumNumber);
    }

     if(symbolsCheck.checked){
        funArr.push(generateSymbol);
    }

    //complasary addition

    for(let i =0; i<funArr.length; i++){
        password += funArr[i]();
    }
    //remaining addition
    for(let i = 0; i<passwordLength-funArr.length; i++){
        let randIndex = getRadInteger(0, funArr.length);
        console.log("randIndex"+randIndex);
        password +=  funArr[randIndex](); 
    }
    //suffle the password
    password = shuffalPassword(Array.from(password));

    //show i/p
     passwordDisplay.value = password;
     //calculate strength
     calcStrength();     
});
