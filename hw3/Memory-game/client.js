

let cards = [];
let flippedCards = [];
let matchedCards = [];
let playerName = '';
let participants = {};
let rounds = 0;

function startGame() {
    playerName = document.getElementById('playerName').value;
    const gameSize = document.getElementById('gameSize').value;
    const numColumns = gameSize;

    gameBoard.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;

    if (playerName === '') {
        alert('Please enter your name to start the game.');
        return;
    }
    document.getElementById('playerName').disabled = true;
    document.getElementById('gameSize').disabled = true;
    document.querySelector('button').disabled = true;
    if (!participants[playerName]) {
        participants[playerName] = 0;
    }
    initializeCards(gameSize);
    shuffleCards(); 
    displayCards();
}

function initializeCards(size) {
    cards = [];

    // Fetch the animal data from a JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Get only the animal image URLs from the data
            const animalImages = data.map(animal => animal.image);

            // Generate card pairs using the animal image URLs
            const numPairs = size *  2;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < 2; j++) {
                    cards.push(animalImages[i % animalImages.length]);
                }
            }

            // Shuffle the cards after initializing
            shuffleCards();

            // Display the shuffled cards
            displayCards();
        })
        .catch(error => console.error('Error fetching animal data:', error));
}

function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

function displayCards() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        const img = document.createElement('img');
        img.src = 'card-back.jpg';
        img.classList.add('front');
        cardElement.appendChild(img);
        const backImg = document.createElement('img');
        backImg.src = card;
        backImg.classList.add('back');
        cardElement.appendChild(backImg);
        cardElement.addEventListener('click', () => flipCard.call(cardElement));
        gameBoard.appendChild(cardElement);
    });
}

function getRandomFlipAnimation() {
    const randomNumber = Math.floor(Math.random() * 3) + 1; // Generate a random number between 1 and 3
    
    // Apply different flip animations based on the random number
    switch (randomNumber) {
        case 1:
            return 'flip1'; // Apply flip1 animation
        case 2:
            return 'flip2'; // Apply flip2 animation
        case 3:
            return 'flip3'; // Apply flip3 animation
        default:
            return 'flip1'; // Default to flip1 animation
    }
}

function flipCard() {

    const flipAnimation = getRandomFlipAnimation();

    console.log("flipAnimation" + flipAnimation);
    if (flippedCards.length < 2 && !flippedCards.includes(this.dataset.index) && !matchedCards.includes(this.dataset.index)) {
        this.classList.add('flipped'); // Apply flipped class to the card element
        // Apply flip animation class to the card element
        this.style.animation = `${flipAnimation} 1.5s forwards`;

        flippedCards.push(this.dataset.index); // Add the index of the flipped card to the flippedCards array
        
        const cardImages = this.querySelectorAll('img');// Select all images within the card element
        if (flippedCards.length === 1) {
            console.log("after flipped");
        } else if (flippedCards.length === 2) {
            rounds++;
            setTimeout(() => {
                checkMatch(); // Execute the logic to check for matching cards
                setTimeout(() => {
                    // Flip both cards back to their front-facing state after a delay
                    resetFlippedCards(); // Reset flipped cards
                }, 1000); // Adjust the delay as needed
            }, 1000); // Adjust the delay as needed
        }
        
   
    }
}


function checkMatch() {
    const [card1, card2] = flippedCards;
    if (cards[card1] === cards[card2]) {
        matchedCards.push(card1, card2);
        participants[playerName] += 1;
        

        if (matchedCards.length === cards.length) {
            endGame();
        }
    } else {
        // Flip back unmatched cards after a delay
        setTimeout(() => {
            const cardsElements = document.querySelectorAll('.card');
            cardsElements[card1].classList.remove('flipped');
            cardsElements[card2].classList.remove('flipped');
            resetFlippedCards(); // Reset flipped cards
        }, 2000); // Adjust the delay as needed
    }
}

function resetFlippedCards() {
    flippedCards = []; // Clear flippedCards array
}



// Function to end the game
function endGame() {
    // Update participants' scores
    updateParticipantsScores();
    // Update the record table
    updateRecordTable();
    // Save records to JSON
    saveRecordsToJSON();
    alert('Congratulations! You have won the game!');
    resetGame();


}
function resetGame() {
    // Reset game state
    cards = [];
    flippedCards = [];
    matchedCards = [];
    playerName = '';
    rounds = 0;

    // Clear the game board
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    // Reset input fields
    document.getElementById('playerName').value = '';
    document.getElementById('gameSize').value = '';

    // Enable input fields and start game button
    document.getElementById('playerName').disabled = false;
    document.getElementById('gameSize').disabled = false;
    document.querySelector('button').disabled = false;

}

// Function to update participants' scores
function updateParticipantsScores() {
    if (!participants[playerName]) {
        participants[playerName] = 0;
    }
    participants[playerName] = rounds;
}

// Function to update the record table
function updateRecordTable() {
    const table = document.getElementById('table');

    // Store the header row
    const headerRow = table.rows[0];

    // Clear existing rows from the table
    table.innerHTML = '';

    // Re-insert the header row
    table.appendChild(headerRow);



    // Convert participants object into an array of objects
    const participantsArray = Object.keys(participants).map(name => ({ name, roundsPlayed: participants[name] }));

    // Sort participants based on rounds played (ascending order)
    participantsArray.sort((a, b) => a.roundsPlayed - b.roundsPlayed);

    // Add rows to the table
    participantsArray.forEach(participant => {
        const row = table.insertRow();
        row.insertCell(0).textContent = participant.name;
        row.insertCell(1).textContent = participant.roundsPlayed;
    });
}


function saveRecordsToJSON() {
    const records = Object.entries(participants).map(([name, roundsPlayed]) => ({ name, roundsPlayed }));
    fetch('/saveRecords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(records)
    })
    .then(response => {
        if (response.ok) {
            console.log('Records saved successfully.');
        } else {
            console.error('Failed to save records to server.');
        }
    })
    .catch(error => console.error('Error saving records to server:', error));
}
