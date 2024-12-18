// Definicion de tipos
interface Position {
  x: number;
  y: number;
}

// Constantes
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const TILE_SIZE = 20;
const TILE_COUNT = 20;
const FPS = 10;

// Estado del juego
canvas.width = TILE_SIZE * TILE_COUNT;
canvas.height = TILE_SIZE * TILE_COUNT;

let snake: Position[] = [{ x: 10, y: 10 }];
let fruit: Position = { x: 5, y: 5 };
let velocity: Position = { x: 0, y: 0 };
let tailLength = 3;
let score = 0;

// Loop principal del juego
function gameLoop(): void {
  update();
  draw();
}

function update(): void {
  // Actualizar posicion de la cabeza de la serpiente
  const head: Position = { ...snake[snake.length - 1] };
  head.x += velocity.x;
  head.y += velocity.y;

  // Envolver la serpiente en los bordes
  head.x = (head.x + TILE_COUNT) % TILE_COUNT;
  head.y = (head.y + TILE_COUNT) % TILE_COUNT;

  // Comprobar si la fruta ha sido comida
  if (head.x === fruit.x && head.y === fruit.y) {
    tailLength++;
    score++;
    spawnFruit();
  }

  // Agregar nueva posicion de la cabeza
  snake.push(head);

  // Mantener el tamano correcto de la cola
  while (snake.length > tailLength) {
    snake.shift();
  }

  // Verificar colision con la serpiente misma
  for (let i = 0; i < snake.length - 1; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      resetGame();
    }
  }
}

function draw(): void {
  // Limpiar el canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar la serpiente
  ctx.fillStyle = "lime";
  snake.forEach((segment) => {
    ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  });

  // Dibujar la fruta
  ctx.fillStyle = "red";
  ctx.fillRect(fruit.x * TILE_SIZE, fruit.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

  // Dibujar el puntaje
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function spawnFruit(): void {
  fruit.x = Math.floor(Math.random() * TILE_COUNT);
  fruit.y = Math.floor(Math.random() * TILE_COUNT);

  // Evitar que la fruta aparezca sobre la serpiente
  while (snake.some((segment) => segment.x === fruit.x && segment.y === fruit.y)) {
    fruit.x = Math.floor(Math.random() * TILE_COUNT);
    fruit.y = Math.floor(Math.random() * TILE_COUNT);
  }
}

function resetGame(): void {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  tailLength = 3;
  score = 0;
  spawnFruit();
}

// Manejo de entradas del teclado
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (velocity.y === 0) velocity = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (velocity.y === 0) velocity = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (velocity.x === 0) velocity = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (velocity.x === 0) velocity = { x: 1, y: 0 };
      break;
  }
});

// Manejo de botones
(document.getElementById("btnUp") as HTMLButtonElement).addEventListener("click", () => {
  if (velocity.y === 0) velocity = { x: 0, y: -1 };
});
(document.getElementById("btnDown") as HTMLButtonElement).addEventListener("click", () => {
  if (velocity.y === 0) velocity = { x: 0, y: 1 };
});
(document.getElementById("btnLeft") as HTMLButtonElement).addEventListener("click", () => {
  if (velocity.x === 0) velocity = { x: -1, y: 0 };
});
(document.getElementById("btnRight") as HTMLButtonElement).addEventListener("click", () => {
  if (velocity.x === 0) velocity = { x: 1, y: 0 };
});

// Iniciar el juego
setInterval(gameLoop, 1000 / FPS);
spawnFruit();