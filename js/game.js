// Set up some size variables for easy changing
var width = 1024, height = 576, mapWidth = 768, mapHeight = 576;

// Some global variables that can be adjusted
var gravity = .15, bounce = .4, jumpFieldSpeed = 7, stopTime = 2000, collisionBuffer = 0.5;

var currScreen;

var playing = false;

// Object holding all of the game textures
var textures = {};


// Object holding all of the game objects
// types:
//  - wall: just bounced off of
//  - jumpfield: field that will accelerate the player upwards
var objects = {};

// Object to store backgrounds, not sure if they'll be relevant
var backgrounds = {};

// Object holding the prisoner and information about him
var prisoner = {};

// Grab gameport from the html
var gameport = document.getElementById("gameport");

// Create and add renderer to the gameport
var renderer = new PIXI.autoDetectRenderer(width, height, {backgroundColor: 0x99D5FF});
gameport.appendChild(renderer.view);

// Create the main stage
var stage = new PIXI.Container();

// Insert intro screen and tutorial screens here


// Level 1 screen containers
// Screen index is at 0 for now, but when intro screens have been added the screen index will be shifted later
var firstLC = new PIXI.Container();
stage.addChildAt(firstLC,0);

var firstBG = new PIXI.Container();
firstLC.addChildAt(firstBG,0);

var firstObjs = new PIXI.Container();
firstLC.addChildAt(firstObjs,1);


PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// PIXI.loader.add("sprites.json").load(ready);
PIXI.loader.add("assets/spritesheet.json").load(initTextures);

function initTextures() {
	// Add all textures to texture object
	textures["testBlack"] = PIXI.Texture.fromFrame("test-black.png");
	textures["testBlue"] = PIXI.Texture.fromFrame("test-blue.png");
	textures["testGrey"] = PIXI.Texture.fromFrame("test-grey.png");
	textures["testRed"] = PIXI.Texture.fromFrame("test-red.png");

	drawScreen(0);
	animate();
}

function drawScreen(screenIndex) {

	currScreen = screenIndex;
	screen = stage.getChildAt(screenIndex);

	for (element in screenLayouts[screenIndex]) {
		elem = screenLayouts[screenIndex][element];

		if (elem.type === "background") {
			backgrounds[element] = {"sprite": new PIXI.Sprite(textures[elem.texture])};
			backgrounds[element].sprite.width = elem.width;
			backgrounds[element].sprite.height = elem.height;
			backgrounds[element].sprite.position.x = elem.x;
			backgrounds[element].sprite.position.y = elem.y;
			backgrounds[element].dx = elem.dx;
			backgrounds[element].dy = elem.dx;
			backgrounds[element].type = elem.subtype;
			screen.getChildAt(0).addChild(backgrounds[element].sprite);
		}

		if (elem.type === "prisoner") {
			prisoner.sprite = new PIXI.Sprite(textures[elem.texture]);
			prisoner.sprite.width = elem.width;
			prisoner.sprite.height = elem.height;
			prisoner.sprite.position.x = elem.x;
			prisoner.sprite.position.y = elem.y;
			prisoner.dx = elem.dx;
			prisoner.dy = elem.dy;
			screen.addChild(prisoner.sprite);
		}

		if (elem.type === "object") {
			objects[element] = {"sprite": new PIXI.Sprite(textures[elem.texture])};
			if (elem.secondTexture) objects[element].secondTexture = elem.secondTexture;
			objects[element].sprite.width = elem.width;
			objects[element].sprite.height = elem.height;
			objects[element].sprite.position.x = elem.x;
			objects[element].sprite.position.y = elem.y;
			objects[element].dx = elem.dx;
			objects[element].dy = elem.dx;
			objects[element].type = elem.subtype;
			objects[element].draggable = elem.draggable;
			screen.getChildAt(1).addChild(objects[element].sprite);

			if (objects[element].draggable) {
				objects[element].sprite.interactive = true;
				objects[element].sprite.on('mousedown', onDragStart);
				objects[element].sprite.on('mouseup', onDragEnd);
				objects[element].sprite.on('mouseupoutside', onDragEnd);
				objects[element].sprite.on('mousemove', onDragMove);
			}
		}
	}
}

function resetPrisoner() {
	playing = false;
	prisoner.sprite.position.x = screenLayouts[currScreen]["prisoner"].x;
	prisoner.sprite.position.y = screenLayouts[currScreen]["prisoner"].y;
}

function startPrisoner() {
	playing = true;
	prisoner.dx = screenLayouts[currScreen]["prisoner"].dx;
	prisoner.dy = screenLayouts[currScreen]["prisoner"].dy;
}

function updatePrisoner() {
	px = prisoner.sprite.position.x;
	py = prisoner.sprite.position.y;
	pw = prisoner.sprite.width;
	ph = prisoner.sprite.height;

	prisoner.sprite.position.x += prisoner.dx;
	prisoner.sprite.position.y += prisoner.dy;

	// Check for hitting left wall
	if (px < 0) {
		prisoner.dx *= -1;
		prisoner.sprite.position.x = 0;
	}

	// Check for hitting top wall
	if (py < 0) {
		prisoner.dy *= -1;
		prisoner.sprite.position.y = 0;
	}
	
	// Check for hitting right wall
	if (px + pw > mapWidth) {
		prisoner.dx *= -1;
		prisoner.sprite.position.x = mapWidth - pw;
	}

	// Check for hitting floor
	if (py + ph > mapHeight) {
		prisoner.dy *= -bounce;
		prisoner.sprite.position.y = mapHeight - ph;
	}

	prisoner.dy += gravity;
}

function checkPrisonerCollision() {

	// Check every object
	for (object in objects) {

		// Grab the current object in question
		obj = objects[object];

		// Save snapshots of current sprite values for easy reference
		px = prisoner.sprite.position.x, py = prisoner.sprite.position.y, pw = prisoner.sprite.width, ph = prisoner.sprite.height;
		ox = obj.sprite.position.x, oy = obj.sprite.position.y, ow = obj.sprite.width, oh = obj.sprite.height;

		// Some more snapshot math for checking collision
		dx = (px+pw/2)-(ox+ow/2), dy = (py+ph/2)-(oy+oh/2);
		w = (pw+ow)/2, h = (ph+oh)/2;
		cw = w*dy, ch = h*dx;

		// Check if collision occured with this object
		if (Math.abs(dx) + collisionBuffer <= w && Math.abs(dy) + collisionBuffer <= h) {

			// Determine which side the collision happened on
			if (cw > ch) side = (cw > -ch) ? "b" : "l";
			else side = (cw > -ch) ? "r" : "t";

			// If the collided object is a jump pad
			if (obj.type === "jumpfield") {
				prisoner.dy = -jumpFieldSpeed;
			}
			// If the collidded object is a wall
			else if (obj.type === "wall") {
				if (side === "t") {
					prisoner.dy *= -bounce
					prisoner.sprite.position.y = oy - ph;
				}
				else if (side === "b") {
					prisoner.dy *= -1;
					prisoner.sprite.position.y = oy + oh;
				}
				else if (side === "l") {
					prisoner.dx *= -1;
					prisoner.sprite.position.x = ox - pw;
				}
				else {
					prisoner.dx *= -1;
					prisoner.sprite.position.x = ox + ow;
				}
			}
			// If the collided object is a stop 
			else if (obj.type === "stop") {
				currobj = obj;
				sdx = prisoner.dx;
				prisoner.dx = 0;
				// This is used to remove the sprite if you don't want to just change it
				// objectsContainer.removeChild(obj.sprite);
				delete objects[object];
				setTimeout(function() { prisoner.dx = sdx; currobj.sprite.texture = textures[currobj.secondTexture]; }, stopTime);
			}
			// Check if the prisoner has collided with the exit
			else if (obj.type === "exit") {
				console.log("exited!");
			}
		}

	}
}

// Functions used for moving 
function onDragStart(e)
{
	// Get current object being dragged
	for (obj in objects) {
		if (objects[obj].sprite === this) {
			currObj = obj;
		}
	}

	// Save the starting coordinates of the box
	if (e.data.global.x > mapWidth) {
		saveX = this.position.x;
		saveY = this.position.y;
	}
	
	this.diffX = e.data.global.x - this.position.x;
	this.diffY = e.data.global.y - this.position.y;
	this.data = e.data;
	this.dragging = true;
}

function onDragEnd() {
	this.dragging = false;
	this.data = null;
}

function onDragMove () {
	if (this.dragging) {

		move = this.data.getLocalPosition(this.parent);

		this.position.x = move.x - this.diffX;
		this.position.y = move.y - this.diffY;

		if (objects[currObj].type === "jumpfield" || objects[currObj].type === "stop") {
			for (obj in objects) {
				o = objects[obj];
				if (o.draggable) break;
				this.position.y = (move.y <= o.sprite.position.y + o.sprite.height && move.x > o.sprite.position.x && move.x < o.sprite.position.x + o.sprite.width) ? o.sprite.position.y - this.height : mapHeight - this.height;
			}
		}

		if (move.x > mapWidth) {
			this.position.x = saveX;
			this.position.y = saveY;
		}
		else {
			if (this.position.x < 0) this.position.x = 0;
			if (this.position.x + this.width > mapWidth) this.position.x = mapWidth-this.width;
			if (this.position.y < 0) this.position.y = 0;
			if (this.position.y + this.height > mapHeight) this.position.y = mapHeight-this.height;
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	if (playing) {
		updatePrisoner();
		checkPrisonerCollision();
	}
	renderer.render(stage);
}