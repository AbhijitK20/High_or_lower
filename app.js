// Celebrity data with actual images where available
const celebrities = [
  {
    name: "Cristiano Ronaldo",
    description: "Portuguese footballer",
    follower_count: 661,
    country: "Portugal",
    image_url: null,
    image_color: "#1e40af"
  },
  {
    name: "Lionel Messi",
    description: "Argentine footballer", 
    follower_count: 506,
    country: "Argentina",
    image_url: null,
    image_color: "#7c3aed"
  },
  {
    name: "Selena Gomez",
    description: "American singer and actress",
    follower_count: 418,
    country: "United States",
    image_url: "https://pplx-res.cloudinary.com/image/upload/v1753969249/pplx_project_search_images/b91dcfff60c490eb1f7d778b1ab2d5e2e0703f41.jpg",
    image_color: "#ec4899"
  },
  {
    name: "Kylie Jenner",
    description: "American media personality",
    follower_count: 398,
    country: "United States", 
    image_url: "https://pplx-res.cloudinary.com/image/upload/v1753674200/pplx_project_search_images/2e62e1743a7cb9664b76b06f7ae92c1a55c45e03.jpg",
    image_color: "#f59e0b"
  },
  {
    name: "Dwayne Johnson",
    description: "American actor and wrestler",
    follower_count: 394,
    country: "United States",
    image_url: "https://pplx-res.cloudinary.com/image/upload/v1753969249/pplx_project_search_images/54cb5370e0992b29ffe74cfcf0b2bb630e32633e.jpg",
    image_color: "#059669"
  },
  {
    name: "Ariana Grande",
    description: "American singer and actress",
    follower_count: 378,
    country: "United States",
    image_url: null,
    image_color: "#8b5cf6"
  },
  {
    name: "Kim Kardashian",
    description: "American media personality",
    follower_count: 364,
    country: "United States",
    image_url: null,
    image_color: "#ef4444"
  },
  {
    name: "Beyoncé",
    description: "American singer and actress",
    follower_count: 314,
    country: "United States",
    image_url: null,
    image_color: "#f97316"
  },
  {
    name: "Khloe Kardashian",
    description: "American media personality",
    follower_count: 311,
    country: "United States",
    image_url: null,
    image_color: "#06b6d4"
  },
  {
    name: "Justin Bieber",
    description: "Canadian singer",
    follower_count: 294,
    country: "Canada",
    image_url: null,
    image_color: "#8b5cf6"
  },
  {
    name: "Kendall Jenner",
    description: "American model",
    follower_count: 293,
    country: "United States",
    image_url: null,
    image_color: "#10b981"
  },
  {
    name: "Taylor Swift",
    description: "American singer",
    follower_count: 283,
    country: "United States",
    image_url: null,
    image_color: "#f59e0b"
  },
  {
    name: "Virat Kohli",
    description: "Indian cricketer",
    follower_count: 271,
    country: "India",
    image_url: null,
    image_color: "#3b82f6"
  },
  {
    name: "Jennifer Lopez",
    description: "American singer and actress",
    follower_count: 250,
    country: "United States",
    image_url: null,
    image_color: "#ec4899"
  },
  {
    name: "Nicki Minaj",
    description: "Trinidad and Tobago rapper",
    follower_count: 228,
    country: "Trinidad and Tobago",
    image_url: null,
    image_color: "#ec4899"
  }
];

// Meme images for game over
const memeImages = [
  "https://via.placeholder.com/200x150/ff6b6b/ffffff?text=You+Lost!",
  "https://via.placeholder.com/200x150/4ecdc4/ffffff?text=Game+Over!",
  "https://via.placeholder.com/200x150/45b7d1/ffffff?text=Try+Again!"
];

// Game state class
class GameState {
  constructor() {
    this.currentScore = 0;
    this.highScore = this.getHighScore();
    this.currentCelebrity = null;
    this.nextCelebrity = null;
    this.usedCelebrities = [];
    this.gameActive = false;
    this.isAnswering = false;
  }

  getHighScore() {
    try {
      return parseInt(localStorage.getItem('higherLowerHighScore') || '0');
    } catch (e) {
      return 0;
    }
  }

  setHighScore(score) {
    try {
      localStorage.setItem('higherLowerHighScore', score.toString());
      this.highScore = score;
    } catch (e) {
      this.highScore = score;
    }
  }

  getRandomCelebrity(exclude = []) {
    const available = celebrities.filter(c => 
      !exclude.includes(c.name) && 
      !this.usedCelebrities.includes(c.name)
    );
    
    if (available.length === 0) {
      this.usedCelebrities = exclude;
      return this.getRandomCelebrity(exclude);
    }
    
    return available[Math.floor(Math.random() * available.length)];
  }

  startNewGame() {
    this.currentScore = 0;
    this.usedCelebrities = [];
    this.gameActive = true;
    this.isAnswering = false;
    
    this.currentCelebrity = this.getRandomCelebrity();
    this.nextCelebrity = this.getRandomCelebrity([this.currentCelebrity.name]);
    this.usedCelebrities.push(this.currentCelebrity.name);
  }

  makeGuess(isHigher) {
    if (!this.gameActive || this.isAnswering) return false;
    
    this.isAnswering = true;
    const correct = isHigher ? 
      this.nextCelebrity.follower_count >= this.currentCelebrity.follower_count :
      this.nextCelebrity.follower_count <= this.currentCelebrity.follower_count;
    
    if (correct) {
      this.currentScore++;
      if (this.currentScore > this.highScore) {
        this.setHighScore(this.currentScore);
      }
      
      this.currentCelebrity = this.nextCelebrity;
      this.nextCelebrity = this.getRandomCelebrity([this.currentCelebrity.name]);
      this.usedCelebrities.push(this.currentCelebrity.name);
      
      return true;
    } else {
      this.gameActive = false;
      return false;
    }
  }

  reset() {
    this.currentScore = 0;
    this.currentCelebrity = null;
    this.nextCelebrity = null;
    this.usedCelebrities = [];
    this.gameActive = false;
    this.isAnswering = false;
  }
}

// Global variables
let gameState = null;
let elements = {};

// Utility functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  const targetScreen = document.getElementById(screenName);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}

function updateHighScoreDisplay() {
  if (elements.highScoreDisplay) {
    elements.highScoreDisplay.textContent = gameState.highScore;
  }
  if (elements.gameHighScore) {
    elements.gameHighScore.textContent = gameState.highScore;
  }
}

function updateScoreDisplay() {
  if (elements.currentScore) {
    elements.currentScore.textContent = gameState.currentScore;
    elements.currentScore.classList.add('score-update');
    setTimeout(() => {
      elements.currentScore.classList.remove('score-update');
    }, 500);
  }
  if (elements.gameHighScore) {
    elements.gameHighScore.textContent = gameState.highScore;
  }
}

function updateCelebrityCard(side, celebrity, showFollowers) {
  const prefix = side === 'left' ? 'left' : 'right';
  const nameEl = elements[`${prefix}Name`];
  const descEl = elements[`${prefix}Description`];
  const countryEl = elements[`${prefix}Country`];
  const cardEl = elements[`${prefix}Card`];
  
  if (nameEl) nameEl.textContent = celebrity.name;
  if (descEl) descEl.textContent = celebrity.description;
  if (countryEl) countryEl.textContent = celebrity.country;
  
  // Set background
  if (cardEl) {
    const cardBackground = cardEl.querySelector('.card-background');
    if (cardBackground) {
      if (celebrity.image_url) {
        cardBackground.style.backgroundImage = `
          linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), 
          url('${celebrity.image_url}')
        `;
      } else {
        cardBackground.style.backgroundImage = `linear-gradient(135deg, ${celebrity.image_color}, ${celebrity.image_color}CC)`;
      }
      cardBackground.style.backgroundSize = 'cover';
      cardBackground.style.backgroundPosition = 'center';
      cardBackground.style.backgroundRepeat = 'no-repeat';
    }
  }
  
  // Update followers display
  const followersEl = cardEl ? cardEl.querySelector('.follower-count') : null;
  if (followersEl) {
    const countNumber = followersEl.querySelector('.count-number');
    if (showFollowers) {
      if (countNumber) countNumber.textContent = `${celebrity.follower_count}M`;
      followersEl.classList.remove('question-mark');
    } else {
      if (countNumber) countNumber.textContent = '?';
      followersEl.classList.add('question-mark');
    }
  }
  
  // Add reveal animation
  if (cardEl) {
    cardEl.classList.add('card-reveal');
    setTimeout(() => {
      cardEl.classList.remove('card-reveal');
    }, 600);
  }
}

function updateGameDisplay() {
  updateCelebrityCard('left', gameState.currentCelebrity, true);
  updateCelebrityCard('right', gameState.nextCelebrity, false);
  
  if (elements.rightCard) {
    elements.rightCard.classList.add('clickable');
  }
  gameState.isAnswering = false;
}

function startGame() {
  gameState.startNewGame();
  showScreen('gamescreen');
  
  setTimeout(() => {
    updateGameDisplay();
    updateScoreDisplay();
  }, 300);
}

async function makeGuess(isHigher) {
  if (!gameState.gameActive || gameState.isAnswering) return;
  
  if (elements.rightCard) {
    elements.rightCard.classList.remove('clickable');
  }
  
  // Reveal the answer
  const rightFollowersEl = elements.rightCard ? elements.rightCard.querySelector('.follower-count') : null;
  if (rightFollowersEl) {
    const countNumber = rightFollowersEl.querySelector('.count-number');
    if (countNumber) countNumber.textContent = `${gameState.nextCelebrity.follower_count}M`;
    rightFollowersEl.classList.remove('question-mark');
  }
  
  await sleep(1000);
  
  const correct = gameState.makeGuess(isHigher);
  
  if (correct) {
    updateScoreDisplay();
    await sleep(500);
    updateGameDisplay();
  } else {
    await sleep(1000);
    showGameOverModal();
  }
}

function showGameOverModal() {
  const randomMeme = memeImages[Math.floor(Math.random() * memeImages.length)];
  if (elements.memeImage) elements.memeImage.src = randomMeme;
  
  if (elements.finalScore) elements.finalScore.textContent = gameState.currentScore;
  
  if (elements.highScoreMessage) {
    if (gameState.currentScore === gameState.highScore && gameState.currentScore > 0) {
      elements.highScoreMessage.textContent = "🎉 New High Score! Amazing!";
      elements.highScoreMessage.style.color = "var(--color-success)";
    } else {
      elements.highScoreMessage.textContent = `High Score: ${gameState.highScore}`;
      elements.highScoreMessage.style.color = "var(--color-text-secondary)";
    }
  }
  
  if (elements.answerName1) elements.answerName1.textContent = gameState.currentCelebrity.name;
  if (elements.answerFollowers1) elements.answerFollowers1.textContent = `${gameState.currentCelebrity.follower_count}M`;
  if (elements.answerName2) elements.answerName2.textContent = gameState.nextCelebrity.name;
  if (elements.answerFollowers2) elements.answerFollowers2.textContent = `${gameState.nextCelebrity.follower_count}M`;
  
  if (elements.gameOverModal) elements.gameOverModal.classList.remove('hidden');
}

function hideGameOverModal() {
  if (elements.gameOverModal) elements.gameOverModal.classList.add('hidden');
}

function goToHomepage() {
  hideGameOverModal();
  gameState.reset();
  showScreen('homepage');
  updateHighScoreDisplay();
}

function handleKeyPress(e) {
  if (!gameState.gameActive) return;
  
  switch(e.key.toLowerCase()) {
    case 'h':
    case 'arrowup':
      makeGuess(true);
      break;
    case 'l':
    case 'arrowdown':
      makeGuess(false);
      break;
  }
}

function bindEvents() {
  if (elements.startBtn) {
    elements.startBtn.addEventListener('click', startGame);
  }
  
  if (elements.guessBtns) {
    elements.guessBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHigher = btn.dataset.guess === 'higher';
        makeGuess(isHigher);
      });
    });
  }
  
  if (elements.playAgainBtn) {
    elements.playAgainBtn.addEventListener('click', startGame);
  }
  
  if (elements.backToHomeBtn) {
    elements.backToHomeBtn.addEventListener('click', goToHomepage);
  }
  
  if (elements.gameOverModal) {
    const modalBackdrop = elements.gameOverModal.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', hideGameOverModal);
    }
  }
  
  document.addEventListener('keydown', handleKeyPress);
}

function addParticleEffects() {
  const particles = document.querySelector('.particles');
  if (particles) {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(50, 184, 198, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 3 + 4}s ease-in-out infinite ${Math.random() * 2}s;
      `;
      particles.appendChild(particle);
    }
  }
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%, 100% { 
        transform: translateY(0px) translateX(0px); 
        opacity: 0.3;
      }
      25% { 
        transform: translateY(-20px) translateX(10px); 
        opacity: 0.7;
      }
      50% { 
        transform: translateY(-10px) translateX(-10px); 
        opacity: 1;
      }
      75% { 
        transform: translateY(-30px) translateX(5px); 
        opacity: 0.5;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  gameState = new GameState();
  
  // Get all elements
  elements = {
    homepage: document.getElementById('homepage'),
    gamescreen: document.getElementById('gamescreen'),
    gameOverModal: document.getElementById('gameOverModal'),
    startBtn: document.getElementById('startGame'),
    highScoreDisplay: document.getElementById('highScoreDisplay'),
    currentScore: document.getElementById('currentScore'),
    gameHighScore: document.getElementById('gameHighScore'),
    leftCard: document.getElementById('leftCard'),
    rightCard: document.getElementById('rightCard'),
    leftName: document.getElementById('leftName'),
    leftDescription: document.getElementById('leftDescription'),
    leftCountry: document.getElementById('leftCountry'),
    leftFollowers: document.getElementById('leftFollowers'),
    rightName: document.getElementById('rightName'),
    rightDescription: document.getElementById('rightDescription'),
    rightCountry: document.getElementById('rightCountry'),
    memeImage: document.getElementById('memeImage'),
    finalScore: document.getElementById('finalScore'),
    highScoreMessage: document.getElementById('highScoreMessage'),
    wrongAnswerInfo: document.getElementById('wrongAnswerInfo'),
    answerName1: document.getElementById('answerName1'),
    answerFollowers1: document.getElementById('answerFollowers1'),
    answerName2: document.getElementById('answerName2'),
    answerFollowers2: document.getElementById('answerFollowers2'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    backToHomeBtn: document.getElementById('backToHomeBtn'),
    guessBtns: document.querySelectorAll('.guess-btn')
  };

  updateHighScoreDisplay();
  bindEvents();
  addParticleEffects();
});