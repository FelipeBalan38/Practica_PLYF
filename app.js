//
String.prototype.count = function (c) {
  var result = 0,
    i = 0;
  for (i; i < this.length; i++) if (this[i] == c) result++;
  return result;
};
// Se eliminaron algunas variables globales
let WON = false;
let THE_NUMBER = 0;
let DIGITS = 5;
let GUESSED = 0;
let FREE_PLAY = false;
let LEFT = DIGITS * 2;
//Copia de las variables globales
const obj = {WON,THE_NUMBER,DIGITS,GUESSED,FREE_PLAY,LEFT};
//Genera el número a adivinar
const generateANumber = digits => {
    let i = 0;
    let returnNumber = "";

    while (i < digits) {
      let num = Math.floor(Math.random() * 10).toString();
      (returnNumber.includes(num)) ?i -= 1 :returnNumber += num;
      i += 1;
    }
    console.log(returnNumber);
    return returnNumber;
}
//Determina si el userGuess tiene el mismo numero de dígitos
const getUserGuess = digits => userGuess => {
    for (let i = 0; i < 10; i++) {
      if (userGuess.count(i.toString()) > 1) return -1;
    }

  if (userGuess.length == digits) {
    return userGuess;
  } else {
    return -2;
  }
}
//Comprueba si los numeros coinciden y determina si se ha ganado
const checkTheNumber = theNumber => userGuess => {
  let isIn = 0;
  let isIt = 0;
  if (theNumber == userGuess) {
    return [obj.DIGITS, obj.DIGITS, true];
  }//Se ha ganado

  for (let i = 0; i < obj.DIGITS; i++) {
    if (theNumber.includes(userGuess[i])) {
      isIn += 1;
    }
    if (userGuess[i] == theNumber[i]) {
      isIt += 1;
    }
  }//Aún no se ha ganado
  if (isIn == 0 && isIt == 0) {
    return [0, 0, false];
  } else {
    return [isIn, isIt, false];
  }
}
//Inicialización de las variables globales
const start = digits => {
  obj.DIGITS = digits;
  obj.WON = false;
	obj.FREE_PLAY = false;
	obj.LEFT = obj.DIGITS * 2;
  obj.THE_NUMBER = generateANumber(obj.DIGITS);
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
    showMessage(0);
  } else if (parseInt(userGuess) == -2) {
    showMessage("WTF?!", "error");
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
    showMessage(`${obj.LEFT} intentos restantes`, "");
  } else {
    showMessage("Free play", "");
  }
  if (won) {
    showMessage("Ganaste", "success");
    disableInputs();
  }
}
//Función para mostrar mensajes en el Juego
const showMessage = (message, theClass = "") => {
  if (message == 0) {
    obj.GUESSED -= 1;
    obj.LEFT += 1;
    updateGuesses(obj.GUESSED);
    document.getElementById("message").innerHTML = "No repetir números.";
    document.getElementById("message").className = "error";
  } else {
    document.getElementById("message").innerHTML = message;
    document.getElementById("message").className = theClass;
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
//Numero de veces que se ha intentado adivinar
const updateGuesses = guesses => {
  if (guesses > DIGITS * 2) {
    document.getElementById("guessed").innerHTML = "Free play: " + guesses;
  } else {
    document.getElementById("guessed").innerHTML = "intentos: " + guesses;
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

  if (0 < dig && dig < 10) {
    document.getElementById("mainContainer").innerHTML = "";
    start(dig);
    makeSomeExamples(dig)(dig);
    closeHelp();
    disableInputs(1);
    document.getElementById("entered").innerHTML = "";
  }
}
//Comenzar el juego con numeros de 5 digitos
start(5);
makeSomeExamples(5)(5);

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