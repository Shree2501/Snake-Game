
const board = document.querySelector(".board")

const blockWidth = 50
const blockHeight = 50

const cols = Math.floor(board.clientWidth / blockWidth)
const rows = Math.floor(board.clientHeight / blockHeight)

const startBtn = document.querySelector(".btn")
const modal = document.querySelector(".modal")
const startgameModal = document.querySelector(".start-game")
const gameoverModal = document.querySelector(".game-over")
const resbtn = document.querySelector(".res-btn")

let highscoreElement = document.getElementById("highScore")
let scoreElement = document.getElementById("score")
let timeElement = document.getElementById("time")

let score = 0
let highScore = 0
let time = `00-00`

let speed = 300

const blocks = {}
let snake = [{ x: 1, y: 8 }]

let food = {
     x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)
    }
let direction = "right"

let intervalId = null
let timeintervalId = null

board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
board.style.gridTemplateRows = `repeat(${rows}, 1fr)`


for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

        const block = document.createElement("div")
        block.classList.add("block")
        board.appendChild(block)
        blocks[`${row}-${col}`] = block
    }
}

function render() {
    let head = null

    blocks[`${food.x}-${food.y}`].classList.add("food")
    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    }
    else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    }
    else if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }
    else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }

    // check self collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(intervalId)
            score = 0
            scoreElement.innerText = score
            modal.style.display = "flex"
            startgameModal.style.display = "none"
            gameoverModal.style.display = "flex"
            return
        }
    }

    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x}-${food.y}`].classList.add("food")

        score += 10
        scoreElement.innerText = score
        
        UpSpeed()
        if (score > highScore) {
            highScore = score
        }
        highscoreElement.innerText = highScore
        snake.unshift(head)
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId)
        score = 0
        scoreElement.innerText = score
        modal.style.display = "flex"
        startgameModal.style.display = "none"
        gameoverModal.style.display = "flex"
    }
    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
        blocks[`${segment.x}-${segment.y}`].classList.remove("head")
        blocks[`${segment.x}-${segment.y}`].innerHTML = ""
    })

    snake.unshift(head)
    snake.pop()

    snake.forEach((segment, index) => {
        if(index === 0){
            blocks[`${segment.x}-${segment.y}`].classList.add("head")
            blocks[`${segment.x}-${segment.y}`].innerHTML = `
            <div class="eye eye1"></div>
            <div class="eye eye2"></div>`
        }else{
            blocks[`${segment.x}-${segment.y}`].classList.add("fill")
            blocks[`${segment.x}-${segment.y}`].innerHTML = ""
        }
    })
}

addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        direction = "left"
    }
    else if (event.key === "ArrowRight") {
        direction = "right"
    }
    else if (event.key === "ArrowUp") {
        direction = "up"
    }
    else if (event.key === "ArrowDown") {
        direction = "down"
    }
    else {
        cout << "Pls press correct key"
    }
})

startBtn.addEventListener("click", () => {
    intervalId = setInterval(() => {
        render()
    }, speed)
    modal.style.display = "none"

    timeintervalId = setInterval(() => {
        let [min, sec] = timeElement.innerText.split("-").map(Number)
        if (sec == 59) {
            min += 1;
            sec = 0;
        }
        else {
            sec += 1;
        }
        time = `${min.toString().padStart(2, "0")}-${sec.toString().padStart(2, "0")}`
        timeElement.innerText = time
    }, 1000)
})

resbtn.addEventListener("click", restart)
function restart() {

    clearInterval(intervalId)
    clearInterval(timeintervalId)

    // clear whole board
    for (let key in blocks) {
        blocks[key].classList.remove("fill")
        blocks[key].classList.remove("head")
        blocks[key].classList.remove("food")
        blocks[key].innerHTML = ""
    }

    snake = [{ x: 1, y: 8 }]

    score = 0
    scoreElement.innerText = score

    time = "00-00"
    timeElement.innerText = time

    direction = "down"

    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    }

    modal.style.display = "none"

    render()

    intervalId = setInterval(render, speed)
}

function UpSpeed() {
    if (score % 100 === 0 ) {
        speed -= 20
    }
    clearInterval(intervalId)
    intervalId = setInterval(() => {
        render()
    }, speed)
}