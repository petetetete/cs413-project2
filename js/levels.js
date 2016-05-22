// Y is actually how much up off of the ground excluding object height
// As it stands screen 0 is level 1 but this should be changed later
var screenLayouts = {
	// Level 1
	0: {
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
			"y": 450,
			"dx": 2,
			"dy": 0,
			"width": 50,
			"height": 100,
			"texture": "testBlack",
		},
		"wall1": {
			"type": "object",
			"subtype": "wall",
			"x": 468,
			"y": 320,
			"dx": 0,
			"dy": 0,
			"width": 300,
			"height": 50,
			"texture": "testGrey",
			"draggable": false
		},
		"jumpy": {
			"type": "object",
			"subtype": "jumpfield",
			"x": 300,
			"y": 551,
			"dx": 0,
			"dy": 0,
			"width": 50,
			"height": 25,
			"texture": "testGrey",
			"draggable": true
		},
	}
}