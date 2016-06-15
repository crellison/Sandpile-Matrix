// "use strict";
var _=require('underscore');
var program = require('commander');

// window.sandpile = window.sandpile || {};
var sandpile = {};

function pause(time) {
	var now = Date.now()
	while(Date.now()<now+time) {}
	return
}

// ****************************************************************

sandpile.Graph = function(dim) {
	this.var = {};
	this.dim = dim // graph has fixed upper dim for matrix use
};

sandpile.Graph.prototype = {
	addVertex: function(vertex) {
		if (vertex<this.dim*this.dim){this.var[vertex] = [];}
	},
	addEdge: function(v1,v2) { // assumes v1,v2 in the object
		if (this.var[v1].indexOf(v2)===-1){
			if (v1!==v2) {
				this.var[v2].push(v1);
				this.var[v1].push(v2);
			}
		}
	},
	elimVertex: function(vertex) {
		delete this.var[vertex];
		for (var i in Object.keys(this.var)) {
			var elt = Object.keys(this.var)[i];
			var index = this.var[elt].indexOf(vertex);
			if (index!==-1) {this.var[elt].splice(index,1);}
		}
	},
	elimEdge: function(v1,v2) {
		if (this.hasEdge(v1,v2)) {
			var index = this.var[v1].indexOf(v2);
			this.var[v1].splice(index,1);
			index = this.var[v2].indexOf(v1);
			this.var[v2].splice(index,1);
		}		
	},
	hasEdge: function(v1,v2) {
		return this.var[v1].indexOf(v2)!==-1;
	},
	hasVertex: function(vertex) {
		return !_.isUndefined(this.var[vertex]);
	},
	listVertex: function() {
		return Object.keys(this.var);
	},
	listAdjacent: function(vertex) {
		return this.var[vertex];
	}
}

// ****************************************************************

sandpile.ColorGraph = function(dim) {
	this.graph = new sandpile.Graph(dim);
	this.colors = new Array(dim*dim);
}

sandpile.ColorGraph.prototype = {
	addVertex: function(vertex) {
		this.graph.addVertex(vertex);
		this.colors[vertex] = 0
	},
	elimVertex: function(vertex) {
		this.graph.elimVertex(vertex);
		this.colors[vertex] = 0;
	},
	addEdge: function(v1,v2) {
		this.graph.addEdge(v1,v2);
	},
	elimEdge: function(v1,v2) {
		this.graph.elimEdge(v1,v2);
	},
	canColor: function(vertex,color) {
		var adjacents  = this.graph.listAdjacent(vertex);
		var can = true;
		for (var i  in adjacents) {
			can = can && (this.getColor(adjacents[i]) != color);
		}
		return can;
	},
	putColor: function(vertex,color) {
		if (this.canColor(vertex,color)) {
			this.colors[vertex] = color;
			return true;
		} return false;
	},
	forceColor: function(vertex,color) {
		this.colors[vertex] = color;
	},
	getColor: function(vertex) {
		return this.colors[vertex];
	},
	colorList: function() {
		return this.colors;
	},
	listAdjacent: function(vertex) {
		return this.graph.listAdjacent(vertex);
	},
	printMatrixAscii: function() {
		var dim = this.graph.dim;
		for (var i = 0; i < dim; i++) {
			var temp = this.colors.slice(dim*i,dim*i+dim)
			_.forEach(temp, function(elt,index) {
				switch (elt){
					case 0:
						temp[index] = ' ';
						break;
					case 1:
						temp[index] = '.';
						break;
					case 2:
						temp[index] = '*';
						break;
					case 3:
						temp[index] = '&';
						break;
					default:
						temp[index] = String.fromCharCode(9608);
					// temp[index] = String.fromCharCode(1244);
				}
			})
			console.log(temp.join(' '));
		}
		pause(70);
	},
	printMatrix: function() {
		var dim = this.graph.dim;
		for (var i = 0; i < dim; i++) {
			console.log(this.colors.slice(dim*i,dim*i+dim).join(' '))
		}
	}
}

// ****************************************************************

sandpile.Pile = function(dim) {
	this.pile = new sandpile.ColorGraph(dim);
	for (var i=0; i<dim*dim; i++) {
		this.pile.addVertex(i);
	}
	this.dim = dim;
	this.steps = 0;
}

sandpile.Pile.prototype = {
	connectGraph: function() {
		var count = 0;
		var dim = this.dim
		for (var i=0; i<(dim*dim); i++) {
			if (i>=dim) { // north
				this.pile.addEdge(i,i-dim);
			}
			if (i<dim) { // south
				this.pile.addEdge(i,i+dim);
			}
			if (i%dim!=dim-1) { // east
				this.pile.addEdge(i,i+1);
			}
			if (i%dim!=0) { // west
				this.pile.addEdge(i,i-1);
			}
		}
	},
	isStable: function() {
		for (var i=0; i<(this.dim*this.dim); i++) {
			if (this.pile.getColor(i)>=4) {return false;}
		} return true
	},
	spreadGrains: function(vertex) {
		var adjacent = this.listAdjacent(vertex)
		this.forceColor(vertex,this.getColor(vertex)-adjacent.length);
		for (var i in adjacent) {
			this.forceColor(adjacent[i],this.getColor(adjacent[i])+1);
		}
	},
	spreadGrainsNoBorder: function(vertex) {
		var adjacent = this.listAdjacent(vertex);
		this.forceColor(vertex,this.getColor(vertex)-4);
		for (var i in adjacent) {
			this.forceColor(adjacent[i],this.getColor(adjacent[i])+1);
		}
	},
	stepPile: function(vertex,bool) { // true==border false==no border
		if (this.getColor(vertex)>=4) {
			if (!bool) {
				this.spreadGrainsNoBorder(vertex);
			} else {
				this.spreadGrains(vertex);
			}
		}
	},
	fullStepPile: function(bool) { // true==border false==no border
		for (var i = 0; i < this.dim*this.dim; i++) {
			this.stepPile(i,bool);
		}
		this.steps++
	},
	stabilizePile: function(bool,logType) { // true==border false==no border
		while (!this.isStable()) {
			this.fullStepPile(bool);
			if (!_.isUndefined(logType)) {this.consoleLog(logType);}
			// console.log(this.steps)
			// if (this.steps===10000) {break}
		}
	},
	centerColumn: function(num) {
		this.pile.putColor(this.dim*(this.dim/2)+this.dim/2,num);
	},
	trumpWall: function(num) {
		for (var i = this.dim*Math.floor(this.dim/2); i < this.dim*Math.floor(this.dim/2)+this.dim; i++) {
			this.forceColor(i,num);
		}
	},
	xmen: function(num) {
		for (var i = 0; i < this.dim; i++) {
			this.forceColor(i+i*this.dim,num);
			this.forceColor(this.dim-i-1+i*this.dim,num);
		}
	},
	// functions passed up to Pile object
	consoleLog: function(bool) {
		console.log("\033[H\033[2J");
		console.log('Current steps: '+this.steps);
		if (bool) {this.pile.printMatrixAscii();}
		// else {this.pile.printMatrix();}
	},
	clear: function() {
		for (var i = 0; i < this.dim*this.dim; i++) {
			this.forceColor(i,0);
		}
	},
	addVertex: function(vertex) {
		this.pile.addVertex(vertex);
	},
	elimVertex: function(vertex) {
		this.pile.elimVertex(vertex);
	},
	addEdge: function(v1,v2) {
		this.pile.addEdge(v1,v2);
	},
	elimEdge: function(v1,v2) {
		this.pile.elimEdge(v1,v2);
	},
	canColor: function(vertex,color) {
		return this.pile.canColor(vertex,color);
	},
	putColor: function(vertex,color) {
		this.pile.putColor(vertex,color);
	},
	forceColor: function(vertex,color) {
		this.pile.forceColor(vertex,color);
	},
	getColor: function(vertex) {
		return this.pile.getColor(vertex);
	},
	colorList: function() {
		return this.pile.colorList();
	},
	listAdjacent: function(vertex) {
		return this.pile.listAdjacent(vertex);
	}
}

// ****************************************************************
var presetInfo = '\t1: center column (default) - single stack of grains on the center of the sandpile\
				\n\t2: trump wall - stacks of grains in a wall across the central horizontal axis\
				\n\t3: xmen - two diagonal walls of grains connecting the opposing corners\n'
program
 	.option('-d, --dim <n>', 'Specify dimension of sandpile (default 50)', parseInt)
 	.option('-p, --preset <n>', 'Specify preset map\n\n'+presetInfo, parseInt)
 	.option('-h, --height <n>', 'Specify height of preset', parseInt)
 	.option('-c, --consolelog <n>', 'Specify whether or not to print in the console (accepts 1 or 0)', parseInt)
 	.option('-b, --border <n>', 'Specify whether or not grains can fall of the edge (accepts 1 or 0)', parseInt);
program.parse(process.argv);

if (process.argv.length === 2) {
  program.help();
} else {
	main()
}

function main() {
	if (!program.dim) {console.log('No dim specified, default of 50 used')}
	if (!program.preset) {console.log('No preset specified, default of center column used')}
	if (!program.height) {console.log('No height specified, default of 50 used')}
	if (!program.consolelog) {console.log('Log status uspecified, default of no log used')}
	if (!program.border) {console.log('Border status uspecified, default of open used')}
	var dim = program.dim || 50
	var preset = program.preset || 1
	var height = program.height || 50
	var consolelog = program.consolelog || 0
	var border = program.border || 0
	var pile = new sandpile.Pile(dim)
	pile.connectGraph()
	switch (preset) {
		case 1: pile.centerColumn(height)
			break 
		case 2: pile.trumpWall(height)
			break
		case 3: pile.xmen(height)
			break
	}
	pile.stabilizePile(border,consolelog)
	pile.consoleLog(true)
}

// // 9608
// var graph = new sandpile.Pile(140);
// graph.connectGraph()
// // graph.centerColumn(80000)
// graph.xmen(800)
// // graph.trumpWall(800)
// // graph.consoleLog();
// graph.stabilizePile(true); // w/o border
// // graph.stabilizePile(false); // w/ border
// graph.consoleLog(true);





