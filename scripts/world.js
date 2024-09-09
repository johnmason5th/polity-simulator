class World {
  constructor(width,height) {
    this.width = width;
    this.height = height;
    
    this.polities = [];
    
    this.tiles = new Array(width);
    for (let x = 0; x < width; x++) {
      this.tiles[x] = new Array(height);
      for (let y = 0; y < height; y++) {
        this.tiles[x][y] = new Tile(this,x,y);
      }
    }
    printToDebug("World created with dimensions ("+width+","+height+")");
  }
  
  getTile(x,y) {
    if (x < 0 || this.width <= x || y < 0 || this.height <= y) {
      // printToDebug("Tile ("+x+","+y+") is out of range");
      return null;
    }
    return this.tiles[x][y];
  }
  
  getAdjacentTilesOf(tile) {
    let possibleAdjTiles = [
        this.getTile(tile.x-1,tile.y),
        this.getTile(tile.x+1,tile.y),
        this.getTile(tile.x,tile.y-1),
        this.getTile(tile.x,tile.y+1)
      ];
    for (let i = possibleAdjTiles.length-1; i >= 0; i--) {
      if (possibleAdjTiles[i] === null) {
        possibleAdjTiles.splice(i,1);
      }
    }
    return possibleAdjTiles;
  }
  
  changeOwner(tile,polity) {
    tile.isCapital = false;
    tile.owner.removeTile(tile);
    if (polity.isVassal) {
      tile.polity = polity.liege;
    } else {
      tile.polity = polity;
    }
    tile.owner = polity;
    polity.addTile(tile);
  }
  
  createPolity(x,y) {
    let capitalTile = this.getTile(x,y);
    let newPolity = new Polity(this,capitalTile);
    this.polities.push(newPolity);
    capitalTile.polity = newPolity;
    capitalTile.owner = newPolity;
    capitalTile.isCapital = true;
  }
  
  collapsePolity(polity) {
    for (let tile of polity.tiles) {
      if (tile.owner == polity) {
        this.createPolity(tile.x,tile.y);
      }
    }
    this.polities.splice(this.polities.indexOf(polity), 1);
  }
}