// "use strict";
var _=require('underscore');

// window.sandpile = window.sandpile || {};
var sandpile = {};

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
	spreadGrainsBorder: function(vertex) {
		var adjacent = this.listAdjacent(vertex);
		this.forceColor(vertex,this.getColor(vertex)-4);
		for (var i in adjacent) {
			this.forceColor(adjacent[i],this.getColor(adjacent[i])+1);
		}
	},
	stepPile: function(vertex,bool) { // true==border false==no border
		if (this.getColor(vertex)>=4) {
			if (bool===true) {
				this.spreadGrainsBorder(vertex);
			} else {
				this.spreadGrains(vertex);
			}
		}
	},
	fullStepPile: function(bool) { // true==border false==no border
		for (var i = 0; i < this.dim*this.dim; i++) {
			this.stepPile(i,bool);
		}
	},
	stabilizePile: function(bool) { // true==border false==no border
		while (!this.isStable()) {
			this.fullStepPile(bool);
			this.consoleLog()
		}
	},
	// functions passed up to Pile object
	consoleLog: function() {
		console.log("\033[H\033[2J");
		this.pile.printMatrix();
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

var graph = new sandpile.Pile(10);
graph.connectGraph()
console.log(graph.pile.listAdjacent(32))
graph.putColor(55,200);
graph.consoleLog();
graph.stabilizePile(false);
// graph.spreadGrains(55);
// graph.consoleLog();


