const gameContainer = document.getElementById("game-container");

let map = generateMap(tileMap01);

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

	return tileMap;
}

function setGridDimensions(tileMap) {
	gameContainer.style.gridTemplateColumns = `repeat(${tileMap.width}, 2vw)`;
	gameContainer.style.gridTemplateRows = `repeat(${tileMap.height}, 2vw)`;
}

// Function to move the player
function move(direction) {
	const initialTile = getPlayerTile();
	if (initialTile) {
		var movedTile = getNewPosition(direction, getPlayerTile());
		movedTileType =
			map.mapGrid[movedTile.dataset.y][movedTile.dataset.x][0]; //checking the type of tile the player tries to move to

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
		return true;
	}
	return false;
}

function getPlayerTile() {
	playerTile = document.querySelector(".tile-P");

	return playerTile;
}

document.addEventListener("keydown", function (event) {
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
});
