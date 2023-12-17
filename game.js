const gameContainer = document.getElementById("game-container");
let buttonEventHandlers = [];

startGame();

function startGame() {
	generateMap(tileMap01);
	document.addEventListener("keydown", handleKeyPress);
}

function generateMap(tileMap) {
	// Ensure that the game container exists
	if (!gameContainer) {
		console.error("Game container not found!");
		return;
	}

	setGridDimensions(tileMap);

	for (let row = 0; row < tileMap.height; row++) {
		for (let col = 0; col < tileMap.width; col++) {
			let tileType = tileMap.mapGrid[row][col][0];

			const tileElement = document.createElement("div");
			tileElement.id = `x${col}y${row}`;

			tileElement.setAttribute("data-x", col.toString());
			tileElement.setAttribute("data-y", row.toString());

			tileElement.classList.add("tile");

			if (tileType != " ") {
				tileElement.classList.add(`tile-${tileType}`);
			}

			gameContainer.appendChild(tileElement);
		}
	}
}

function setGridDimensions(tileMap) {
	let maxWidth;

	const gridGap = 2;
	gameContainer.style.gap = gridGap + "px";

	generateButtons();

	if (window.innerHeight > window.innerWidth) {
		maxWidth =
			Math.floor(window.innerWidth / tileMap.width) * tileMap.width;
		let buttons = document.querySelectorAll(".button");
		buttons.forEach((button) => {
			button.style.height = "20vw";
			button.style.width = "20vw";
			// Add more styles if needed
		});
	} else {
		maxWidth = 800;
	}

	const totalGapWidth = gridGap * tileMap.width - 1;

	console.log(totalGapWidth);

	const tileSize = Math.round((maxWidth - totalGapWidth) / tileMap.width);

	gameContainer.style.gridTemplateColumns = `repeat(${tileMap.width}, ${tileSize}px)`;
	gameContainer.style.gridTemplateRows = `repeat(${tileMap.height}, ${tileSize}px)`;
}

function generateButtons() {
	// Generate on-screen buttons
	const directions = ["Up", "Left", "Down", "Right"];
	const buttonsContainer = document.createElement("div");
	buttonsContainer.classList.add("button-container");

	buttonGroup = document.createElement("div");

	directions.forEach((direction) => {
		const button = document.createElement("button");
		button.classList.add("button");
		button.textContent = direction;

		let interval;
		let moveTriggered = false;
		let timeout;
		const mousedownHandler = function () {
			move(direction.toLowerCase());

			timeout = setTimeout(() => {
				interval = setInterval(() => {
					console.log("hej");
					if (!moveTriggered) {
						move(direction.toLowerCase());
						moveTriggered = true;
					}
					moveTriggered = false;
				}, 35);
			}, 450);
			moveTriggered = false;
		};

		const mouseupHandler = function () {
			clearInterval(interval);
			clearTimeout(timeout);
		};

		button.addEventListener("touchstart", mousedownHandler);
		document.addEventListener("touchend", mouseupHandler);

		buttonEventHandlers.push({ button, mousedownHandler, mouseupHandler });

		if (direction != "Up") {
			buttonGroup.appendChild(button);
		} else {
			buttonsContainer.appendChild(button);
		}
	});

	buttonsContainer.appendChild(buttonGroup);

	gameContainer.insertAdjacentElement("afterend", buttonsContainer);
}

function clearButtonEvents() {
	buttonEventHandlers.forEach(
		({ button, mousedownHandler, mouseupHandler }) => {
			button.removeEventListener("touchstart", mousedownHandler);
			document.removeEventListener("touchend", mouseupHandler);
		}
	);
	buttonEventHandlers = [];
}

// Function to move the player
function move(direction) {
	const initialTile = getPlayerTile();
	if (initialTile) {
		var movedTile = getNewPosition(direction, getPlayerTile());

		//only actually moves if its not a wall
		if (movedTile.classList.contains("tile-B")) {
			if (moveBox(getNewBoxPosition(direction))) {
				movePlayer(movedTile);
			}
		} else if (!movedTile.classList.contains("tile-W")) {
			movePlayer(movedTile);
		}
	}
}

function getNewPosition(direction, initialTile) {
	//initial position
	var movedPos = {
		x: parseInt(initialTile.dataset.x, 10),
		y: parseInt(initialTile.dataset.y, 10),
	};

	//changing position based on keypress
	switch (direction) {
		case "up":
			movedPos.y -= 1;
			break;
		case "down":
			movedPos.y += 1;
			break;
		case "left":
			movedPos.x -= 1;
			break;
		case "right":
			movedPos.x += 1;
			break;
	}

	const id = "x" + movedPos.x + "y" + movedPos.y;

	let movedTile = document.getElementById(id);

	return movedTile;
}

function getNewBoxPosition(direction) {
	initialTile = getPlayerTile();
	initialBoxTile = getNewPosition(direction, initialTile);
	movedBoxTile = getNewPosition(direction, initialBoxTile);

	console.log(movedBoxTile.id);
	var boxTiles = {
		movedBoxTile,
		initialBoxTile,
	};
	return boxTiles;
}

function movePlayer(movedTile) {
	initialTile = getPlayerTile();
	initialTile.classList.remove("tile-P");
	movedTile.classList.add("tile-P");
}
function moveBox(boxTiles) {
	const movedBoxTile = boxTiles.movedBoxTile;
	const initialBoxTile = boxTiles.initialBoxTile;

	console.log(movedBoxTile.classList);

	if (
		!["tile-W", "tile-B"].some((cls) =>
			movedBoxTile.classList.contains(cls)
		)
	) {
		initialBoxTile.classList.remove("tile-B");
		movedBoxTile.classList.add("tile-B");

		if (movedBoxTile.classList.contains("tile-G")) {
			victory();
		}
		return true;
	}
	return false;
}

function getPlayerTile() {
	playerTile = document.querySelector(".tile-P");

	return playerTile;
}

function handleKeyPress(event) {
	// Prevent the default action for arrow keys
	switch (event.code) {
		case "ArrowUp":
		case "ArrowDown":
		case "ArrowLeft":
		case "ArrowRight":
			event.preventDefault();
			break;
	}

	switch (event.code) {
		case "ArrowUp":
			move("up");
			console.log("up");
			break;
		case "ArrowDown":
			move("down");
			break;
		case "ArrowLeft":
			move("left");
			break;
		case "ArrowRight":
			move("right");
			break;
	}
}

function victory() {
	const goalTiles = document.querySelectorAll(".tile-G");
	for (const tile of goalTiles) {
		if (!tile.classList.contains("tile-B")) {
			return false;
		}
	}
	document.removeEventListener("keydown", handleKeyPress);
	clearButtonEvents();

	const buttonContainer = document.querySelector(".button-container");
	buttonContainer.innerHTML = "";

	const victoryTextContainer = document.createElement("div");
	victoryTextContainer.classList.add("victory-text");

	const victoryText = document.createElement("p");
	victoryText.textContent = "Victory!"; // You can customize the victory message

	// Append the victory text element to the container
	victoryTextContainer.appendChild(victoryText);

	buttonContainer.appendChild(victoryTextContainer);

	return true;
}
