'use client';

export default async function game() {
    const bootstrap = await import('bootstrap');
    const gridContainer = document.querySelector(".d-grid");
    const timerDisplay = document.getElementById("timerDisplay");
    const lvlDificulty = document.getElementById("lvlDifficulty");
    const gridSize = 6;

    let startTime = null;
    let timerInterval = null;
    let path = [];
    let started = false;
    let targetNumber = 1;
    let fixedNumbers = {};

    // Bloqueia rolagem apenas quando o toque começa dentro do grid
    const grid = document.querySelector('.d-grid');

    // Para touch (mobile)
    grid.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });

    // Para mouse/trackpad (desktop)
    grid.addEventListener('wheel', function (e) {
        e.preventDefault();
    }, { passive: false });

    function initializeGame() {
        clearInterval(timerInterval);
        timerDisplay.textContent = "00:00";
        startTime = null;
        path = [];
        started = false;
        targetNumber = 1;
        fixedNumbers = {};
        generateGrid(gridSize);
    }

    const clearGameModal = document.getElementById("clear-btn-modal");
    if (clearGameModal) {
        clearGameModal.addEventListener("click", () => {
            const modal = new bootstrap.Modal(document.getElementById("clear-game-modal"));
            modal.show();
        });
    }

    const clearButton = document.getElementById("clear-btn");
    if (clearButton) {
        clearButton.addEventListener("click", () => {
            path.forEach(cell => {
                const cellElement = document.querySelector(`[data-pos="${cell.row},${cell.col}"]`);
                const container = cellElement.querySelector('.path-container');
                if (container) container.remove();
                cellElement.classList.remove("path-background", "text-white");
            });
            path = [];
            targetNumber = 1;
            started = false;

            const modalEl = document.getElementById("clear-game-modal");
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }

    const reloadButton = document.getElementById("reload-btn");
    if (reloadButton) {
        reloadButton.addEventListener("click", initializeGame);
    }

    const playagain = document.getElementById("play-again-btn");
    if (playagain) {
        playagain.addEventListener("click", () => {
            initializeGame();
            const modal = bootstrap.Modal.getInstance(document.getElementById("game-over-modal"));
            modal.hide();
        });
    }

    const undoButton = document.getElementById("undo-btn");
    if (undoButton) {
        undoButton.addEventListener("click", undoLastMove);
    }

    // função para desfazer o último movimento
    function undoLastMove() {
        if (path.length <= 1) return;

        const last = path.pop(); // célula que será removida
        const prev = path[path.length - 1]; // célula anterior, permanece no caminho

        const lastKey = `${last.row},${last.col}`;
        const lastCell = document.querySelector(`[data-pos="${lastKey}"]`);
        const lastContainer = lastCell.querySelector('.path-container');
        if (lastContainer) lastContainer.remove();
        lastCell.classList.remove("path-background", "text-white");

        // Se era número fixo, voltar número
        if (fixedNumbers[lastKey]) targetNumber--;

        // Atualiza a célula anterior, removendo a última linha e a curva se necessário
        const prevKey = `${prev.row},${prev.col}`;
        const prevCell = document.querySelector(`[data-pos="${prevKey}"]`);
        const prevContainer = ensurePathContainer(prevCell);

        // Remove a linha correspondente à direção do último passo
        const dx = last.col - prev.col;
        const dy = last.row - prev.row;

        let targetLine = null;

        const lines = prevContainer.querySelectorAll('.path-line');
        lines.forEach(line => {
            const isHorizontal = line.classList.contains('horizontal');
            const isVertical = line.classList.contains('vertical');
            const style = line.style;

            if (dx === 1 && isHorizontal && style.left === '50%') targetLine = line; // direita
            else if (dx === -1 && isHorizontal && style.left === '0px') targetLine = line; // esquerda
            else if (dy === 1 && isVertical && style.top === '50%') targetLine = line; // baixo
            else if (dy === -1 && isVertical && style.top === '0px') targetLine = line; // cima
        });

        if (targetLine) targetLine.remove();

        // Remove a curva se existir
        const corner = prevContainer.querySelector('.corner');
        if (corner) corner.remove();

        // Rechecar se precisa recolocar a curva
        checkAndAddCorner(prevCell); // vai reavaliar se ainda há cruzamento e colocar a curva se necessário
    }

    function generateGrid(size) {
        gridContainer.innerHTML = "";
        fixedNumbers = {};

        // const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => null));

        const directions = [
            { row: -1, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 0, col: -1 }
        ];

        function isInsideGrid(row, col) {
            return row >= 0 && row < size && col >= 0 && col < size;
        }

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function findPath(startRow, startCol) {
            const visited = new Set();
            const path = [];

            function dfs(row, col) {
                const key = `${row},${col}`;
                if (visited.has(key)) return false;

                visited.add(key);
                path.push({ row, col });

                if (path.length === size * size) return true;

                const shuffledDirs = shuffle([...directions]);
                for (const dir of shuffledDirs) {
                    const newRow = row + dir.row;
                    const newCol = col + dir.col;
                    if (isInsideGrid(newRow, newCol)) {
                        if (!visited.has(`${newRow},${newCol}`)) {
                            if (dfs(newRow, newCol)) return true;
                        }
                    }
                }

                visited.delete(key);
                path.pop();
                return false;
            }

            if (dfs(startRow, startCol)) return path;
            return null;
        }

        // Tenta encontrar um caminho válido
        let path;
        for (let attempts = 0; attempts < 10 && !path; attempts++) {
            const startRow = Math.floor(Math.random() * size);
            const startCol = Math.floor(Math.random() * size);
            path = findPath(startRow, startCol);
        }

        if (!path) {
            alert("Falha ao gerar grade válida");
            return;
        }

        // Define 6 posições fixas ao longo do caminho valido com valores 1 a 6
        const steps = new Set([0, Math.floor(path.length / 5), Math.floor(path.length * 2 / 5), Math.floor(path.length * 3 / 5), Math.floor(path.length * 4 / 5), path.length - 1]);
        let value = 1;
        for (const idx of [...steps].sort((a, b) => a - b)) {
            const { row, col } = path[idx];
            fixedNumbers[`${row},${col}`] = value++;
        }

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = document.createElement("div");
                cell.classList.add("border", "position-relative", "cell");
                cell.style.paddingTop = "100%";
                cell.dataset.pos = `${row},${col}`;

                const key = `${row},${col}`;
                if (fixedNumbers[key]) {
                    const numberSpan = document.createElement("span");
                    numberSpan.classList.add(
                        "z-1", "position-absolute", "top-50", "start-50", "translate-middle",
                        "bg-body-secondary", "text-white", "rounded-circle", "d-flex", "justify-content-center", "align-items-center"
                    );
                    numberSpan.style.width = "30px";
                    numberSpan.style.height = "30px";
                    numberSpan.textContent = fixedNumbers[key];
                    cell.appendChild(numberSpan);
                }

                
                gridContainer.appendChild(cell);
            }
        }

        estimateDifficulty(path);
    }

    let pointerDown = false;

    gridContainer.addEventListener("pointerdown", e => {
        const cell = e.target.closest(".cell");
        if (!cell) return;
        pointerDown = true;
        handleCellClick({ currentTarget: cell });
        gridContainer.setPointerCapture(e.pointerId);
    });

    gridContainer.addEventListener("pointermove", e => {
        if (!pointerDown) return;
        const cell = document.elementFromPoint(e.clientX, e.clientY)?.closest(".cell");
        if (cell) {
            handleCellClick({ currentTarget: cell });
        }
    });

    gridContainer.addEventListener("pointerup", e => {
        pointerDown = false;
        gridContainer.releasePointerCapture(e.pointerId);
    });

    gridContainer.addEventListener("pointercancel", e => {
        pointerDown = false;
        gridContainer.releasePointerCapture(e.pointerId);
    });

    function startTimer() {
        if (startTime !== null) return; // Já está rodando, não faz nada
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
            const seconds = String(elapsedTime % 60).padStart(2, "0");
            timerDisplay.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    function handleCellClick(event) {
        const cell = event.currentTarget;
        const pos = cell.dataset.pos;
        const [row, col] = pos.split(",").map(Number);
        const key = `${row},${col}`;
        const isFixed = fixedNumbers[key];
        const last = path[path.length - 1];
        const secondLast = path[path.length - 2];

        if (targetNumber > 6) return;

        if (!started) {
            if (isFixed === 1) {
                started = true;
                targetNumber = 2;
                path.push({ row, col });
                cell.classList.add("path-background", "text-white");
                startTimer();
            }
            return;
        }

        const isAdjacent = last && (Math.abs(last.row - row) + Math.abs(last.col - col) === 1);

        if (!isAdjacent) return;

        if (secondLast && secondLast.row === row && secondLast.col === col) {
            undoLastMove();
            return;
        }

        if (path.some(p => p.row === row && p.col === col)) return;

        if (isFixed) {
            if (isFixed === targetNumber) {
                drawPathBetween(last, { row, col });
                cell.classList.add("path-background", "text-white");
                path.push({ row, col });
                targetNumber++;
                if (!Object.values(fixedNumbers).includes(targetNumber)) {
                    checkWinCondition();
                }
            }
            return;
        }

        drawPathBetween(last, { row, col });
        path.push({ row, col });
        cell.classList.add("path-background", "text-white");
    }

    function checkWinCondition() {
        const totalCells = gridSize * gridSize;
        if (path.length === totalCells) {
            clearInterval(timerInterval);

            const gameTime = document.getElementById("game-time");
            if (gameTime) {
                gameTime.textContent = timerDisplay.textContent;
            }

            const realCornerCount = document.querySelectorAll('.path-line.corner').length;
            console.log(`Curvas renderizadas no DOM: ${realCornerCount}`);

            const modal = new bootstrap.Modal(document.getElementById("game-over-modal"));
            modal.show();
        }
    }

    function drawPathBetween(from, to) {
        const fromCell = document.querySelector(`[data-pos="${from.row},${from.col}"]`);
        const toCell = document.querySelector(`[data-pos="${to.row},${to.col}"]`);

        const isHorizontal = from.row === to.row;
        const isVertical = from.col === to.col;

        if (!isHorizontal && !isVertical) return;

        const fromContainer = ensurePathContainer(fromCell);
        const toContainer = ensurePathContainer(toCell);

        if (isHorizontal) {
            const direction = to.col > from.col ? 'right' : 'left';

            if (direction === 'right') {
                fromContainer.appendChild(createPathLine('horizontal', 'left-50'));
                toContainer.appendChild(createPathLine('horizontal', 'left-0'));
            } else {
                fromContainer.appendChild(createPathLine('horizontal', 'left-0'));
                toContainer.appendChild(createPathLine('horizontal', 'left-50'));
            }
        } else if (isVertical) {
            const direction = to.row > from.row ? 'down' : 'up';

            if (direction === 'down') {
                fromContainer.appendChild(createPathLine('vertical', 'top-50'));
                toContainer.appendChild(createPathLine('vertical', 'top-0'));
            } else {
                fromContainer.appendChild(createPathLine('vertical', 'top-0'));
                toContainer.appendChild(createPathLine('vertical', 'top-50'));
            }
        }

        checkAndAddCorner(fromCell);
        checkAndAddCorner(toCell);
    }

    function checkAndAddCorner(cell) {
        const container = ensurePathContainer(cell);
        const lines = container.querySelectorAll('.path-line');
        const hasHorizontal = [...lines].some(l => l.classList.contains('horizontal'));
        const hasVertical = [...lines].some(l => l.classList.contains('vertical'));
        const hasCorner = container.querySelector('.corner');

        if (hasHorizontal && hasVertical && !hasCorner) {
            const corner = document.createElement('div');
            corner.classList.add('path-line', 'corner');
            corner.style.left = '50%';
            corner.style.top = '50%';
            corner.style.transform = 'translate(-50%, -50%)';

            const from = path[path.length - 2];
            const current = path[path.length - 1];

            if (!from || !current) return;

            const dx = current.col - from.col;
            const dy = current.row - from.row;

            if (dx === 1 && dy === -1) {
                corner.classList.add('turn-tr');
            } else if (dx === 1 && dy === 1) {
                corner.classList.add('turn-br');
            } else if (dx === -1 && dy === 1) {
                corner.classList.add('turn-bl');
            } else if (dx === -1 && dy === -1) {
                corner.classList.add('turn-tl');
            }

            container.appendChild(corner);
        }
    }

    function ensurePathContainer(cell) {
        let container = cell.querySelector('.path-container');
        if (!container) {
            container = document.createElement('div');
            container.classList.add('path-container');
            cell.appendChild(container);
        }
        return container;
    }

    function createPathLine(direction, positionClass) {
        const line = document.createElement('div');
        line.classList.add('path-line', direction);

        if (direction === 'horizontal') {
            line.style.height = '16px';
            line.style.top = positionClass === 'top-0' ? '0' : '50%';
            if (positionClass === 'left-0') {
                line.style.left = '0';
            } else {
                line.style.left = '50%';
            }
            line.style.width = '29px';
            line.style.transform = 'translateY(-50%)';
        } else if (direction === 'vertical') {
            line.style.width = '16px';
            line.style.left = positionClass === 'left-0' ? '0' : '50%';
            if (positionClass === 'top-0') {
                line.style.top = '0';
            } else {
                line.style.top = '50%';
            }
            line.style.height = '29px';
            line.style.transform = 'translateX(-50%)';
        }

        return line;
    }

    function estimateDifficulty(path) {
        const length = path.length;
        let curveCount = 0;
        let lastDirection = null;

        for (let i = 1; i < path.length; i++) {
            const dx = path[i].col - path[i - 1].col;
            const dy = path[i].row - path[i - 1].row;

            let currentDirection = '';
            if (dx === 1) currentDirection = 'right';
            else if (dx === -1) currentDirection = 'left';
            else if (dy === 1) currentDirection = 'down';
            else if (dy === -1) currentDirection = 'up';

            if (lastDirection && currentDirection !== lastDirection) {
                curveCount++;
            }

            lastDirection = currentDirection;
        }

        const maxSteps = length - 1;
        const curveRate = curveCount / maxSteps;

        let difficultyLabel = 'Fácil';

        if (curveRate >= 0.65) {
            difficultyLabel = 'Difícil';
        } else if (curveRate >= 0.50 && curveRate < 0.65) {
            difficultyLabel = 'Média';
        }

        if (lvlDificulty) {
            lvlDificulty.textContent = `Dificuldade: ${difficultyLabel}`;
        }

        console.log(`Caminho: ${length} células | Curvas: ${curveCount} (${(curveRate * 100).toFixed(0)}%)`);
        console.log(`Dificuldade estimada: ${difficultyLabel}`);
    }

    initializeGame();
}