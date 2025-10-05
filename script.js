// --- Global State & Setup ---
const state = {
    stars: 0,
    unlockedAwards: [],
    currentGame: null,
    difficulty: null,
};

const screens = {
    menu: document.getElementById('menu'),
    maze: document.getElementById('maze'),
    language: document.getElementById('language'),
    logic: document.getElementById('logic'),
    arithmetic: document.getElementById('arithmetic'),
};

const modals = {
    difficulty: document.getElementById('difficulty-modal'),
    awards: document.getElementById('awards-modal'),
};

const starCountEl = document.getElementById('star-count');

const AWARDS = [
    { id: 'bronze', stars: 10, name: 'Bronze Star', desc: 'Earned 10 stars!' },
    { id: 'silver', stars: 25, name: 'Silver Spark', desc: 'Earned 25 stars!' },
    { id: 'gold', stars: 50, name: 'Golden Brain', desc: 'Earned 50 stars!' },
    { id: 'platinum', stars: 100, name: 'Platinum Owl', desc: 'Mastered the Quest with 100 stars!' },
];

// --- Core App Logic ---
function loadData() {
    state.stars = parseInt(localStorage.getItem('learnquest-stars') || '0', 10);
    state.unlockedAwards = JSON.parse(localStorage.getItem('learnquest-unlocked-awards') || '[]');
    starCountEl.textContent = state.stars;
}

function saveData() {
    localStorage.setItem('learnquest-stars', state.stars);
    localStorage.setItem('learnquest-unlocked-awards', JSON.stringify(state.unlockedAwards));
}

function addStars(amount) {
    state.stars += amount;
    starCountEl.textContent = state.stars;
    checkAwards();
    saveData();
}

function checkAwards() {
    AWARDS.forEach(award => {
        if (state.stars >= award.stars && !state.unlockedAwards.includes(award.id)) {
            state.unlockedAwards.push(award.id);
            showNewAwardToast(award);
        }
    });
}

function showScreen(id) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    screens[id].classList.remove('hidden');
}

// --- Modal Logic ---
function showDifficultyModal(game) {
    state.currentGame = game;
    modals.difficulty.querySelector('#difficulty-title').textContent = `Select Difficulty for ${game.charAt(0).toUpperCase() + game.slice(1)}`;
    modals.difficulty.classList.remove('hidden');
}

function hideDifficultyModal() {
    modals.difficulty.classList.add('hidden');
}

function showAwardsModal() {
    const listEl = document.getElementById('awards-list');
    listEl.innerHTML = '';
    AWARDS.forEach(award => {
        const isUnlocked = state.unlockedAwards.includes(award.id);
        const awardItem = document.createElement('div');
        awardItem.className = `award-item ${isUnlocked ? '' : 'locked'}`;
        awardItem.innerHTML = `
            <div class="award-icon">${isUnlocked ? '🏆' : '🔒'}</div>
            <div class="award-details">
                <h5>${award.name}</h5>
                <p>${award.desc}</p>
            </div>
        `;
        listEl.appendChild(awardItem);
    });
    
    document.getElementById('new-award-toast').classList.add('hidden');
    modals.awards.classList.remove('hidden');
}

function showNewAwardToast(award) {
    showAwardsModal();
    const toast = document.getElementById('new-award-toast');
    toast.classList.remove('hidden');
    document.getElementById('new-award-name').textContent = award.name;
    document.getElementById('new-award-desc').textContent = award.desc;
}

// --- Game Initialization ---
function startGame(difficulty) {
    state.difficulty = difficulty;
    hideDifficultyModal();
    const game = state.currentGame;

    const gameContainer = screens[game];
    gameContainer.innerHTML = ''; // Clear previous game state

    // Generate game-specific UI
    if (game === 'maze') initMaze(gameContainer);
    if (game === 'language') initLanguage(gameContainer);
    if (game === 'logic') initLogic(gameContainer);
    if (game === 'arithmetic') initArithmetic(gameContainer);
    
    showScreen(game);
}

// --- Utilities ---
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }


// --- Game Implementations ---

// 1. Logic Labyrinth (Maze)
function initMaze(container) {
    const difficulties = {
        easy: { size: 7, reward: 1 },
        medium: { size: 11, reward: 2 },
        hard: { size: 15, reward: 3 },
    };
    const config = difficulties[state.difficulty];
    let program = [];

    container.innerHTML = `
        <div class="game-header"><h2>Logic Labyrinth (${state.difficulty})</h2><button class="small back-btn">Back to Menu</button></div>
        <div class="maze-area">
            <aside class="left-panel">
                <div class="toolbar">
                    <button class="block-btn" data-op="F">Forward</button>
                    <button class="block-btn" data-op="L">Left</button>
                    <button class="block-btn" data-op="R">Right</button>
                    <button class="block-btn loop" data-op="LOOP_START">Loop x3</button>
                    <button class="block-btn loop" data-op="LOOP_END">End Loop</button>
                </div>
                <div class="program-wrap">
                    <div class="program-header"><span>Program</span></div>
                    <div id="program-list" class="program-list"></div>
                    <div><button id="clear-blocks" class="small">Clear</button> <button id="undo-block" class="small">Undo</button></div>
                </div>
                <div class="run-row"><button id="run-program" class="cta">Run Program</button></div>
                <div id="maze-msg" class="message">Guide the player to the flag!</div>
            </aside>
            <div class="grid-wrap"><div id="grid" class="grid"></div></div>
        </div>
    `;

    const mazeGrid = generateMaze(config.size);
    renderMaze(mazeGrid, { x: 0, y: 0, dir: 1 });

    function updateProgramUI() {
        const list = container.querySelector('#program-list');
        list.innerHTML = '';
        program.forEach(p => {
            const block = document.createElement('div');
            block.className = `program-block ${p.includes('LOOP') ? 'loop' : ''}`;
            block.textContent = p.replace('LOOP_START', 'L(x3)').replace('LOOP_END', 'End L');
            list.appendChild(block);
        });

        // Add/remove scrollable class based on program length
        if (program.length > 5) {
            list.classList.add('scrollable');
        } else {
            list.classList.remove('scrollable');
        }
    }
    
    container.querySelectorAll('.block-btn').forEach(b => {
        b.onclick = () => { program.push(b.dataset.op); updateProgramUI(); };
    });
    container.querySelector('#clear-blocks').onclick = () => { program = []; updateProgramUI(); };
    container.querySelector('#undo-block').onclick = () => { program.pop(); updateProgramUI(); };
    container.querySelector('#run-program').onclick = () => runProgram(program, mazeGrid, config.reward);
}

function generateMaze(size) {
    const grid = Array(size).fill(null).map(() => Array(size).fill(1)); // 1 is wall
    
    const carve = (x, y) => {
        grid[y][x] = 0;
        const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];
        directions.sort(() => Math.random() - 0.5);

        for (let [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;
            if (ny >= 0 && ny < size && nx >= 0 && nx < size && grid[ny][nx] === 1) {
                grid[y + dy / 2][x + dx / 2] = 0; // Carve wall in between
                carve(nx, ny);
            }
        }
    };
    carve(0, 0);
    grid[size - 1][size - 1] = 0;
    // Ensure exit is accessible if it's walled off, which can happen in small mazes
    if (grid[size-2][size-1] === 1 && grid[size-1][size-2] === 1) {
         grid[size-2][size-1] = 0;
    }
    return grid;
}


function renderMaze(grid, player) {
    const gridEl = document.getElementById('grid');
    if (!gridEl) return;
    const size = grid.length;
    gridEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gridEl.innerHTML = '';
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = document.createElement('div');
            cell.className = `cell ${grid[y][x] ? 'wall' : 'empty'}`;
            if (player && player.x === x && player.y === y) {
                cell.classList.add('player');
                cell.textContent = ['↑', '→', '↓', '←'][player.dir];
            } else if (x === size - 1 && y === size - 1) {
                cell.classList.add('exit');
                cell.textContent = '🏁';
            }
            gridEl.appendChild(cell);
        }
    }
}

function runProgram(program, grid, reward) {
    // Recursive parser for nested loops
    function parseProgram(p) {
        const result = [];
        let i = 0;
        while (i < p.length) {
            const op = p[i];
            if (op === 'LOOP_START') {
                const loopBody = [];
                let depth = 1;
                i++;
                while (i < p.length && depth > 0) {
                    if (p[i] === 'LOOP_START') depth++;
                    if (p[i] === 'LOOP_END') depth--;
                    if (depth > 0) loopBody.push(p[i]);
                    i++;
                }
                const parsedBody = parseProgram(loopBody); // Recursively parse inner content
                for (let j = 0; j < 3; j++) {
                    result.push(...parsedBody);
                }
            } else if (op !== 'LOOP_END') {
                result.push(op);
                i++;
            } else {
                i++; // Skip dangling LOOP_END
            }
        }
        return result;
    }

    const executionQueue = parseProgram(program);
    let player = { x: 0, y: 0, dir: 1 };
    let step = 0;
    
    const interval = setInterval(() => {
        if (step >= executionQueue.length) {
            clearInterval(interval);
            const size = grid.length;
            if (player.x === size - 1 && player.y === size - 1) {
                document.getElementById('maze-msg').textContent = `Success! +${reward}⭐`;
                addStars(reward);
            } else {
                document.getElementById('maze-msg').textContent = `Didn't reach the exit. Try again!`;
            }
            return;
        }

        const op = executionQueue[step++];
        const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // Up, Right, Down, Left
        
        if (op === 'L') player.dir = (player.dir + 3) % 4;
        if (op === 'R') player.dir = (player.dir + 1) % 4;
        if (op === 'F') {
            const [dx, dy] = DIRS[player.dir];
            const nx = player.x + dx, ny = player.y + dy;
            if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid.length && grid[ny][nx] === 0) {
                player.x = nx; player.y = ny;
            } else {
                 document.getElementById('maze-msg').textContent = `Crashed into a wall!`;
                 clearInterval(interval);
            }
        }
        renderMaze(grid, player);
    }, 150);
}


// 2. Language Match
function initLanguage(container) {
    const difficulties = {
        easy: { pairs: 4, time: null, reward: 1 },
        medium: { pairs: 6, time: 45, reward: 2 },
        hard: { pairs: 8, time: 45, reward: 3 },
    };
    const config = difficulties[state.difficulty];
    let timerInterval = null;
    let timeLeft = config.time;
    const wordEmojiPool = [
        ['apple', '🍎'], ['fire', '🔥'], ['cat', '🐱'], ['dog', '🐶'], ['sun', '☀️'],
        ['book', '📚'], ['heart', '❤️'], ['car', '🚗'], ['tree', '🌳'], ['star', '⭐'],
        ['moon', '🌙'], ['water', '💧'], ['house', '🏠'], ['key', '🔑'], ['clock', '⏰']
    ];

    container.innerHTML = `
        <div class="game-header">
            <h2>Language Match (${state.difficulty})</h2>
            ${config.time ? `<div class="timer-display">Time Left: <span id="lang-timer">${timeLeft}</span>s</div>` : ''}
            <button class="small back-btn">Back to Menu</button>
        </div>
        <div id="lang-board" class="lang-board"></div>
        <div class="controls-row">
            <button id="regen-lang" class="small">New Round</button>
            <div id="lang-msg" class="message"></div>
        </div>
    `;
    
    const board = container.querySelector('#lang-board');
    const msgEl = container.querySelector('#lang-msg');

    function setupGame() {
        clearInterval(timerInterval);
        timeLeft = config.time;
        if(config.time) container.querySelector('#lang-timer').textContent = timeLeft;
        msgEl.textContent = 'Match the words to the emojis!';
        
        const pairs = shuffle([...wordEmojiPool]).slice(0, config.pairs);
        const items = shuffle([...pairs.map(p => ({ type: 'word', id: p[0], label: p[0] })), ...pairs.map(p => ({ type: 'emoji', id: p[0], label: p[1] }))]);
        
        board.innerHTML = '';
        board.style.gridTemplateColumns = `repeat(${config.pairs > 5 ? Math.ceil(config.pairs / 2) : config.pairs}, 1fr)`;
        let selected = null;

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'lang-card';
            card.textContent = item.label;
            card.dataset.id = item.id;
            card.dataset.type = item.type;
            card.onclick = () => {
                if (card.classList.contains('matched') || selected === card || (config.time && timeLeft <= 0)) return;
                
                if (!selected) {
                    selected = card;
                    card.classList.add('selected');
                    return;
                }

                if (selected.dataset.type !== card.dataset.type && selected.dataset.id === card.dataset.id) {
                    selected.classList.add('matched');
                    card.classList.add('matched');
                    if (board.querySelectorAll('.matched').length === pairs.length * 2) {
                        msgEl.textContent = `Great! All matched. +${config.reward}⭐`;
                        addStars(config.reward);
                        clearInterval(timerInterval);
                    }
                }
                selected.classList.remove('selected');
                selected = null;
            };
            board.appendChild(card);
        });

        if (config.time) {
            timerInterval = setInterval(() => {
                timeLeft--;
                container.querySelector('#lang-timer').textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    msgEl.textContent = "Time's up! Try again.";
                    board.querySelectorAll('.lang-card:not(.matched)').forEach(c => { c.style.opacity = 0.5; c.onclick = null; });
                }
            }, 1000);
        }
    }
    
    container.querySelector('#regen-lang').onclick = setupGame;
    setupGame();
}

// 3. Logic Sequence
function initLogic(container) {
    const difficulties = {
        easy: { types: ['arith'], reward: 1 },
        medium: { types: ['arith', 'geom', 'alternate'], reward: 2 },
        hard: { types: ['fiblike', 'squares', 'two-step'], reward: 3 },
    };
    const config = difficulties[state.difficulty];
    
    container.innerHTML = `
        <div class="game-header"><h2>Logic Sequence (${state.difficulty})</h2><button class="small back-btn">Back to Menu</button></div>
        <div id="seq-display" class="sequence"></div>
        <p class="hint">What number comes next in the sequence?</p>
        <div id="seq-options" class="options"></div>
        <div class="controls-row">
            <button id="regen-logic" class="small">New Sequence</button>
            <div id="logic-msg" class="message"></div>
        </div>
    `;

    function generateSequence() {
        const type = config.types[Math.floor(Math.random() * config.types.length)];
        let seq = [], correct = 0, explanation = '';

        if (type === 'arith') {
            const start = randInt(1, 10), d = randInt(2, 6);
            for (let i = 0; i < 4; i++) seq.push(start + i * d);
            correct = start + 4 * d;
            explanation = `This is an arithmetic sequence. We add ${d} each time.`;
        } else if (type === 'geom') {
            const start = randInt(2, 4), r = randInt(2, 3);
            for (let i = 0; i < 4; i++) seq.push(start * Math.pow(r, i));
            correct = start * Math.pow(r, 4);
            explanation = `This is a geometric sequence. We multiply by ${r} each time.`;
        } else if (type === 'alternate') {
            const a = randInt(1, 5), b = randInt(10, 15), d1 = randInt(1,2), d2 = randInt(1,2);
            seq = [a, b, a + d1, b + d2];
            correct = a + d1 + d1;
            explanation = `Two sequences are alternating. The first one is ${a}, ${a+d1}, ...`;
        } else if (type === 'fiblike') {
            const a = randInt(1, 5), b = randInt(2, 7);
            seq = [a, b, a + b, b + (a + b)];
            correct = seq[2] + seq[3];
            explanation = `Each number is the sum of the two before it.`;
        } else if (type === 'squares') {
            const start = randInt(1, 5);
            seq = [start * start, (start + 1) * (start + 1), (start + 2) * (start + 2)];
            correct = (start + 3) * (start + 3);
            explanation = `The sequence shows square numbers: ${start}², ${(start+1)}², ...`;
        } else if (type === 'two-step') {
            let start = randInt(1,5);
            const a = randInt(2,4), b = randInt(1,3);
            seq.push(start);
            for(let i=0; i < 3; i++) {
                start = start * a + b;
                seq.push(start);
            }
            correct = start * a + b;
            explanation = `The rule is 'multiply by ${a} and add ${b}'.`;
        }
        
        container.querySelector('#seq-display').textContent = seq.join(', ') + ', ?';
        const options = shuffle([correct, correct + randInt(1, 4), correct - randInt(1, 3), correct + randInt(5, 8)]);
        const optsEl = container.querySelector('#seq-options');
        optsEl.innerHTML = '';
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.textContent = opt;
            btn.onclick = () => {
                optsEl.querySelectorAll('.option').forEach(el => el.disabled = true);
                if (opt === correct) {
                    btn.style.borderColor = 'var(--accent-2)';
                    container.querySelector('#logic-msg').innerHTML = `Correct! +${config.reward}⭐ <br><small>${explanation}</small>`;
                    addStars(config.reward);
                } else {
                    btn.style.borderColor = 'var(--danger)';
                    container.querySelector('#logic-msg').innerHTML = `Not quite. The answer was ${correct}. <br><small>${explanation}</small>`;
                }
            };
            optsEl.appendChild(btn);
        });
    }
    
    container.querySelector('#regen-logic').onclick = generateSequence;
    generateSequence();
}


// 4. Arithmetic Sprint
function initArithmetic(container) {
    const difficulties = {
        easy: { ops: ['+', '-'], range: [1, 25], useNegatives: false, reward: 1 },
        medium: { ops: ['+', '-', '*', '/'], range: [1, 50], useNegatives: false, reward: 2 },
        hard: { ops: ['+', '-', '*', '/'], range: [-25, 25], useNegatives: true, reward: 3 },
    };
    const config = difficulties[state.difficulty];
    let timer = null, score = 0, timeLeft = 30, currentAns = null;

    container.innerHTML = `
        <div class="game-header"><h2>Arithmetic Sprint (${state.difficulty})</h2><button class="small back-btn">Back to Menu</button></div>
        <div class="arith-top">Time: <span id="timer">30</span>s — Score: <span id="arith-score">0</span></div>
        <div id="arith-problem" class="problem">Press Start to Begin!</div>
        <div class="answer-row"><input id="arith-answer" type="number" placeholder="Your answer..." disabled/></div>
        <div class="controls-row"><button id="start-arith" class="cta">Start</button></div>
        <div id="arith-msg" class="message"></div>
    `;

    const timerEl = container.querySelector('#timer');
    const scoreEl = container.querySelector('#arith-score');
    const problemEl = container.querySelector('#arith-problem');
    const answerEl = container.querySelector('#arith-answer');
    const startBtn = container.querySelector('#start-arith');
    const msgEl = container.querySelector('#arith-msg');

    function nextProblem() {
        const [min, max] = config.range;
        let a = randInt(min, max);
        let b = randInt(min, max);
        const op = config.ops[randInt(0, config.ops.length - 1)];
        
        let problem = '', ans = 0;
        switch(op) {
            case '+': ans = a + b; problem = `${a} + ${b}`; break;
            case '-': ans = a - b; problem = `${a} - ${b}`; break;
            case '*': ans = a * b; problem = `${a} × ${b}`; break;
            case '/': 
                // Ensure non-zero divisor and integer result
                let divisorOptions = [];
                for(let i = 2; i <= 10; i++) divisorOptions.push(i);
                if(config.useNegatives) {
                    for(let i = -10; i <= -2; i++) divisorOptions.push(i);
                }
                
                let divisor = divisorOptions[randInt(0, divisorOptions.length - 1)];
                ans = randInt(Math.floor(min/5), Math.floor(max/5));
                if(ans === 0) ans = 1;

                problem = `${ans * divisor} ÷ ${divisor}`;
                break;
        }
        problemEl.textContent = problem + ' = ?';
        currentAns = ans;
        answerEl.value = '';
        answerEl.focus();
    }

    function submitAnswer() {
        if (timeLeft <= 0) return;
        if (parseInt(answerEl.value, 10) === currentAns) {
            score++;
            scoreEl.textContent = score;
        }
        nextProblem();
    }

    function startGame() {
        score = 0; timeLeft = 30; currentAns = null;
        scoreEl.textContent = score;
        timerEl.textContent = timeLeft;
        msgEl.textContent = '';
        startBtn.style.display = 'none';
        answerEl.disabled = false;
        
        nextProblem();
        
        timer = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                answerEl.disabled = true;
                problemEl.textContent = `Time's Up!`;
                
                let earnedStars = 0;
                if (score > 15 && config.reward === 3) earnedStars = 3;
                else if (score > 10 && config.reward >= 2) earnedStars = 2;
                else if (score > 5) earnedStars = 1;

                if (earnedStars > 0) {
                    msgEl.textContent = `Final Score: ${score}. You earned +${earnedStars}⭐`;
                    addStars(earnedStars);
                } else {
                    msgEl.textContent = `Final Score: ${score}. Try again to earn stars!`;
                }

                startBtn.style.display = 'block';
                startBtn.textContent = 'Play Again';
            }
        }, 1000);
    }
    
    startBtn.onclick = startGame;
    answerEl.onkeydown = (e) => { if(e.key === 'Enter') submitAnswer(); };
}


// --- Event Listeners ---
function setupEventListeners() {
    document.querySelectorAll('.menu-btn').forEach(b => {
        b.addEventListener('click', () => showDifficultyModal(b.dataset.game));
    });
    document.querySelectorAll('.difficulty-btn').forEach(b => {
        b.addEventListener('click', () => startGame(b.dataset.difficulty));
    });
    document.getElementById('close-difficulty-modal').addEventListener('click', hideDifficultyModal);
    document.getElementById('close-awards-modal').addEventListener('click', () => modals.awards.classList.add('hidden'));
    document.getElementById('awards-btn-header').addEventListener('click', () => showAwardsModal());
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('back-btn')) {
            // Stop any running game timers
            // This is a simplification; a more robust solution would manage timers in the state object
            for (let i = 1; i < 99999; i++) window.clearInterval(i);
            showScreen('menu');
        }
    });
}

// --- App Start ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    showScreen('menu');
});

