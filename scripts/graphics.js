const TILE_SIZE = 2;
const MIN_POLITY_DRAW = 0;

stroke("black");
strokeWeight(TILE_SIZE*0.25);
fontSize(8);

function similarRGB(rgbRay1,rgbRay2) {
  return Math.abs(rgbRay1[0]-rgbRay2[0])<5 && Math.abs(rgbRay1[1]-rgbRay2[1])<5 && Math.abs(rgbRay1[2]-rgbRay2[2])<5;
}

function biomeToRGB(biome) {
  switch (biome) {
    case Biome.Ice:
      return "rgb(255,255,255)";
    case Biome.Tundra:
      return "rgb(210,210,210)";
    case Biome.Grasslands:
      return "rgb(250,215,165)";
    case Biome.Taiga:
      return "rgb(105,155,120)";
    case Biome.Desert:
      return "rgb(220,195,175)";
    case Biome.Savanna:
      return "rgb(225,155,100)";
    case Biome.TemperateForest:
      return "rgb(155,215,170)";
    case Biome.TemperateRainforest:
      return "rgb(171,195,200)";
    case Biome.XericShrubland:
      return "rgb(186,150,160)";
    case Biome.TropicalDryForest:
      return "rgb(130,190,25)";
    case Biome.TropicalRainforest:
      return "rgb(110,160,170)";
    default:
      return "rgb(0,0,255)";
  }
}

let showBorders = true;
let tileColor = "polity";
function setMapMode(mapmode) {
	switch (mapmode) {
		case "biome":
			showBorders = true;
			tileColor = "biome";
			break;
		case "political":
			showBorders = true;
			tileColor = "polity";
			break;
		case "population":
			showBorders = false;
			tileColor = "population";
			break;
		case "wealth":
			showBorders = false;
			tileColor = "wealth";
			break;
		
	}
}

function draw() {
  userInput();
  let time = new Date().getTime();
  // Draw all tiles
  for (let x = 0; x < world.width; x++) {
    for (let y = 0; y < world.height; y++) {
      let tile = world.getTile(x,y);
      if (tile.biome == Biome.Water) continue;
      if (tileColor == "polity") {
				if (tile.owner !== null && tile.owner.size() > MIN_POLITY_DRAW) {
					if (tile.isCapital) {
						if (tile.owner.isVassal) {
							fill("rgb(220,0,220)");
						} else {
							fill("rgb(255,0,0)");
						}
					} else {
						fill(tile.polity.color);
					}
				}	else {
					fill(biomeToRGB(tile.biome));
				}
			} else if (tileColor == "biome") {
        fill(biomeToRGB(tile.biome));
			} else if (tileColor == "population") {
				fill("rgb("+tile.population/1000*255+",0,0)");
			}
      rect(x*TILE_SIZE,y*TILE_SIZE,TILE_SIZE,TILE_SIZE);
      
      if ( (tile.owner !== null) && (tile.owner.size() > MIN_POLITY_DRAW) && (showBorders == true) )
        drawBorders(tile);
    }
  }
	if (mouseIsDown) {
		mouseDown();
	}
  // document.getElementById("debug-display").innerHTML = "Time taken to draw: "+((new Date().getTime()) - time)+" ms";
  drawUI();
}

function drawBorders(tile) {
  let x = tile.x, y = tile.y;
  let leftTile = world.getTile(x-1,y);
  let rightTile = world.getTile(x+1,y);
  let topTile = world.getTile(x,y-1);
  let botTile = world.getTile(x,y+1);
  if (borderBetween(tile,leftTile))
    drawBorder(tile, "L");
  if (borderBetween(tile,rightTile))
    drawBorder(tile, "R");
  if (borderBetween(tile,topTile))
    drawBorder(tile, "T");
  if (borderBetween(tile,botTile))
    drawBorder(tile, "B");
}

function borderBetween(tile,sideTile) {
  if (sideTile !== null && sideTile.owner !== null && tile.polity == sideTile.polity) {
    strokeWeight(0.1);
  } else {
    strokeWeight(0.6);
  }
	if (selectedPolity!== null && (tile.polity == selectedPolity || sideTile.polity == selectedPolity)) {
		stroke("yellow");
	} else {
		stroke("black");
	}
  return sideTile !== null && tile.owner !== sideTile.owner;
}

function drawBorder(tile, direction) {
  let s = TILE_SIZE;
  let x = tile.x*s, y = tile.y*s;
  switch (direction) {
    case "L":
      line(x,y,x,y+s);
      break;
    case "R":
      line(x+s-0.3,y,x+s-0.3,y+s);
      break;
    case "T":
      line(x,y,x+s,y);
      break;
    case "B":
      line(x,y+s-0.3,x+s,y+s-0.3);
      break;
  }
}