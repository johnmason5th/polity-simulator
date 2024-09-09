class Tile {
  constructor(world,x,y) {
    this.biome = Biome.Water;
		
    this.population = 1; // 100s
    this.wealth = 0;
		
		this.production = 1.1;
		
    this.polity = null;
    this.owner = null;
    this.isCapital = false;
    
    this.world = world;
    this.x = x;
    this.y = y;
  }
	update() {
		if (this.isCapital) {
			this.population+=3;
		} else {
			this.population++;
		}
	}
}