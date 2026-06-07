const vocabulary = [
    { word: 'duck', hint: 'Water bird that quacks', emoji: '🦆' },
    { word: 'fly', hint: 'Small insect with wings', emoji: '🪰' },
    { word: 'butterfly', hint: 'Colorful winged insect', emoji: '🦋' },
    { word: 'tiger', hint: 'Orange cat with stripes', emoji: '🐯' },
    { word: 'crab', hint: 'Sea creature with claws', emoji: '🦀' },
    { word: 'cobra', hint: 'Dangerous snake', emoji: '🐍' },
    { word: 'elephant', hint: 'Large animal with trunk', emoji: '🐘' },
    { word: 'monkey', hint: 'Primate that climbs', emoji: '🐵' },
    { word: 'cow', hint: 'Farm animal that moos', emoji: '🐄' },
    { word: 'buffalo', hint: 'Large horned animal', emoji: '🐃' },
    { word: 'camel', hint: 'Desert animal with humps', emoji: '🐪' },
    { word: 'cockroach', hint: 'Insect in homes', emoji: '🪳' },
    { word: 'crocodile', hint: 'Reptile in water', emoji: '🐊' },
    { word: 'frog', hint: 'Green hopper amphibian', emoji: '🐸' },
    { word: 'giraffe', hint: 'Tall animal with long neck', emoji: '🦒' },
    { word: 'lion', hint: 'King of beasts', emoji: '🦁' },
    { word: 'fish', hint: 'Lives in water', emoji: '🐠' },
    { word: 'cheetah', hint: 'Fastest land animal', emoji: '🐆' },
    { word: 'sheep', hint: 'Farm animal with wool', emoji: '🐑' }
];

let currentIndex = 0;
let score = 0;
let answered = {};
let currentWordLength = 0;

// Load current card
async function loadCard(index) {
    currentIndex = index;
    const item = vocabulary[index];
    
    // Reset input
    document.getElementById('answerInput').value = '';
    currentWordLength = item.word.length;
    updateBlanksDisplay();
    
    // Update UI
    document.getElementById('current').textContent = index + 1;
    document.getElementById('hint').textContent = item.hint;
    document.getElementById('feedbackText').textContent = '';
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('answerInput').focus();
    
    // Update progress bar
    const progress = ((index + 1) / vocabulary.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === vocabulary.length - 1;
    
    // Display emoji instead of image
    const imageElement = document.getElementById('animalImage');
    imageElement.style.display = 'none';
    
    // Get or create emoji display
    let emojiDisplay = document.getElementById('emojiDisplay');
    if (!emojiDisplay) {
        emojiDisplay = document.createElement('div');
        emojiDisplay.id = 'emojiDisplay';
        emojiDisplay.style.cssText = 'font-size: 120px; text-align: center; animation: fadeIn 0.5s ease;';
        imageElement.parentElement.insertBefore(emojiDisplay, imageElement);
    }
    emojiDisplay.textContent = item.emoji;
    
    // If already answered, show previous answer state
    if (answered[index]) {
        showFeedback(answered[index].correct, answered[index].userAnswer);
    }
}

// Check answer
function checkAnswer() {
    const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
    const correctAnswer = vocabulary[currentIndex].word.toLowerCase();
    
    const isCorrect = userAnswer === correctAnswer;
    
    // Record answer
    if (!answered[currentIndex] || !answered[currentIndex].correct) {
        answered[currentIndex] = { correct: isCorrect, userAnswer };
        if (isCorrect) {
            score++;
            document.getElementById('score').textContent = score;
        }
    }
    
    showFeedback(isCorrect, userAnswer);
}

// Update blanks display
function updateBlanksDisplay() {
    const input = document.getElementById('answerInput').value;
    let display = '';
    
    for (let i = 0; i < currentWordLength; i++) {
        if (i < input.length) {
            display += input[i];
        } else {
            display += '_';
        }
    }
    
    document.getElementById('blanksDisplay').textContent = display;
}

// Show feedback
function showFeedback(isCorrect, userAnswer) {
    const feedbackElement = document.getElementById('feedback');
    const feedbackText = document.getElementById('feedbackText');
    
    if (isCorrect) {
        feedbackElement.className = 'feedback correct';
        feedbackText.innerHTML = `✓ ถูกต้อง! คำตอบคือ: <strong>${vocabulary[currentIndex].word}</strong>`;
    } else {
        feedbackElement.className = 'feedback incorrect';
        feedbackText.innerHTML = `✗ ไม่ถูกต้อง! คุณตอบ: <strong>${userAnswer}</strong><br>คำตอบที่ถูกต้องคือ: <strong>${vocabulary[currentIndex].word}</strong>`;
    }
}

// Event listeners
document.getElementById('answerInput').addEventListener('input', (e) => {
    // Only allow letters
    let value = e.target.value.toLowerCase();
    value = value.replace(/[^a-z]/g, '');
    
    // Limit to word length
    if (value.length > currentWordLength) {
        value = value.slice(0, currentWordLength);
    }
    
    e.target.value = value;
    updateBlanksDisplay();
    
    // Auto-check if complete
    if (value.length === currentWordLength) {
        setTimeout(checkAnswer, 300);
    }
});

document.getElementById('answerInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) {
        loadCard(currentIndex - 1);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex < vocabulary.length - 1) {
        loadCard(currentIndex + 1);
    }
});

document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('คุณต้องการเริ่มใหม่หรือไม่?')) {
        currentIndex = 0;
        score = 0;
        answered = {};
        document.getElementById('score').textContent = '0';
        loadCard(0);
    }
});

// Initialize
document.getElementById('total').textContent = vocabulary.length;
loadCard(0);
