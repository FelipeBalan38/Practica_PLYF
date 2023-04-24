/* MODIFICAIONES:
1. HTML: Al inicio del juego el usuario elige el numero de digitos.
2. Setters y Getter de las variables globales
3. Se volvieron puras varias funciones(count, gerUsserGuess, checkTheNumber).
4. Se crearon funciones de proposito específico, para volver más entendible el código.
5. Se dividieron varias funciones para darles solo tareas específicas.
6. Se simplificaron varias funciones (p.ej. Mensaje se volvio parcial).
7. Se eliminó en onclick del HTML(no se consideraba adecuado) y se agreo el event listener adecuado.
8. Cambios pequeños a varias funciones (eliminacion de algunos for y uso de operadores ternarios para algunos if)
9. Antes al resetear el juego los intentos no se reseteaban, ahora sí
10. Entre otras cambios.
*/
// Se eliminaron algunas variables globales
let WON = false;
let THE_NUMBER = 0;
let DIGITS = 5;
let GUESSED = 0;
let LEFT = DIGITS * 2;
/* var FREE_PLAY = false;
let REPEATED_DIGITS = 0; */

//Copia de las variables globales
const obj = {WON,THE_NUMBER,DIGITS,GUESSED,LEFT};

//Seter y geters de las variables globales, para no trabajar directamente
//con estas dentro de las funciones. (Se aplican al objeto como se observa)
const setWon = value => obj.WON = value;
const getWon = () => {return obj.WON;}

const setNumber = value => obj.THE_NUMBER = value;
const getNumber = () => {return obj.THE_NUMBER}

const setDigits = value => obj.DIGITS = value;
const getDigits = () => {return obj.DIGITS}

const setGuessed = value => obj.GUESSED = value;
const getGuessed = () => {return obj.GUESSED}

const setLeft = value => obj.LEFT = value;
const getLeft = () => {return obj.LEFT}

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
      let num = Math.floor(Math.random() * 10).toString();
      (returnNumber.includes(num)) ?i -= 1 :returnNumber += num;
      i += 1;
    }
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
//Se editó para que ahora se usen los setters y getters y no las variables globales directamente
const start = digits => {
  setDigits(digits);
  setWon(false);
  setLeft(getDigits()*2);
  setNumber(generateANumber(getDigits()));
  updateGuesses(0);
}
/* function start(digits = 4) {
  // global WON, THE_NUMBER, DIGITS
  DIGITS = digits;
  WON = false;
	FREE_PLAY = false;
	LEFT = DIGITS * 2;
  THE_NUMBER = generateANumber(DIGITS);
} */

//Función para mostrar mensajes en el juego
//Se hizo parcial y se pide ahora el elemento HTML donde se desea mostra el mensaje
const showMessage = htmlId => message => theClass => {
  document.getElementById(htmlId).innerHTML = message;
  document.getElementById(htmlId).className = theClass;
}
/* function showMessage(message, theClass = "") {
  if (message == 0) {
    GUESSED -= 1;
    LEFT += 1;
    updateGuesses(GUESSED);
    document.getElementById("message").innerHTML = "No repetir números.";
    document.getElementById("message").className = "error";
  } else {
    document.getElementById("message").innerHTML = message;
    document.getElementById("message").className = theClass;
  }
} */

//Numero de veces que se ha intentado adivinar
const updateGuesses = guesses => {
  //Con asignacion parcial se fija el primer argumento
  const showGuessed = showMessage("guessed");
  (guesses > getDigits() * 2) 
  ?showGuessed(`Free play: ${guesses}`)("guessed") 
  :showGuessed(`Intentos: ${guesses}`)("guessed");
}
/* function updateGuesses(guesses) {
  if (guesses > DIGITS * 2) {
    document.getElementById("guessed").innerHTML = "Free play: " + guesses;
  } else {
    document.getElementById("guessed").innerHTML = "intentos: " + guesses;
  }
} */

//Se fija el primer argumento, ya que se usa en varias definiciones
const message = showMessage("message");

//Se define mensaje de error
const showMessageFail = () =>{
  message("No repetir números.")("error");
}

//Va revisando los numeros que se ingresan
const game = userGuess => {
  userGuess = getUserGuess(getDigits())(userGuess);
  if (parseInt(userGuess) > 0) {
    let result = checkTheNumber(getNumber())(userGuess);
    let isIn = result[0];
    let isIt = result[1];
    setWon(result[2]);
    //Se usan los setters y getters
    circleGuess(isIn)(isIt)(userGuess);
    gameState(getWon());
  } else if (parseInt(userGuess) == -1) {
    setGuessed(getGuessed()-1);
    setLeft(getLeft()+1)
    updateGuesses(getGuessed());
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
  //Se cambiaron los for por repeats
    toAddIsHead += "●".repeat(isIt);
    toAddIsHead += "○".repeat(isIn - isIt);
  theContainer.innerHTML += toAddHead + toAddIsHead + toAddIsTail + toAddTail;
}

//Función para determinar estado del juego (Ganador,intentos restantes)
const gameState = won =>{
  //Cambiado a operadores ternarios
  (getLeft() > 0) 
  ?message(`${getLeft()} intentos restantes`)("") 
  :message("Free play")("")
  if (won) {
    message("Ganaste")("success");
    disableInputs();
  }
}
/* function gameState(isIn, isIt, won, userGuess) {
  let theContainer = document.getElementById("mainContainer");
  let toAddHead = "<div class='row'>";
  let toAddTail = `</div>`;
  // let toAddTail = `</div><div class="clear"></div>`;
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

  if (LEFT > 0) {
    showMessage(`${LEFT} intentos restantes`, "");
  } else {
    showMessage("Free play", "");
  }

  if (won) {
    showMessage("Ganaste", "success");
    disableInputs();
  }
} */

//Genera ejemplos segun el numero de digitos
const makeSomeExamples = digits => examples => {
    for (let i = 0; i < examples; i++) {
      game(generateANumber(digits));
    }//Hace lo mismo que generar numero, así que se reemplaza por esa función
}
/* function makeSomeExamples(digits, examples, repeat = false) {
  if (!repeat) {
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
      // eel.game(number)();
      game(number);
    }
  } else {
    // todo
  }
} */

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
//Se eliminaron del HTML los onclick y se uso el evento correspondiente para cada botón
//Funciones para ocultar y mostrar ciertas ventanas, ya que se usaban mucho
const hideContainer = container => {
  document.getElementById(container).classList.add("hidden");
}
const showContainer = container => {
  document.getElementById(container).classList.remove("hidden");
}
//Funcion para iniciar y resetear el juego muy similares, entonces se crea una y se piden ciertos valores.
const inputValues = input => container => {
  let dig = parseInt(document.getElementById(input).value);
    document.getElementById("mainContainer").innerHTML = "";
    start(dig);
    makeSomeExamples(dig)(dig);
    hideContainer(container);
    disableInputs(1);
    document.getElementById("entered").innerHTML = "";
}
//Evento del click simplificado
document.addEventListener("click", e => {
  if(e.target.matches("#start")){
    inputValues("startDigit")("startContainer");
  }//Iniciar el juego con n digitos
  if(e.target.matches("#openhelp")){
    showContainer("helpContainer");
  }//Abrir ventana de ayuda
  if(e.target.matches("#closehelp")){
    hideContainer("helpContainer");
  }//Cerrar ventana de ayuda
  if(e.target.matches("#btnInput")){
    inputValues("inputDigit")("helpContainer");   
  }//Resetear juego a n dígitos
});
/* function closeHelp() {
  document.getElementById("helpContainer").classList.add("hidden");
}
function openHelp() {
  document.getElementById("helpContainer").classList.remove("hidden");
}
function modifyDigits() {
  let dig = parseInt(document.getElementById("inputDigit").value);

  if (0 < dig && dig < 10) {
    DIGITS = dig;
    document.getElementById("mainContainer").innerHTML = "";
    // eel.start(DIGITS)();
    start(DIGITS);
    makeSomeExamples(DIGITS, DIGITS);
    closeHelp();
    disableInputs(1);
    document.getElementById("entered").innerHTML = "";
  } else {
    // todo
  }
}
start(DIGITS);
makeSomeExamples(DIGITS, DIGITS); */

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
      if (textElem.innerHTML.length == getDigits()) {
        textElem.innerHTML = "";
        textElem.innerHTML += number;
      } else {
        textElem.innerHTML += number;
        if (textElem.innerHTML.length == getDigits()) {
          setGuessed(getGuessed()+1);
          setLeft(getLeft()-1)
          updateGuesses(getGuessed());
          game(textElem.innerHTML);
        }
      }
    }
  }
}