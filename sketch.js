

let boardW = boardH = 15;
let tileSize = 50;
let board = []

function openInfo() {
	document.getElementById("infoPanelBackground").style.display = "block";
}

function closeInfo() {
	document.getElementById("infoPanelBackground").style.display = "none";
}

var database;

function prepareDatabase() {
	let firebaseConfig = {
    apiKey: "AIzaSyCxEVHzCVKb5os-S0-j1J5wktPb2Xsmef0",
    authDomain: "scrabble-b3706.firebaseapp.com",
    databaseURL: "https://scrabble-b3706-default-rtdb.firebaseio.com",
    projectId: "scrabble-b3706",
    storageBucket: "scrabble-b3706.appspot.com",
    messagingSenderId: "439947163445",
    appId: "1:439947163445:web:14bad3ec5c0742b198fe7c",
    measurementId: "G-M083FYRGTZ"
  };
	// Initialize Firebase
	let f = firebase;
	f.initializeApp(firebaseConfig);
	database = f.database();
	console.log(database);
}

function getData() {
	let path = "/";
	let ref = database.ref(path);
	let d = null;
	ref.once("value", function(data) {
		data = data.val();
		console.log(data);
		if (data != null) {
			count = data["count"];
			scores = data["scores"];

			let w = "<tr>";
			for (let key in count) {
				w += "<td>" + key + "</td><td>" + count[key] + "</td><td>" + scores[key] + "</td>";
				w += "</tr>\n";
			}
			document.getElementById("table").innerHTML += w;
		}

		resizeUserPanelTable();
		setTimeout(function() {document.getElementById("loaderBackground").style.display = "none";}, 10);
	}, function(error) { console.log(error)});
}

function resizeBoard() {
	let paddingTop = 40;
	let boardBorder = 5;
	let boardPadding = 30;

	let userPanelW;
	let between = 40;

	let H = Math.min(document.getElementById("background").clientHeight, 
		document.getElementById("background").clientWidth);

	let allH = H - paddingTop * 2 - boardBorder * 2;
	userPanelW = allH * 0.4;
	document.getElementById("gameZone").style.height = String(allH + boardBorder * 2) + "px";
	document.getElementById("gameZone").style.width = String(allH + boardBorder * 2 + userPanelW + between) + "px";
	tileSize = (allH - boardPadding * 2) / boardH;
	console.log(tileSize);
	let w = String(allH); let h = String(allH);
	document.getElementById("board").style.border = String(boardBorder) + "px solid white";
	document.getElementById("board").style.width =  w;
	document.getElementById("board").style.height = h;

	document.getElementById("userPanel").style.height = h;
	document.getElementById("userPanel").style.width = userPanelW;

	let k = 0.9;
	let border = (1 - k) / 2 * tileSize;

	let whiteRect = document.createElement("div");
	whiteRect.style.backgroundColor = "white";
	whiteRect.style.width = allH - boardPadding * 2 + border * 2;
	whiteRect.style.height = allH - boardPadding * 2 + border * 2;
	whiteRect.style.position = "absolute";
	whiteRect.style.top = String(boardPadding - border) + "px";
	whiteRect.style.left = String(boardPadding - border) + "px";
	document.getElementById("board").innerHTML += whiteRect.outerHTML;


	for (let i = 0; i < boardH; i++) {
		board.push([]);
		for (let j = 0; j < boardW; j++) {
			let button = document.createElement("div");
			button.className = "cell";
			let y = i * tileSize + boardPadding + border; let x = j * tileSize + boardPadding + border;
			button.style.top = String(y) + "px";
			button.style.left = String(x) + "px";
			button.style.width = String(tileSize * k) + "px";
			button.style.paddingBottom = String(tileSize * k) + "px";
			button.id = String(i) + " " + String(j) + " tile";

			document.getElementById("board").innerHTML += button.outerHTML;
			board[i].push(button);
		}
	}
}

function colorBoard() {
	/*
	
	W - triple word
	w - double word
	L - triple letter
	l - double letter

	*/
	let special_tiles = [
	    'W  l   W   l  W',
	    ' w   L   L   w ',
	    '  w   l l   w  ',
	    'l  w   l   w  l',
	    '    w     w    ',
	    ' L   L   L   L ',
	    '  l   l l   l  ',
	    'W  l   *   l  W',
	    '  l   l l   l  ',
	    ' L   L   L   L ',
	    '    w     w    ',
	    'l  w   l   w  l',
	    '  w   l l   w  ',
	    ' w   L   L   w ',
	    'W  l   W   l  W',
	]

	for (let i = 0; i < boardH; i++) {
		for (let j = 0; j < boardW; j++) {
			let ch = special_tiles[i][j];
			let tile = board[i][j].id; let col = "";
			if (ch == 'W') col = "#DC143C";
			if (ch == 'w') col = "#FF7F50";
			if (ch == 'L') col = '#32CD32';
			if (ch == 'l') col = '#00FA9A';
			if (col != "") document.getElementById(tile).style.backgroundColor = col;
		}
	}
}

function resizeUserPanelTable() {
	let t = document.getElementById("tileTable");
	var testElements = [t];
	var testDivs = Array.prototype.filter.call(testElements, function(testElement){
	    return testElement.nodeName === 'TABLE';
	});
	console.log(testDivs);
	testDivs = t.getElementsByTagName("TD");
	console.log(testDivs);

	for (let i = 0; i < testDivs.length; i++) {
		e = testDivs[i];
		console.log(e);
		let id = e.id;
		let w = e.clientWidth;
		console.log("w", w);
		e.style.height = w;
		let col;
		if (i == 3) col = "#DC143C";
		if (i == 2) col = "#FF7F50";
		if (i == 1) col = '#32CD32';
		if (i == 0) col = '#00FA9A';
		e.style.backgroundColor = col;
		//document.getElementById(id) = e;
	}

	t = document.getElementById("table");
	testElements = [t];
	testDivs = Array.prototype.filter.call(testElements, function(testElement){
	    return testElement.nodeName === 'TABLE';
	});
	console.log("test divvvs", testDivs);
	testDivs = t.getElementsByTagName("TD");
	console.log("td", testDivs);

	let w = ""; let tr;
	for (let i = 0; i < testDivs.length; i += 1) {
		if (i % 3 == 0 && i % 2 == 1) {
			document.getElementById("newTable").appendChild(tr);
			tr = document.createElement("tr");
		}
		if (i % 6 == 0) {
			tr = document.createElement("tr");
		}
		e = testDivs[i];
		let val = e.innerHTML;
		//console.log(val);
		countInput = document.createElement("input");
		countInput.type = "number";
		countInput.value = val;
		countInput.min = 0; countInput.max = 15;
		countInput.style.width = e.style.width;

		let td = document.createElement("td");

		if (!((val >= 'А' && val <= 'Я') || (val == '?') || (val == 'Ё'))) {
			console.log(val, "-->");
			td.appendChild(countInput);
			tr.appendChild(td);
		}
		else {
			td.innerHTML = val;
			tr.appendChild(td);
		}
	}
	console.log(w);
	console.log(testDivs.length);
}

function scrollUp() {
	let rootElement = document.getElementById("gameInfoBox");
	rootElement.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

function correctTable() {
	document.getElementById("tablePanelBackground").style.display = "block";
}

function closeTablePanel() {
	document.getElementById("tablePanelBackground").style.display = "none";
}

window.onload = function() {
	console.log("onload");
	resizeBoard();
	colorBoard();
	prepareDatabase();
	getData();
}

window.beforeunload = function() {
	return true;
}

window.unload = function() {
	return true;
}
