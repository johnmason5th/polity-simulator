let selectedPolity = null;
let inspectTile;

let pauseButton = document.getElementById('pause-button');
function pauseToggler() {
	pauseButton.innerHTML = (pauseButton.innerHTML == "Pause")?"Resume":"Pause";
	simulationPaused=!simulationPaused;
}

function userInput() {
  inspectTile = world.getTile(Math.floor(mouseX/TILE_SIZE),Math.floor(mouseY/TILE_SIZE));
  if (inspectTile !== null) {
    printToElement("inspect", "Biome: "+biomeIdToName(inspectTile.biome) );
    if (mousePressed)
			selectedPolity = inspectTile.owner;
		if (selectedPolity !== null && selectedPolity.size() > MIN_POLITY_DRAW)
			printToElement("inspect", ", Polity - isVassal:"+selectedPolity.isVassal+", power:"+selectedPolity.power+", atwar:"+(selectedPolity.enemyPolities.length>0) );
  } else {
    printToElement("inspect", "No Polity" );
  }
	mousePressed = false;
}

function drawUI() {
  if (selectedPolity === null) return;
  
  //Polity
  fill("rgb(0,255,0)");
  for (let tile of selectedPolity.tiles) {
    if (!tile.isCapital)
      rect(tile.x*TILE_SIZE,tile.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
  }
  if (selectedPolity.isVassal) {
    fill("rgb(200,255,0)");
    //Liege
    for (let tile of selectedPolity.liege.tiles) {
      if (!tile.isCapital)
        rect(tile.x*TILE_SIZE,tile.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
    }
    fill("rgb(0,0,200)");
    //Liege Vassals, co-vassals
    for (let vassal of selectedPolity.liege.vassals) {
      if (vassal !== null && vassal != selectedPolity)
      for (let tile of vassal.tiles) {
        if (!tile.isCapital)
          rect(tile.x*TILE_SIZE,tile.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
      }
    }
  } else {
    fill("rgb(140,255,140)");
    //Vassals
    for (let vassal of selectedPolity.vassals) {
      for (let tile of vassal.tiles) {
        if (!tile.isCapital)
          rect(tile.x*TILE_SIZE,tile.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
      }
    }
    
    let borderPolities = [...selectedPolity.borderPolities];
    for (let borderPolity of borderPolities) {
      let tiles = [];
      for (let tile of borderPolity.tiles) {
        tiles.push(tile);
      }
      for (let vassal of borderPolity.vassals) {
        for (let tile of vassal.tiles) {
          tiles.push(tile);
        }
      }
      if (selectedPolity.enemyPolities.includes(borderPolity)) {
        //Enemy polities
        fill("rgb(200,0,0)");
        for (let tile of tiles) {
          if (!tile.isCapital)
            rect(tile.x*TILE_SIZE,tile.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
        }
      } else {
        // Border polities
        // fill("rgb(0,255,255)");
        // for (let tile of tiles) {
          // if (!tile.isCapital)
            // rect(tile.x*TILE_SIZE,tile.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
        // }
      }
    }
  }
}

function mouseWheel(e) {
	e.preventDefault();
	translate(mouseX,mouseY);
	zoom((e.deltaY/Math.abs(e.deltaY))*0.1+1);
	translate(-mouseX,-mouseY);
	drawSea();
}

function mouseDown() {
	// translate(mouseX-pMouseX,mouseY-pMouseY);
	// drawSea();
}