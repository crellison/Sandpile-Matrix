"use strict";
var _=require('underscore');

// window.sandpile = window.sandpile || {};
var sandpile = {};

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
var graph = new sandpile.Graph(10);
graph.addVertex(3);
graph.addVertex(4);
graph.addVertex(2);
graph.addVertex(1);
console.log(graph.listVertex());
graph.addEdge(3,4);
graph.addEdge(3,1);
graph.addEdge(3,3);
console.log(graph.listAdjacent(3));
graph.elimEdge(3,1);
console.log(graph.listAdjacent(3));
graph.elimVertex(3);
console.log(graph.listAdjacent(4));
graph.elimVertex(1);
graph.addVertex(120)
console.log(graph.listVertex());
console.log(graph.listAdjacent(4));