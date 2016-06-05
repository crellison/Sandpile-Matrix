"use strict";
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
		this.var[v1].push(v2);
		if (v1!==v2) {this.var[v2].push(v1);}
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
	this.colors = Array.apply(null, new Array(dim*dim)).map(Number.prototype.valueOf,0);
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
	printMatrix: function() {
		var dim = this.graph.dim;
		for (var i = 0; i < dim; i++) {
			console.log(this.colors.slice(dim*i,dim*i+dim).join(' '))
		}
	}
}
var graph = new sandpile.ColorGraph(10);
graph.addVertex(3);
graph.addVertex(4);
graph.addVertex(2);
graph.addVertex(1);
graph.printMatrix()

