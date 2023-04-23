/* MODIFICAIONES:
1. HTML: Al inicio del juego el usuario elige el numero de digitos.
2. Funcion count vuelta pura.
*/
// Se eliminaron algunas variables globales
let WON = false;
let THE_NUMBER = 0;
let DIGITS = 5;
let GUESSED = 0;
let FREE_PLAY = false;
let LEFT = DIGITS * 2;
//Copia de las variables globales
const obj = {WON,THE_NUMBER,DIGITS,GUESSED,FREE_PLAY,LEFT};
//Cambio de count a funcion pura, para encontrar numeros repetidos.
const count = (number) => {
  const numbers = number.split("");
  return (new Set(numbers).size < numbers.length) ?-1 :2;
}
/* String.prototype.count = function (c) {
  var result = 0,
    i = 0;
  for (i; i < this.length; i++) if (this[i] == c) result++;
  return result;
}; */
//Genera el número a adivinar
const generateANumber = digits => {
    let i = 0;
    let returnNumber = "";
    while (i < digits) {
      let num = Math.floor(Math.random() * 10).toString();//Hacer funcion unica porque se repite en la linea 139
      (returnNumber.includes(num)) ?i -= 1 :returnNumber += num;
      i += 1;
    }
    console.log(returnNumber);
    return returnNumber;
}
//Determina si el userGuess tiene el mismo numero de dígitos
//Modificacion de esta funcion, usando el nuevo count y volviendolo más legible
const getUserGuess = digits => userGuess => {
  if(count(userGuess) === -1) return -1;
  return (userGuess.length == digits) ?userGuess :-2;
}
/* function getUserGuess(digits, userGuess, repeated = REPEATED_DIGITS) {
  if (!repeated) {
    for (let i = 0; i < 10; i++) {
      if (userGuess.count(i.toString()) > 1) {
        return -1; // ! repeated digits error
      }
    }
  }
  // else{
  //   todo ...}

  if (userGuess.length == digits) {
    return userGuess;
  } else {
    // print("WTF ?!")
    return -2; // ! length error
  }
} */
//Comprueba si los numeros coinciden y determina si se ha ganado
//Usando operadores ternarios se dejó más sencilla la función
const checkTheNumber = theNumber => userGuess => {
  let isIn = isInFunc(theNumber)(userGuess);
  let isIt = isItFunc(theNumber)(userGuess);

  if(theNumber === userGuess) return [isIn, isIt, true];
  return (isIn == 0 && isIt == 0) ?[0, 0, false] :[isIn, isIt, false];
}
//Se crearon dos fucniones puras que retornan el numero de coincidencias (IsInFunc) y el numero de numeros que están en su lugar (IsItFunc).
const isInFunc = theNumber => userGuess => {
  let isIn = 0;
  theNumber.split("").forEach(el => {if(userGuess.includes(el)) isIn++});
  return isIn;
};
const isItFunc = theNumber => userGuess => {
  let isIt = 0;
  theNumber.split("").forEach((el,index) => {if(el === userGuess[index]) isIt++});
  return isIt;
} ;
/* function checkTheNumber(theNumber, userGuess) {
  let isIn = 0; // * is in
  let isIt = 0; // * is in right place
  if (theNumber == userGuess) {
    return [DIGITS, DIGITS, true];
  }

  for (let i = 0; i < DIGITS; i++) {
    if (theNumber.includes(userGuess[i])) {
      isIn += 1;
    }
    if (userGuess[i] == theNumber[i]) {
      isIt += 1;
    }
  }
  if (isIn == 0 && isIt == 0) {
    return [0, 0, false];
  } else {
    return [isIn, isIt, false];
  }
} */
//Inicialización de las variables globales
const start = digits => {
  obj.DIGITS = digits;
  obj.WON = false;
	obj.FREE_PLAY = false;
	obj.LEFT = obj.DIGITS * 2;
  obj.THE_NUMBER = generateANumber(obj.DIGITS);
}
//Función para mostrar mensajes en el juego
//Se hizo parcial y se pide ahora el elemento HTML donde se desea mostra el mensaje
const showMessage = htmlId => message => theClass => {
  document.getElementById(htmlId).innerHTML = message;
  document.getElementById(htmlId).className = theClass;
}
//Numero de veces que se ha intentado adivinar
const updateGuesses = guesses => {
  //Con asignacion parcial se fija el primer argumento
  const showGuessed = showMessage("guessed");
  if (guesses > DIGITS * 2) {
    showGuessed(`Free play: ${guesses}`)("guessed");
  } else {
    showGuessed(`Intentos: ${guesses}`)("guessed");
  }
}
//Se fija el primer argumento, ya que se usa en varias definiciones
const message = showMessage("message");
//Se define mensaje de error
const showMessageFail = () =>{
  message("No repetir números.")("error");
}

//Va revisando los numeros que se ingresan
const game = userGuess => {
  userGuess = getUserGuess(obj.DIGITS)(userGuess);
  if (parseInt(userGuess) > 0) {
    let result = checkTheNumber(obj.THE_NUMBER)(userGuess);
    let isIn = result[0];
    let isIt = result[1];
    obj.WON = result[2];

    circleGuess(isIn)(isIt)(userGuess);
    gameState(obj.WON);
  } else if (parseInt(userGuess) == -1) {
    obj.GUESSED -= 1;
    obj.LEFT += 1;
    updateGuesses(obj.GUESSED);
    showMessageFail();
  } else if (parseInt(userGuess) == -2) {
    message("WTF?!")("error");
  }
}
//Separado en dos funciones, uno para pintar los circulos
const circleGuess = isIn => isIt => userGuess => {
  let theContainer = document.getElementById("mainContainer");
  let toAddHead = "<div class='row'>";
  let toAddTail = `</div>`;

  for (let i = 0; i < userGuess.length; i++) {
    toAddHead += `<span class='circleGuessed'>${userGuess[i]}</span>`;
  }

  let toAddIsHead = "<span class='state'>";
  let toAddIsTail = "</span>";
  for (let i = 0; i < isIt; i++) {
    toAddIsHead += "●"; //○●◯⚪⚫⦾⦿⨀⬤
  }
  for (let i = 0; i < isIn - isIt; i++) {
    toAddIsHead += "○";
  }
  theContainer.innerHTML += toAddHead + toAddIsHead + toAddIsTail + toAddTail;
} 
//Función para determinar estado del juego (Ganador,intentos restantes)
const gameState = won =>{
  if (obj.LEFT > 0) {
    message(`${obj.LEFT} intentos restantes`)("");
  } else {
    message("Free play")("");
  }
  if (won) {
    message("Ganaste")("success");
    disableInputs();
  }
}
//Genera ejemplos segun el numero de digitos
const makeSomeExamples = digits => examples => {
    for (let i = 0; i < examples; i++) {
      let number = "";
      let guessedDigit = 0;
      let added = [];
      for (let j = 0; j < digits; j++) {
        guessedDigit = Math.floor(Math.random() * (10 - 0) + 0);
        if (!added.includes(guessedDigit)) {
          added.push(guessedDigit);
          number += guessedDigit.toString();
        } else {
          j--;
        }
      }
      game(number);
    }
}
//Función para desabilitar input una vez ganado
const disableInputs = (enable = 0) => {
  let inputs = document.getElementsByClassName("inputs");
  if (enable) {
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = false;
    }
  } else {
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
  }
}
//Funciones para mostrar y ocultar las reglas
function closeHelp() {
  document.getElementById("helpContainer").classList.add("hidden");
}
function openHelp() {
  document.getElementById("helpContainer").classList.remove("hidden");
}
//Funcion para elegir el numero de digitos para jugar
function modifyDigits() {
  let dig = parseInt(document.getElementById("inputDigit").value);

    document.getElementById("mainContainer").innerHTML = "";
    start(dig);
    makeSomeExamples(dig)(dig);
    closeHelp();
    disableInputs(1);
    document.getElementById("entered").innerHTML = "";
}
//Comenzar el juego con numeros de digitos elegido por el usuario 
document.addEventListener("click", e => {
  if(e.target.matches("#start")){
    let dig = parseInt(document.getElementById("startDigit").value);
    start(dig);
    makeSomeExamples(dig)(dig);
    document.getElementById("startContainer").classList.add("hidden");
  }
})

document.addEventListener("keydown", function (event) {
  var pressed = event.key;
  switch (pressed) {
    case "0":
      clicked("0", 0, 1);
      break;

    case "1":
      clicked("1", 0, 1);
      break;

    case "2":
      clicked("2", 0, 1);
      break;

    case "3":
      clicked("3", 0, 1);
      break;

    case "4":
      clicked("4", 0, 1);
      break;

    case "5":
      clicked("5", 0, 1);
      break;

    case "6":
      clicked("6", 0, 1);
      break;

    case "7":
      clicked("7", 0, 1);
      break;

    case "8":
      clicked("8", 0, 1);
      break;

    case "9":
      clicked("9", 0, 1);
      break;

    case "c":
      clicked("c", 1, 1);
      break;
    case "Delete":
      clicked("c", 1, 1);
      break;
    case "Backspace":
      clicked("b", 0, 1, 1);
      break;
    default:
      break;
  }
});

function clicked(element, clear = 0, key = 0, back = 0) {
  if (back) {
    let textElem = document.getElementById("entered");

    textElem.innerHTML = textElem.innerHTML.slice(
      0,
      textElem.innerHTML.length - 1
    );
  } else {
    let number = 0;
    if (key) {
      number = element;
    } else {
      number = element.innerText;
    }

    let textElem = document.getElementById("entered");
    if (clear) {
      textElem.innerHTML = "";
    } else {
      if (textElem.innerHTML.length == obj.DIGITS) {
        textElem.innerHTML = "";
        textElem.innerHTML += number;
      } else {
        textElem.innerHTML += number;
        if (textElem.innerHTML.length == obj.DIGITS) {
          obj.GUESSED += 1;
          obj.LEFT -= 1;
          updateGuesses(obj.GUESSED);
          game(textElem.innerHTML);
        }
      }
    }
  }
}