// Need to sort these and put them in their proper locations

Biome = {
  Water: 0,
  Ice: 1,
  Tundra:  2,
  Desert: 3,
  Savanna: 4,
  Grasslands: 5,
  Taiga: 6,
  TemperateRainforest: 7,
  TropicalRainforest: 8,
  XericShrubland: 9,
  TropicalDryForest: 10,
  TemperateForest: 11
};

function biomeIdToName(biomeId) {
  switch (biomeId) {
    case 0:
      return "Water";
    case 1:
      return "Ice";
    case 2:
      return "Tundra";
    case 3:
      return "Desert";
    case 4:
      return "Savanna";
    case 5:
      return "Grasslands";
    case 6:
      return "Taiga";
    case 7:
      return "Temperate Rainforest";
    case 8:
      return "Tropical Rainforest";
    case 9:
      return "Xeric Shrubland";
    case 10:
      return "Tropical Dry Forest";
    case 11:
      return "Temperate Forest";
  }
}

function similarRGB(rgbRay1,rgbRay2) {
  return Math.abs(rgbRay1[0]-rgbRay2[0])<5 && Math.abs(rgbRay1[1]-rgbRay2[1])<5 && Math.abs(rgbRay1[2]-rgbRay2[2])<5;
}
function rgbToBiome(rgbRay) {
  let r = rgbRay[0];
  let g = rgbRay[1];
  let b = rgbRay[2];
  if        (similarRGB(rgbRay,[255,255,255])) {
    return Biome.Ice;
  } else if (similarRGB(rgbRay,[210,210,210])) {
    return Biome.Tundra;
  } else if (similarRGB(rgbRay,[250,215,165])) {
    return Biome.Grasslands;
  } else if (similarRGB(rgbRay,[105,155,120])) {
    return Biome.Taiga;
  } else if (similarRGB(rgbRay,[220,195,175])) {
    return Biome.Desert;
  } else if (similarRGB(rgbRay,[225,155,100])) {
    return Biome.Savanna;
  } else if (similarRGB(rgbRay,[155,215,170])) {
    return Biome.TemperateForest;
  } else if (similarRGB(rgbRay,[171,195,200])) {
    return Biome.TemperateRainforest;
  } else if (similarRGB(rgbRay,[186,150,160])) {
    return Biome.XericShrubland;
  } else if (similarRGB(rgbRay,[130,190,25])) {
    return Biome.TropicalDryForest;
  } else if (similarRGB(rgbRay,[110,160,170])) {
    return Biome.TropicalRainforest;
  } else {
    return Biome.Water;
  }
}