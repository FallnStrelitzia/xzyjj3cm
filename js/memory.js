// js/memory.js
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.memory-grid');
    const movesCounter = document.querySelector('#moves-counter');
    const resetButton = document.querySelector('#reset-button');

    // Card symbols using simple text/emojis for easy styling
    const items = ['尺', '💰', 'F', '锅', '📞', '💻'];
    let cardItems = [...items, ...items]; // Duplicate items for pairs

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;

    function shuffle(array) {
        array.sort(() => 0.5 - Math.random());
    }

    function createBoard() {
        grid.innerHTML = '';
        shuffle(cardItems);
        matchedPairs = 0;
        moves = 0;
        movesCounter.textContent = moves;
        firstCard = null;
        secondCard = null;
        lockBoard = false;

        cardItems.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.item = item;

            const cardFront = document.createElement('div');
            cardFront.classList.add('front-face');
            cardFront.textContent = item;

            const cardBack = document.createElement('div');
            cardBack.classList.add('back-face');
            cardBack.textContent = '?';

            card.appendChild(cardFront);
            card.appendChild(cardBack);
            grid.appendChild(card);

            card.addEventListener('click', flipCard);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        moves++;
        movesCounter.textContent = moves;
        lockBoard = true;

        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.item === secondCard.dataset.item;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        matchedPairs++;
        if (matchedPairs === items.length) {
            setTimeout(() => {
                alert(`恭喜！你用 ${moves} 步完成了挑战！`);
            }, 500);
        }

        resetBoard();
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    resetButton.addEventListener('click', createBoard);

    // Initial setup
    createBoard();
});