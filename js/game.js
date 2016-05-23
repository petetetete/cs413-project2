// Set up some size variables for easy changing
var width = 1024, height = 576, mapWidth = 768, mapHeight = 576;

// Some global variables that can be adjusted
var gravity = .15, bounce = .4, jumpFieldSpeed = 8, stopTime = 2000, collisionBuffer = 0.5, screenChangeTime = 1000, easeType = createjs.Ease.quadInOut;

var currScreen;

var playing = false;

var screenLayouts;

var tutorialPhase = 0;

var freedPrisoners = [false, false, false];

// Object holding all of the game textures
var textures = {};

// Object to store backgrounds, not sure if they'll be relevant
var backgrounds = {};

// Object holding all of the game objects
// types:
//  - wall: just bounced off of
//  - jumpfield: field that will accelerate the player upwards
//  - exit: 
var objects = {};

// Object holding the prisoner and information about him
var prisoner = {};

var overlays = {};

// Object holding all text objects
var texts = {};

// Grab gameport from the html
var gameport = document.getElementById("gameport");

// Create and add renderer to the gameport
var renderer = new PIXI.autoDetectRenderer(width, height, {backgroundColor: 0x99D5FF});
gameport.appendChild(renderer.view);

// Create the main stage
var stage = new PIXI.Container();

// Create the container for each screen here
var introC = new PIXI.Container();
stage.addChildAt(introC,0);

var tutorialC = new PIXI.Container();
stage.addChildAt(tutorialC,1);

var mainMenu = new PIXI.Container();
stage.addChildAt(mainMenu,2);

var firstLC = new PIXI.Container();
stage.addChildAt(firstLC,3);

var secondLC = new PIXI.Container();
stage.addChildAt(secondLC,4);


// Ensure scaling doesn't caus anti-aliasing
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// PIXI.loader.add("sprites.json").load(ready);
PIXI.loader.add("assets/spritesheet.json").load(initTextures);

function initTextures() {
	// Add all textures to texture object
	textures["testBlack"] = PIXI.Texture.fromFrame("test-black.png");
	textures["testBlue"] = PIXI.Texture.fromFrame("test-blue.png");
	textures["testGrey"] = PIXI.Texture.fromFrame("test-grey.png");
	textures["testRed"] = PIXI.Texture.fromFrame("test-red.png");

	textures["intro"] = PIXI.Texture.fromFrame("intro.png");
	textures["blaine"] = PIXI.Texture.fromFrame("blaine.png");
	textures["jerry"] = PIXI.Texture.fromFrame("jerry.png");
	textures["mainmenu"] = PIXI.Texture.fromFrame("main-menu.png");
	textures["menuprisoner1"] = PIXI.Texture.fromFrame("menu-prisoner1.png");
	textures["prisoner1"] = PIXI.Texture.fromFrame("prisoner1.png");
	textures["textbubbleL"] = PIXI.Texture.fromFrame("textbubble-l.png");
	textures["textbubbleM"] = PIXI.Texture.fromFrame("textbubble-m.png");
	textures["textbubbleS"] = PIXI.Texture.fromFrame("textbubble-s.png");
	textures["black"] = PIXI.Texture.fromFrame("black.png");
	textures["jumppad"] = PIXI.Texture.fromFrame("jump-pad.png");
	textures["turn"] = PIXI.Texture.fromFrame("turn.png");
	textures["paper"] = PIXI.Texture.fromFrame("paper.png");
	textures["highlight"] = PIXI.Texture.fromFrame("highlight.png");

	drawScreen(0);
	animate();
}

function changeScreen(screenIndex) {
	direction = (currScreen < screenIndex) ? 1 : -1;
	createjs.Tween.get(stage.getChildAt(currScreen)).to({x:(-width*direction)}, screenChangeTime, easeType);
	stage.getChildAt(screenIndex).position.x = (width*direction);
	drawScreen(screenIndex);
	createjs.Tween.get(stage.getChildAt(screenIndex)).to({x:0}, screenChangeTime, easeType);
}

function drawScreen(screenIndex) {

	while(stage.getChildAt(screenIndex).children[0]) {
		stage.getChildAt(screenIndex).removeChild(stage.getChildAt(screenIndex).children[0]);
	}

	backgrounds = {};
	objects = {};
	prisoner = {};
	overlays = {};
	texts = {};

	currScreen = screenIndex;
	screen = stage.getChildAt(screenIndex);

	currBG = new PIXI.Container();
	screen.addChildAt(currBG,0);

	currObjs = new PIXI.Container();
	screen.addChildAt(currObjs,1);

	currPrisoner = new PIXI.Container();
	screen.addChildAt(currPrisoner,2);

	currOver = new PIXI.Container();
	screen.addChildAt(currOver,3);

	currTexts = new PIXI.Container();
	screen.addChildAt(currTexts,4);

	for (element in screenLayouts[screenIndex]) {
		elem = screenLayouts[screenIndex][element];
		console.log(elem);

		condition = (elem.conditional) ? eval(elem.conditional) : true;

		if (elem.type === "background" && condition) {
			backgrounds[element] = {"sprite": new PIXI.Sprite(textures[elem.texture])};
			if (elem.flipped) backgrounds[element].sprite.scale.x = -1;
			backgrounds[element].sprite.width = elem.width;
			backgrounds[element].sprite.height = elem.height;
			backgrounds[element].sprite.position.x = (elem.flipped) ? elem.x + elem.width : elem.x;
			backgrounds[element].sprite.position.y = elem.y;
			backgrounds[element].sprite.buttonMode = true;
			if (elem.target) {
				backgrounds[element].sprite["target"] = elem.target;
				backgrounds[element].sprite.interactive = true;
				backgrounds[element].sprite.on("mousedown", parseInput);
			}
			backgrounds[element].dx = elem.dx;
			backgrounds[element].dy = elem.dx;
			screen.getChildAt(0).addChild(backgrounds[element].sprite);
		}
		else if (elem.type === "object" && condition) {
			objects[element] = {"sprite": new PIXI.Sprite(textures[elem.texture])};
			if (elem.secondTexture) objects[element].secondTexture = elem.secondTexture;
			if (elem.flipped) objects[element].sprite.scale.x = -1;
			objects[element].sprite.width = elem.width;
			objects[element].sprite.height = elem.height;
			objects[element].sprite.position.x = (elem.flipped) ? elem.x + elem.width : elem.x;
			objects[element].sprite.position.y = elem.y;
			objects[element].sprite.buttonMode = true;
			if (elem.target) {
				objects[element].sprite["target"] = elem.target;
				objects[element].sprite.interactive = true;
				objects[element].sprite.on("mousedown", parseInput);
			}
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
		else if (elem.type === "prisoner" && condition) {
			prisoner.sprite = new PIXI.Sprite(textures[elem.texture]);
			if (elem.flipped) prisoner.sprite.scale.x = -1;
			prisoner.sprite.width = elem.width;
			prisoner.sprite.height = elem.height;
			prisoner.sprite.position.x = (elem.flipped) ? elem.x + elem.width : elem.x;
			prisoner.sprite.position.y = elem.y;
			prisoner.sprite.buttonMode = true;
			if (elem.target) {
				prisoner.sprite["target"] = elem.target;
				prisoner.sprite.interactive = true;
				prisoner.sprite.on("mousedown", parseInput);
			}
			prisoner.dx = elem.dx;
			prisoner.dy = elem.dy;
			screen.addChildAt(prisoner.sprite,2);
		}
		else if (elem.type === "over" && condition) {
			overlays[element] = {"sprite": new PIXI.Sprite(textures[elem.texture])};
			if (elem.flipped) overlays[element].sprite.scale.x = -1;
			overlays[element].sprite.width = elem.width;
			overlays[element].sprite.height = elem.height;
			overlays[element].sprite.position.x = (elem.flipped) ? elem.x + elem.width : elem.x;
			overlays[element].sprite.position.y = elem.y;
			overlays[element].sprite.buttonMode = true;
			if (elem.alpha) overlays[element].sprite.alpha = elem.alpha;
			if (elem.target) {
				overlays[element].sprite["target"] = elem.target;
				overlays[element].sprite.interactive = true;
				overlays[element].sprite.on("mousedown", parseInput);
			}
			screen.getChildAt(3).addChild(overlays[element].sprite);
		}
		else if (elem.type === "text") {
			condition = (elem.conditional) ? eval(elem.conditional) : true;

			if (condition) {
				ww = (elem.wordWrap) ? true : false;
				wwww = (elem.wordWrap) ? elem.wordWrap : 0;
				lh = (elem.lineHeight) ? elem.lineHeight : 0;
				texts[element] = {"text": new PIXI.Text(elem.text,{font: elem.font, fill: elem.color, align : elem.align, wordWrap: ww, wordWrapWidth: wwww, lineHeight: lh })};
				if (elem.width) texts[element].text.width = elem.width;
				if (elem.height) texts[element].text.height = elem.height;
				texts[element].text.position.x = elem.x;
				texts[element].text.position.y = elem.y;
				screen.getChildAt(4).addChild(texts[element].text);
			}
		}
	}
}

function parseInput() {
	eval(this.target);
}

function progressTutorial() {
	++tutorialPhase;
	drawScreen(currScreen);
}

function resetPrisoner() {
	playing = false;
	drawScreen(currScreen);
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
				freedPrisoners[currScreen-3] = true;
				playing = false;
				console.log("victory");
				setTimeout(function() { changeScreen(2) }, 2000);
			}
			// Check if the prisoner hit a guard
			else if (obj.type === "guard") {
				console.log("oops");
				resetPrisoner();
			}
			// Check if the prisoner hit a turn around
			else if (obj.type === "turn") {
				prisoner.dx *= -1;
				obj.sprite.texture = textures[obj.secondTexture];
				delete objects[object];
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
	this.dragging = !playing;
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
				if (move.y <= o.sprite.position.y + o.sprite.height && move.x > o.sprite.position.x && move.x < o.sprite.position.x + o.sprite.width && !(o.draggable || o.type === "guard")) {
					this.position.y = o.sprite.position.y - this.height;
					break;
				}
				else {
					this.position.y = mapHeight - this.height
				}
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