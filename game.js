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

function setGridDimensions(tileMap){
    gameContainer.style.gridTemplateColumns = `repeat(${tileMap.width}, 2.5vw)`;
    gameContainer.style.gridTemplateRows = `repeat(${tileMap.height}, 2.5vw)`;
}


// Function to move the player
function movePlayer(direction) {

    const initialTile = getCurrentPlayerPosition();
    if (initialTile) {

        var movedPos = {
            x: parseInt(initialTile.dataset.x, 10),
            y: parseInt(initialTile.dataset.y, 10)
        }

        switch(direction){
            case 'up':
            movedPos.y -= 1;
            break;
            case 'down':
                movedPos.y += 1;
                break;
            case 'left':
                movedPos.x -= 1;
                break;
            case 'right':
                movedPos.x += 1;
                break;
        }
        console.log(movedPos)
        movedTileType = map.mapGrid[movedPos.y][movedPos.x][0];
        console.log(movedTileType);

        if(movedTileType === " " || movedTileType === "P" || movedTileType === "G"){
            initialTile.classList.remove('tile-P');
            const id = 'x' + movedPos.x + 'y' + movedPos.y;
            let movedTile = document.getElementById(id);
            movedTile.classList.add('tile-P');
        }
    }
}

function getCurrentPlayerPosition(){
    // Set initial player position
    const initialPlayerElement = document.querySelector('.tile-P');
    
    return initialPlayerElement;
}

document.addEventListener('keydown', function(event) {
    switch (event.code) {
        case 'ArrowUp':
            movePlayer('up');
            console.log('up');
            break;
        case 'ArrowDown':
            movePlayer('down');
            break;
        case 'ArrowLeft':
            movePlayer('left');
            break;
        case 'ArrowRight':
            movePlayer('right');
            break;
    }
});
