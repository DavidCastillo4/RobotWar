'use strict'

class Player {
    cards = [];
    id = null;
    divId = null;
    constructor(divId) {
        this.id = Math.random();
        this.divId = divId;
    };
};

let player1 = new Player('player1');
let player2 = new Player('player2');
let p1 = document.getElementById('player1');
let p2 = document.getElementById('player2');

generateRobot(player1);
generateRobot(player2);
generateAndDealCards();

function generateAndDealCards() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            let deckId = json.deck_id;
            dealCards(deckId);
        })
    console.log('generateDeckId')
};

function dealCards(deckId) {
    fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=52")
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            for (let i = 0; i < json.cards.length; i += 2) {
                player1.cards.push(json.cards[i])
                player2.cards.push(json.cards[i + 1])
            }
            updatePlayerCardCount(player1);
            updatePlayerCardCount(player2);
        })
    console.log('Deal')
};

function updatePlayerCardCount(player) {
    let countDiv = document.getElementById(player.divId + "Count");
    countDiv.innerText = player.cards.length;
};

function generateRobot(player) {
    fetch('https://robohash.org/' + player.id)
        .then(function(response) {
            return response.blob();
        }).then(function(blob) {
            insertRobot(player.divId, blob)
        });
};

function insertRobot(divId, blob) {
    let img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    let playerDiv = document.getElementById(divId);
    playerDiv.appendChild(img);
}

function playTurn() {
    let card1 = player1.cards.shift();
    let card2 = player2.cards.shift();
    document.getElementById('player1Card').src = card1.image;
    document.getElementById('player2Card').src = card2.image;
    let v1 = getCardValue(card1);
    let v2 = getCardValue(card2);

    if (v1 > v2) {
        player1.cards.push(card1);
        player1.cards.push(card2);
        toggleBackgroundColor(1);
    } else if (v1 < v2) {
        player2.cards.push(card1);
        player2.cards.push(card2);
        toggleBackgroundColor(2);
    } else {
        player1.cards.push(card1);
        player2.cards.push(card2);
        toggleBackgroundColor(0);
    }
    updatePlayerCardCount(player1);
    updatePlayerCardCount(player2);
};

function getCardValue(card) {
    let value = card.value;
    if (value == "JACK") {
        return 11;
    } else if (value == "QUEEN") {
        return 12
    } else if (value == "KING") {
        return 13
    } else if (value == "ACE") {
        return 14
    } else {
        return parseInt(value);
    }
};

function toggleBackgroundColor(i) {
    if (i == 1) {
        p1.className = 'winner';
        p2.className = 'loser';
    }
    if (i == 2) {
        p2.className = 'winner';
        p1.className = 'loser';
    }
    if (i == 0) {
        p1.className = 'winner';
        p2.className = 'winner';
    }
};