
// Constant variable for use in creating card objects
const FACES = new Array('Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King')
const SUITES = new Array('Club', 'Diamond', 'Heart', 'Spade');
const SCORES = new Array(11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10);

let wins = 0;
let loses = 0;
let push = 0;

//Document Elements
let dealBtn = document.getElementById("dealBtn");
let hitBtn = document.getElementById('hitBtn');
let dblBtn = document.getElementById('dblBtn');
let stayBtn = document.getElementById('stayBtn')

let p1Div = document.getElementById("player1");
let dDiv = document.getElementById('dealer');

let p1Score = document.getElementById('player1-score');
let dScore = document.getElementById('dealer-score');

let p1Stats = document.getElementById('player1-stats');
let dStats = document.getElementById('dealer-stats');

let betPanel = document.getElementById('betPanel');
let winSpan = document.getElementById('wins');
let losesSpan = document.getElementById('loses');
let pushSpan = document.getElementById('push');

// Card objects
class card {
    constructor(face, suit, score) {
        this.face = face;
        this.suit = suit;
        this.score = score;
        this.visible = true;
        this.image = new Image(120, 184);
        this.setImage();
        this.image.classList.add('crd-img');  
        this.image.alt = this.toText;
    }

    toText = () => `${this.face} of ${this.suit}`;

    setImage = () => this.image.src = (this.visible) ? ((this.face.length <= 2) ? 
        `./images/cards/${this.face}${this.suit[0]}.png` : 
        `./images/cards/${this.face[0]}${this.suit[0]}.png`) : 
        "./images/cards/blue_back.png";

    flip = () => {
        this.visible = this.visible ? false : true;        
        this.setImage();
    }
}

// Deck objects
class deck {
    // pass in argument count for the number of decks to use in game
    constructor(count=1) {
        this.count = count;
        this.cards = [];
        for (let c = 1; c <= count; c++){ 
            for (let s = 0; s <= 3; s++){
                for(let f = 0; f <=12; f++)
                    this.cards.push(new card(FACES[f], SUITES[s], SCORES[f]));
            }
        }
        this.shuffle();
    }    

    shuffle = () => {
        let counter = this.cards.length; // Start at last element
        while (counter-- >= 0){        // Loop backword to first element
            // Generate random number between 0 and current value of counter
            let randNum = Math.floor(Math.random() * counter);		
		    //Swap current element at index [counter] with random preceding element
            let temp = this.cards[counter];
            this.cards[counter] = this.cards[randNum];
            this.cards[randNum] = temp;
        }
    }

    // Deals last card and removes it from deck
    dealCard = () => this.cards.pop();
}

// Hand objects
class hand{
    constructor() {
        this.cards = [];
        this.score = 0;
    }

    calcScore = () => {
        let handScore = this.cards.reduce((accumulator, crd) => accumulator + crd.score, 0);

        if (handScore > 21 && this.cards.some(crd => crd.score === 11)){
            /* Loop backward through hand and reduce score of any
            aces from 11 to 1 */
            for (let i = this.cards.length - 1; i >= 0; i--){
                if (this.cards[i].score == 11){
                    this.cards[i].score = 1;
                    handScore -= 10;
                    if (handScore <= 21) break;
                }
            }
        }
        this.score = handScore;
        return handScore;        
    }
}

// Create new deck on page load
let deck1 = new deck(1);

// Create player and dealer variables on page load
let player1;
let dealer;

dealBtn.addEventListener("click", () => {
    p1Stats.classList.remove('winner');
    dStats.classList.remove('winner');
    p1Stats.classList.remove('loser');
    dStats.classList.remove('loser');
    p1Stats.style.backgroundColor = "none";
    dStats.style.backgroundColor = "none";
    dealBtn.classList.add('hide');
    betPanel.classList.add('lower');
    hitBtn.classList.remove('hide');
    dblBtn.classList.remove('hide');
    stayBtn.classList.remove('hide');

    // Clear any existing card images and scores
    p1Div.innerHTML = '';
    dDiv.innerHTML = '';
    p1Score.innerHTML = '';
    dScore.innerHTML = '';

    // Create new deck if card count is getting low
    if (deck1.cards.length <= 10)
        deck1 = new deck(1);

    // Reset hands
    player1 = new hand();
    dealer = new hand();

    player1.cards.push(deck1.cards.pop());
    dealer.cards.push(deck1.cards.pop());
    player1.cards.push(deck1.cards.pop());
    dealer.cards.push(deck1.cards.pop());

    let plyr1Score = player1.calcScore();
    let dlrScore = dealer.calcScore();

    // Set image for dealer 2nd card to back of card
    if (dlrScore < 21)
        dealer.cards[1].flip();

    // Show cards
    for (var cnt = 0; cnt <=1; cnt++){
        p1Div.appendChild(player1.cards[cnt].image);
        dDiv.appendChild(dealer.cards[cnt].image);
    }        

    p1Score.innerHTML = plyr1Score;
    dScore.innerHTML = dealer.cards[0].score;   

    if (plyr1Score == 21 || dlrScore == 21){
        gameOver();
        if (dlrScore == 21)
            dScore.innerHTML = dlrScore;            
    }       
})

const hit = () => {
    dblBtn.classList.add('hide');

    player1.cards.push(deck1.cards.pop());
    p1Div.appendChild(player1.cards[player1.cards.length - 1].image);

    let pScore = player1.calcScore();
    p1Score.innerHTML = pScore;

    if (pScore > 21)
        gameOver();
}

const stay = () => {
    dealer.cards[1].flip();
    dDiv.removeChild(dDiv.childNodes[1]);
    dDiv.appendChild(dealer.cards[1].image);
    dScore.innerHTML = dealer.calcScore();

    while (dealer.calcScore() < 16){
        dealer.cards.push(deck1.cards.pop());
        dDiv.appendChild(dealer.cards[dealer.cards.length - 1].image);        
    }
    dScore.innerHTML = dealer.calcScore();
    gameOver();
}

hitBtn.addEventListener('click', hit)
dblBtn.addEventListener('click', () =>{
    hit();
    stay();
})
stayBtn.addEventListener('click', stay)

const resetControls = () => {
    dealBtn.classList.remove('hide');
    betPanel.classList.remove('lower');
    hitBtn.classList.add('hide');
    dblBtn.classList.add('hide');
    stayBtn.classList.add('hide');    
}

const gameOver = () => {
    resetControls();

    const playerWin = () => {
        p1Stats.classList.add('winner');
        dStats.classList.add('loser');
        wins++;
        winSpan.innerHTML = wins;
    }

    const playerLose = () => {
        dStats.classList.add('winner');
        p1Stats.classList.add('loser');
        loses++
        losesSpan.innerHTML = loses;
    }

    if (player1.score > 21){
        playerLose();
    } else {
        if (dealer.score > 21)
            playerWin();
        else if (player1.score != dealer.score)
            (player1.score > dealer.score) ? playerWin() : playerLose();
        else {
            push++;
            pushSpan.innerHTML = push;
        }
    }    
}

