class Polity {
  constructor(world, capitalTile) {
//Graphics
    this.color = "rgb("+randInt(20,190)+","+randInt(20,190)+","+randInt(20,190)+")";
		
//Sim
		
		this.world = world;
		
		this.ruler = 'ai';
		
		//Resources
		this.treasury = 0;
		this.army = 0;
		
    //Territory
    this.capitalTile = capitalTile;
    this.tiles = [capitalTile];
    
    //Vassal System
    this.isVassal = false;
    this.liege = null;
    this.vassals = [];
    
    //'Military'
    this.power = 200;
    
    //Diplo
    this.borderPolities = [];
    this.enemyPolities = [];
  }
	
	//Utilities
  
  coreSize() {
    return this.tiles.length;
  }
  
  size() {
    return this.tiles.length;
  }
	
	
	update() {
    if (!this.tiles.includes(this.capitalTile)) {
      this.capitalWasLost();
      return;
    }
    
    if (this.isVassal) {
      this.vassalBehavior();
    }  else {
      this.independentBehavior();
    }
    
    if (this.power < 5) {
      this.collapse();
    }
  }
  
  independentBehavior() {
    this.power -= 1 + Math.floor(this.size() / 10);
    
    this.calculateBorderPolities();
    
    //Make peace with polities no longer bordering
    for (let i = this.enemyPolities.length-1; i >= 0; i--) {
      if (!this.borderPolities.includes(this.enemyPolities[i])) {
        this.makePeaceWith(this.enemyPolities[i]);
      }
    }
		
    // Warfare
    if (this.enemyPolities.length>0) {
      // if (Math.random()<=0.02) {
      //   this.makePeaceWith(this.enemyPolities[randInt(0,this.enemyPolities.length)]);
      // }
      this.battlePolities();
    } else {
      this.declareWarRandom();
    }
  }
  
  vassalBehavior() {
    if (this.liege.power < this.power) {
      this.revolt();
    }
  }
  
  //Vassal Mechanics
  
  vassalizedBy(polity) {
    for (let i = this.enemyPolities.length-1; i >= 0; i--) {
      this.makePeaceWith(this.enemyPolities[i]);
    }
    this.borderPolities = [];
    this.moveCapital();
    if (this.isVassal) {
      this.liege.releaseVassal(this);
    }
    for (let i = this.vassals.length-1; i >= 0; i--) {
      this.releaseVassal(this.vassals[i]);
    }
    polity.vassals.push(this);
    for (let tile of this.tiles) {
      tile.polity = polity;
    }
    this.isVassal = true;
    this.liege = polity;
  }
  
  revolt() {
    this.liege.releaseVassal(this);
  }
  
  releaseVassal(vassal) {
    this.vassals.splice(this.vassals.indexOf(vassal),1);
		vassal.power += 1000;
    for (let tile of vassal.tiles) {
      tile.polity = vassal;
    }
    vassal.isVassal = false;
    vassal.liege = null;
  }
  
  //War and Peace Mechanics
  
  calculateBorderPolities() {
    let borderPolities = [];
    
    let tiles = [];
    for (let tile of this.tiles) {
      tiles.push(tile);
    }
    for (let vassal of this.vassals) {
      for (let tile of vassal.tiles) {
        tiles.push(tile);
      }
    }
    
    for (let tile of tiles) {
      let adjacentTiles = this.world.getAdjacentTilesOf(tile);
      for (let adjTile of adjacentTiles) {
        if (adjTile.polity === null) continue;
        if (adjTile.polity != this && !borderPolities.includes(adjTile.polity)) {
          borderPolities.push(adjTile.polity);
        }
      }
    }
    this.borderPolities = borderPolities;
  }
  
  declareWarRandom() {
    if (this.borderPolities.length < 1) return;
    let randomBorderPolity = this.borderPolities[randInt(0,this.borderPolities.length)];
    let count = 0;
    while (this.enemyPolities.includes(randomBorderPolity) || count<this.borderPolities.length) {
      randomBorderPolity = this.borderPolities[randInt(0,this.borderPolities.length)];
      count++;
    }
    this.enemyPolities.push(randomBorderPolity);
    randomBorderPolity.enemyPolities.push(this);
  }
  
  makePeaceWith(polity) {
    this.enemyPolities.splice(this.enemyPolities.indexOf(polity),1);
    polity.enemyPolities.splice(polity.enemyPolities.indexOf(this),1);
  }
  
  //General Mechanics
  
  battlePolities() {
    let tiles = [];
    for (let tile of this.tiles) {
      tiles.push(tile);
    }
    for (let vassal of this.vassals) {
      for (let tile of vassal.tiles) {
        tiles.push(tile);
      }
    }
    
    for (let tile of tiles) {
      let adjacentTiles = this.world.getAdjacentTilesOf(tile);
      for (let adjTile of adjacentTiles) {
        if (adjTile.owner === null)
          continue;
        if (adjTile.polity != this && this.enemyPolities.includes(adjTile.polity)) {
          this.attackTileFrom(tile,adjTile);
        }
      }
    }
  }
  
  attackTileFrom(attTile,defTile) {
    let defPolity = defTile.polity;
    let attPower = (1+this.power);
    let defPower = (1+defPolity.power);
    let chance = (attPower-defPower)/(attPower+defPower);
    //If tile biome is not same as capital tile, half as likely to conquer
    chance*=((this.capitalTile.biome != defTile.biome)?0.5:1);
    if (Math.random() <= chance) {
      this.world.changeOwner(defTile,attTile.owner);
			
			this.power+=1;
			defPolity.power-=1;
    } else {
			this.power-=1;
			defPolity.power-=1;
		}
  }
  
  capitalWasLost() {
    if (this.coreSize() > MIN_VASSAL_SIZE && this.capitalTile.polity.size() > this.coreSize()) {
      this.vassalizedBy(this.capitalTile.polity);
    } else if (this.coreSize()>MIN_VASSAL_SIZE) {
      this.moveCapital();
    } else {
      this.collapse();
    }
  }
  
  collapse() {
    for (let i = this.enemyPolities.length-1; i >= 0; i--) {
      this.makePeaceWith(this.enemyPolities[i]);
    }
    if (this.isVassal) {
      this.liege.releaseVassal(this);
    }
    for (let vassal of this.vassals) {
      this.releaseVassal(vassal);
    }
    this.world.collapsePolity(this);
  }
  
  moveCapital() {
    this.capitalTile = this.tiles[randInt(0,this.tiles.length)];
    this.capitalTile.isCapital = true;
  }

  addTile(tile) {
    this.tiles.push(tile);
  }
  
  removeTile(tile) {
    this.tiles.splice(this.tiles.indexOf(tile),1);
  }
}