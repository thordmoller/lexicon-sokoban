const gameContainer = document.getElementById("game-container");



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

            if (tileType != " ") {
                tileElement.classList.add("tile", `tile-${tileType}`);
            }

            gameContainer.appendChild(tileElement);
        }
    }
}

function setGridDimensions(tileMap){
    gameContainer.style.gridTemplateColumns = `repeat(${tileMap.width}, 2.5vw`;
    gameContainer.style.gridTemplateRows = `repeat(${tileMap.height}, 2.5vw`;
};

generateMap(tileMap01);
