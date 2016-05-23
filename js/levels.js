// Y is actually how much up off of the ground excluding object height
// As it stands screen 0 is level 1 but this should be changed later
var screenLayouts = {
	// Intro Page
	0: {
		"background1": {
			"type": "background",
			"x": 0,
			"y": 0,
			"width": 1024,
			"height": 576,
			"texture": "intro",
			"target": "changeScreen(1)",
		},
		"continue": {
			"type": "text",
			"x": 830,
			"y": 540,
			"text": "click to continue",
			"font": "24px Arial",
			"align": "center",
			"color": "#ff0000",
		},
	},
	// Tutorial Page
	1: {
		"background": {
			"type": "background",
			"x": 0,
			"y": 0,
			"width": 1024,
			"height": 576,
			"texture": "testBlue",
		},
		"background1": {
			"type": "background",
			"x": 0,
			"y": 0,
			"width": 768,
			"height": 576,
			"texture": "testRed",
		},
		"prisoner": {
			"type": "prisoner",
			"x": 10,
			"y": 476,
			"dx": 2.5,
			"dy": 0,
			"width": 50,
			"height": 100,
			"texture": "testBlack",
		},
		"wall1": {
			"type": "object",
			"subtype": "wall",
			"x": 468,
			"y": 370,
			"dx": 0,
			"dy": 0,
			"width": 300,
			"height": 50,
			"texture": "testGrey",
			"draggable": false,
		},
		"shading": {
			"type": "over",
			"x": 0,
			"y": 0,
			"width": 1024,
			"height": 576,
			"alpha": 0.5,
			"texture": "black",
			"conditional": "tutorialPhase >= 0 && tutorialPhase <= 5",
		},
		"tutorialshading": {
			"type": "over",
			"x": 0,
			"y": 0,
			"width": 768,
			"height": 576,
			"alpha": 0.5,
			"texture": "black",
			"conditional": "tutorialPhase === 6",
		},
		"jerry": {
			"type": "over",
			"x": 864,
			"y": 416,
			"width": 140,
			"height": 140,
			"flipped": true,
			"delay": 1000,
			"texture": "jerry",
			"conditional": "tutorialPhase === 0",
		},
		"jerrybubble1": {
			"type": "over",
			"x": 152,
			"y": 416,
			"width": 336,
			"height": 140,
			"texture": "textbubbleS",
			"target": "progressTutorial()",
			"conditional": "tutorialPhase === 0",
		},
		"jerryyes": {
			"type": "text",
			"x": 175,
			"y": 456,
			"text": "Ugh, let's get this over with.",
			"wordWrap": 300,
			"font": "24px Arial",
			"align": "center",
			"color": "#000",
			"target": "startTutorial()",
			"conditional": "tutorialPhase === 0",
		},
		"jerrybubble2": {
			"type": "over",
			"x": 508,
			"y": 416,
			"width": 336,
			"height": 140,
			"texture": "textbubbleS",
			"target": "changeScreen(2)",
			"conditional": "tutorialPhase === 0",
		},
		"jerryno": {
			"type": "text",
			"x": 548,
			"y": 446,
			"text": "No way man, I'm sick of this.",
			"wordWrap": 300,
			"font": "24px Arial",
			"align": "center",
			"color": "#000",
			"conditional": "tutorialPhase === 0",
		},
		"supervisor": {
			"type": "over",
			"x": 20,
			"y": 20,
			"width": 140,
			"height": 140,
			"flipped": true,
			"texture": "blaine",
			"conditional": "tutorialPhase === 0 || tutorialPhase === 6",
		},
		"superbubble": {
			"type": "over",
			"x": 160,
			"y": 20,
			"width": 824,
			"height": 140,
			"flipped": true,
			"texture": "textbubbleL",
			"conditional": "tutorialPhase === 0",
		},
		"superwords": {
			"type": "text",
			"x": 210,
			"y": 60,
			"text": "Blaine (Supervisor): Hey there bud, you ready for our weekly training session? (Would you like to play the tutorial?)",
			"wordWrap": 800,
			"font": "24px Arial",
			"align": "center",
			"color": "#000",
			"conditional": "tutorialPhase === 0",
		},
		"paper": {
			"type": "over",
			"x": 256,
			"y": 8,
			"width": 512,
			"height": 560,
			"texture": "paper",
			"target": "progressTutorial()",
			"conditional": "tutorialPhase >= 1 && tutorialPhase <= 5",
		},
		"diarytitle": {
			"type": "text",
			"x": 350,
			"y": 70,
			"text": "Jerry's Diary",
			"font": "24px Arial",
			"align": "left",
			"color": "#000",
			"conditional": "tutorialPhase >= 1 && tutorialPhase <= 5",
		},
		"diarytext": {
			"type": "text",
			"x": 350,
			"y": 125,
			"text": "Day 1: So I got a job today at the local prison and it may not be the most glamorous job, but a paycheck's a paycheck, am'i'rite?",
			"font": "24px Arial",
			"wordWrap": 400,
			"lineHeight": 64,
			"align": "left",
			"color": "#000",
			"conditional": "tutorialPhase === 1",
		},
		"diarytext2": {
			"type": "text",
			"x": 350,
			"y": 125,
			"text": "Day 3: So today I had to clean up after a massive riot, the entire mess hall was ruined and my supervisor, Blaine, just handed me a mop and said 'get to it bud'. God I hate when he calls me bud.",
			"font": "24px Arial",
			"wordWrap": 400,
			"lineHeight": 64,
			"align": "left",
			"color": "#000",
			"conditional": "tutorialPhase === 2",
		},
		"diarytext3": {
			"type": "text",
			"x": 350,
			"y": 125,
			"text": "Day 13: So I may have been incorrect diary, the things I have to do for a paycheck here are either so extremely boring or so extremely tedious that the paycheck may not be #worth.",
			"font": "24px Arial",
			"wordWrap": 400,
			"lineHeight": 64,
			"align": "left",
			"color": "#000",
			"conditional": "tutorialPhase === 3",
		},
		"diarytext4": {
			"type": "text",
			"x": 350,
			"y": 125,
			"text": "Day 69: THAT'S IT, I CAN'T STAND IT ANYMORE. I'M DONE HERE, I AM CONVINCED I AM STUCK IN AN ETERNAL PURGATORY IN THE FORM OF ORANGE JUMPSUITS AND MEATLOAF MONDAY. WHO EATS MEATLOAF.",
			"font": "24px Arial",
			"wordWrap": 400,
			"lineHeight": 64,
			"align": "left",
			"color": "#000",
			"conditional": "tutorialPhase === 4",
		},
		"diarytext5": {
			"type": "text",
			"x": 350,
			"y": 125,
			"text": "Day 73: So turns out there's a prison policy that employees may only resign at the end of every quarter. The next being in 4 months... Whelp, time to get fired!",
			"font": "24px Arial",
			"wordWrap": 400,
			"lineHeight": 64,
			"align": "left",
			"color": "#000",
			"conditional": "tutorialPhase === 5",
		},
		"tutorialbubble": {
			"type": "over",
			"x": 160,
			"y": 20,
			"width": 520,
			"height": 140,
			"flipped": true,
			"texture": "textbubbleM",
			"conditional": "tutorialPhase === 6",
		},
		"tutorialwords": {
			"type": "text",
			"x": 210,
			"y": 45,
			"text": "Blaine: So just a reminder, we have a new shipment of various doo-hickeys over here that the prisoners may use to escape.",
			"wordWrap": 480,
			"font": "24px Arial",
			"align": "center",
			"color": "#000",
			"conditional": "tutorialPhase === 6",
		},
		"jumpy": {
			"type": "object",
			"subtype": "jumpfield",
			"x": 800,
			"y": 50,
			"dx": 0,
			"dy": 0,
			"width": 50,
			"height": 25,
			"texture": "testGrey",
			"draggable": true,
			"conditional": "tutorialPhase === 6",
		},
		"itemhighlight": {
			"type": "over",
			"x": 768,
			"y": 0,
			"width": 256,
			"height": 576,
			"texture": "highlight",
			"conditional": "tutorialPhase === 6",
		},
	},
	// Main Menu
	2: {
		"prisoner1": {
			"type": "background",
			"x": 72,
			"y": 48,
			"width": 240,
			"height": 368,
			"texture": "menuprisoner1",
			"target": "changeScreen(3)",
			"conditional": "freedPrisoners[0] === false"
		},
		"background": {
			"type": "background",
			"x": 0,
			"y": 0,
			"width": 1024,
			"height": 576,
			"texture": "mainmenu",
		},
		"mainmenutext": {
			"type": "text",
			"x": 50,
			"y": 520,
			"text": "Select a prisoner to free",
			"font": "24px Arial",
			"align": "center",
			"color": "#000",
		},
	},
	// Level 1
	3: {
		"background": {
			"type": "background",
			"x": 0,
			"y": 0,
			"width": 768,
			"height": 576,
			"texture": "testRed"
		},
		"playbutton": {
			"type": "background",
			"x": 778,
			"y": 453,
			"width": 113,
			"height": 113,
			"texture": "testRed",
			"target": "startPrisoner()",
		},
		"resetbutton": {
			"type": "background",
			"x": 901,
			"y": 453,
			"width": 113,
			"height": 113,
			"texture": "testRed",
			"target": "resetPrisoner()",
		},
		"prisoner": {
			"type": "prisoner",
			"x": 10,
			"y": 476,
			"dx": 2.5,
			"dy": 0,
			"width": 36,
			"height": 100,
			"texture": "prisoner1",
		},
		"wall1": {
			"type": "object",
			"subtype": "wall",
			"x": 468,
			"y": 370,
			"dx": 0,
			"dy": 0,
			"width": 300,
			"height": 50,
			"texture": "testGrey",
			"draggable": false
		},
		"wall2": {
			"type": "object",
			"subtype": "wall",
			"x": 0,
			"y": 320,
			"dx": 0,
			"dy": 0,
			"width": 300,
			"height": 50,
			"texture": "testGrey",
			"draggable": false
		},
		"enemy": {
			"type": "object",
			"subtype": "guard",
			"x": 600,
			"y": 476,
			"width": 50,
			"height": 100,
			"texture": "testGrey",
			"draggable": false
		},
		"jumpy": {
			"type": "object",
			"subtype": "jumpfield",
			"x": 788,
			"y": 20,
			"dx": 0,
			"dy": 0,
			"width": 52,
			"height": 24,
			"texture": "jumppad",
			"secondTexture": "testBlue",
			"draggable": true
		},
		"turn": {
			"type": "object",
			"subtype": "turn",
			"x": 850,
			"y": 20,
			"dx": 0,
			"dy": 0,
			"width": 52,
			"height": 52,
			"texture": "turn",
			"secondTexture": "testBlue",
			"draggable": true
		},
		"stop": {
			"type": "object",
			"subtype": "stop",
			"x": 950,
			"y": 50,
			"dx": 0,
			"dy": 0,
			"width": 50,
			"height": 25,
			"texture": "testGrey",
			"secondTexture": "testBlue",
			"draggable": true,
		},
		"victory": {
			"type": "object",
			"subtype": "exit",
			"x": 718,
			"y": 270,
			"dx": 0,
			"dy": 0,
			"width": 50,
			"height": 100,
			"texture": "testGrey",
			"secondTexture": "testBlue",
			"draggable": false
		},
	},
	// Level 2
	4: {
		"background": {
			"type": "background",
			"x": 0,
			"y": 0,
			"width": 768,
			"height": 576,
			"texture": "testRed"
		},
		"prisoner": {
			"type": "prisoner",
			"x": 10,
			"y": 476,
			"dx": 2.5,
			"dy": 0,
			"width": 50,
			"height": 100,
			"texture": "testBlack",
		},
		"wall1": {
			"type": "object",
			"subtype": "wall",
			"x": 468,
			"y": 370,
			"dx": 0,
			"dy": 0,
			"width": 300,
			"height": 50,
			"texture": "testGrey",
			"draggable": false
		},
	}
}