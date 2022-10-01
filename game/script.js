const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
//Items array
const items = [
  { name: "The first modern variable star was identified, Omicron Ceti, and it helped verify that the stars were not eternal and fixed.", image: "https://i.postimg.cc/fTJXFdfM/photo-2022-09-22-19-21-14.jpg" },
  { name: "Algol's mood swings. It is an eclipsing binary star. This type of binaries consist of two stars, each star revolving around the other", image: "https://i.postimg.cc/43gRqztM/Algol-type-variable-binary-star-animation-5.gif" },
  { name: "Algol, also nicknamed the Demon Star, is the second brightest star in the constellation of Perseus. Algol is an excellent example of a variable star .", image: "https://i.postimg.cc/bJrCBJ6W/photo.jpg" },
  { name: "Our own sun is a variable star; its energy output varies by approximately 0.1 percent, or one-thousandth of its magnitude, over an 11-year solar cycle.", image: "https://i.postimg.cc/bvWC4PKv/photo.jpg" },
  // { name: "Jupiter’s moon Ganymede is proving to be a fascinating world", image: "https://i.postimg.cc/QNgDz4cP/Ganymede.jpg" },
  // { name: "Jupiter is 1317 times the size of Earth", image: "https://i.postimg.cc/3w2fw6rQ/jupiter.jpg" },
  // { name: "Jupiter's average length is between 9H and 56Min near the poles to 9H and 50Min near the equator.", image: "https://i.postimg.cc/KzMG4mkv/f1.webp" },
  // { name: "Fifth in line from the Sun, Jupiter is, by far, the largest planet in the solar system", image: "https://i.postimg.cc/tTHftbvg/ju.jpg" },
  // { name: "Jupiter has 79 moons", image: "https://i.postimg.cc/NF2HshY1/moons.jpg" },
  // { name: "sloth", image: "https://cdn-icons-png.flaticon.com/64/3277/3277736.png" },
  // { name: "cockatoo", image: "https://cdn-icons-png.flaticon.com/64/3277/3277741.png" },
  // { name: "toucan", image: "https://cdn-icons-png.flaticon.com/64/3277/3277739.png" },
];
//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;
//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};
//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};
//Pick random objects from the items array
const generateRandom = (size = 2) => {
  //temporary array
  let tempArray = [...items];
  //initializes cardValues array
  let cardValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};
const matrixGenerator = (cardValues, size = 2) => {
  gameContainer.innerHTML = "";
  
  const cardValuesNames = [...cardValues];  // change
  const cardValuesImages = [...cardValues];  // change
  
  cardValuesNames.sort(() => Math.random() - 0.5);  // change
  cardValuesImages.sort(() => Math.random() - 0.5);  // change
  
  //simple shuffle
  var total = [];
  for (let i = 0; i < (size * size) / 2; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
  
    let value1 = `
    <div class="card-container dell " data-card-value="${cardValuesNames[i].name}">
        <div class="card-before">?</div>
        <div class="card-after lol">${cardValuesNames[i].name}</div>
    </div>
    `;
    total.push(value1);
    let value2 = `
    <div class="card-container ff " data-card-value="${cardValuesImages[i].name}">
        <div class="card-before">?</div>
        <div class="card-after beb ">
        <img src="${cardValuesImages[i].image}" class="image"/></div>
    </div>
    `;
    total.push(value2);
  }
  
  total.sort(() => Math.random() - 0.5);
  
  for (ele of total) {
    gameContainer.innerHTML += ele;
  }
  
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length)) {
              result.innerHTML = `<h2>You are a great astronaut !!! Keep going &#128516</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};
//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});
//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);
//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};