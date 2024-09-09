const MIN_VASSAL_SIZE = 5;

let step = 0;
//Create world
const WORLD_WIDTH = rgbMapArray.length;
const WORLD_HEIGHT = rgbMapArray[0].length;
let world = new World(WORLD_WIDTH,WORLD_HEIGHT);

// World setup: Set tiles to different biomes based on rgbMapArray and creates polities where applicable
for (let x = 0; x < WORLD_WIDTH; x++) {
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    let biome = Biome.Water;
    biome = rgbToBiome(rgbMapArray[x][y]);
    world.getTile(x,y).biome = biome;
    if ((biome == Biome.TemperateForest /*|| biome == Biome.Taiga*/)/* && y > 50*/) {
    // if (biome != Biome.Water) {
      world.createPolity(x,y);
    } else if (biome == Biome.Grasslands) {
      
    }
  }
}

function updateTiles(world) {
	for (let x = 0; x < world.width; x++) {
    for (let y = 0; y < world.height; y++) {
      tile = world.tiles[x][y];
			tile.update();
    }
  }
}

function updatePolities(world) {
	for (let polity of world.polities) {
		if (polity.ruler == 'ai') {
			polity.update();
		}
  }
}

function updateSim() {
  let time = new Date().getTime();
	
	if (step % 12 == 0) {
		updateTiles(world);
	}
	updatePolities(world);
	
  //document.getElementById("debug-display").innerHTML = "Time taken to simulate: "+((new Date().getTime()) - time)+" ms";
  printToElement("date", "Year: "+Math.floor((++step)/12)+" Month: "+((step%12)+1) );
}

var simulationPaused = false;
var simulationSpeedMs;
function setGamespeed(gamespeed) {
	if (gamespeed == 1) {
		simulationSpeedMs = 500;
	} else if (gamespeed == 2) {
		simulationSpeedMs = 100;
	} else if (gamespeed == 3) {
		simulationSpeedMs = 20;
	}
}