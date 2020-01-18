// Constant variable for use in creating card objects
const FACES = new Array('Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King')
const SUITES = new Array('Club', 'Diamond', 'Heart', 'Spade');
const SCORES = new Array(11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10);


// Card objects
class card {
    constructor(face, suit, score) {
        this.face = face;
        this.suit = suit;
        this.score = score;
        this.visible = true;
        this.image = new Image(120, 184);

        if (this.face.length <= 2)
            this.image.src = "./images/cards/" + this.face + this.suit[0] + ".png";
        else
            this.image.src = "./images/cards/" + this.face[0] + this.suit[0] + ".png";

        this.image.classList.add('crd-img');  
        this.image.alt = this.toText;
    }

    get toText() {
        return this.face + ' of ' + this.suit;
    }

    flip = () => {
        if (this.visible = true){
            this.visible = false;
            this.image.style.opacity = "1;"
            
        } else{
            this.visible = true;
            this.image.style.opacity = "0;";
        }
    }
}

// Deck objects
class deck {
    // pass in argument count for the number of decks to use in game
    constructor(count) {
        this.count = count;
        this.cards = [];
        for (let c = 1; c <= count; c++){ 
            for (let s = 0; s <= 3; s++){
                for(let f = 0; f <=12; f++)
                    this.cards.push(new card(FACES[f], SUITES[s], SCORES[f]));
            }
        }
        console.log('New Deck');
        this.shuffle();
    }
    

    shuffle = () => {
        let counter = this.cards.length; // Start at last element
        while (counter > 0){        // Loop backword to first element

            // Generate random number between 0 and current value of counter
            let randNum = Math.floor(Math.random() * counter);
            
            counter--; // Reduce counter by 1
		
		    //Swap current element at index [counter] with random preceding element
            let temp = this.cards[counter];
            this.cards[counter] = this.cards[randNum];
            this.cards[randNum] = temp;
        }
    }

    // Deals last card and removes it from deck
    dealCard = () => this.cards.pop();
}

class hand{
    constructor() {
        this.cards = [];
        this.score = 0;
    }

    calcScore = () => {
        let handScore = 0;
        for (let i = 0; i < this.cards.length; i++){
            handScore += this.cards[i].score;
        }
        if (handScore > 21){
            /* Loop backward through hand and reduce score of any
               aces from 11 to 1 */
            for (let i = this.cards.length - 1; i >= 0; i--){
                if (this.cards[i].score == 11){
                    this.cards[i].score = 1;
                    handScore -= 10;
                    if (handScore <= 21)
                        break;
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


function dealGame(){
    var p1Div = document.getElementById('player1');
    var dDiv = document.getElementById('dealer');

    var p1Score = document.getElementById('player1-score');
    var dScore = document.getElementById('dealer-score');

    var p1Stats = document.getElementById('player1-stats');
    var dStats = document.getElementById('dealer-stats');

    p1Stats.classList.remove('winner');
    dStats.classList.remove('winner');
    p1Stats.classList.remove('loser');
    dStats.classList.remove('loser');
    p1Stats.style.backgroundColor = "#285028";
    dStats.style.backgroundColor = "#285028";

    var hitBtn = document.getElementById('hitBtn');
    hitBtn.classList.remove('hide');

    var dblBtn = document.getElementById('dblBtn');
    dblBtn.classList.remove('hide');

    var stayBtn = document.getElementById('stayBtn')
    stayBtn.classList.remove('hide');

    var dealBtn = document.getElementById('dealBtn');
    dealBtn.classList.add('hide');

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

    dealer.cards[1].flip();

    var p1Div = document.getElementById('player1');
    var dDiv = document.getElementById('dealer');

    // Show both player cards
    for (var cnt = 0; cnt <=1; cnt++){
        p1Div.appendChild(player1.cards[cnt].image);
    }    

    // Show only first Dealer card
    dDiv.appendChild(dealer.cards[0].image);

    let plyr1Score = player1.calcScore();
    let dlrScore = dealer.calcScore();

    p1Score.innerHTML = plyr1Score;
    dScore.innerHTML = dealer.cards[0].score;

    if (plyr1Score == 21 || dlrScore == 21){
        gameOver();
        if (dlrScore == 21){
            dDiv.appendChild(dealer.cards[1].image);
            dScore.innerHTML = dlrScore;
        }
    }
}

function hitMe(){
    var p1Div = document.getElementById('player1');
    var dblBtn = document.getElementById('dblBtn');
    var p1Score = document.getElementById('player1-score');
    dblBtn.classList.add('hide');

    player1.cards.push(deck1.cards.pop());
    p1Div.appendChild(player1.cards[player1.cards.length - 1].image);

    let pScore = player1.calcScore();
    p1Score.innerHTML = pScore;

    if (pScore > 21){
        gameOver();
    }
}

function stay(){
    var dDiv = document.getElementById('dealer');
    var dScore = document.getElementById('dealer-score');

    dDiv.appendChild(dealer.cards[1].image);
    dScore.innerHTML = dealer.calcScore();

    while (dealer.calcScore() < 16){
        dealer.cards.push(deck1.cards.pop());
        dDiv.appendChild(dealer.cards[dealer.cards.length - 1].image);
        dScore.innerHTML = dealer.calcScore();
    }

    gameOver();
}

function resetControls() {
    var dealBtn = document.getElementById('dealBtn');
    dealBtn.classList.remove('hide');

    var hitBtn = document.getElementById('hitBtn')
    hitBtn.classList.add('hide');

    var dblBtn = document.getElementById('dblBtn');
    dblBtn.classList.add('hide');

    var stayBtn = document.getElementById('stayBtn')
    stayBtn.classList.add('hide');
    
}

function gameOver(){
    resetControls();

    var p1Stats = document.getElementById('player1-stats');
    var dStats = document.getElementById('dealer-stats');

    if (player1.score > 21){
        dStats.classList.add('winner');
        p1Stats.classList.add('loser');
    } else {
        if (dealer.score > 21){
            p1Stats.classList.add('winner');
            dStats.classList.add('loser');
        } else {
            if (player1.score > dealer.score){
                p1Stats.classList.add('winner');
                dStats.classList.add('loser');
            } else if (dealer.score > player1.score){
                dStats.classList.add('winner');
                p1Stats.classList.add('loser');
            }
        }
    }
}


