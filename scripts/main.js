setGamespeed(3);
zoom(1.8);

function simulationLoop() {
	if (!simulationPaused)
		updateSim();
	setTimeout(simulationLoop, simulationSpeedMs);
}
simulationLoop();

const FRAMES_PER_SECOND = 60;  // Valid values are 60,30,20,15,10
// set the mim time to render the next frame
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
var lastFrameTime = 0;  // the last frame time
function updateFrame(time){
    if(time-lastFrameTime < FRAME_MIN_TIME){ //skip the frame if the call is too early
        requestAnimationFrame(updateFrame);
        return; // return as there is nothing to do
    }
		
		draw();
    
    lastFrameTime = time; // remember the time of the rendered frame
    // render the frame
    requestAnimationFrame(updateFrame);
}

function drawSea() {
	fill("navy");
	rect(-2000,-2000,4000,4000);
	fill("blue");
	rect(0,0,WORLD_WIDTH*TILE_SIZE,WORLD_HEIGHT*TILE_SIZE);
}
drawSea();

window.requestAnimationFrame(updateFrame);