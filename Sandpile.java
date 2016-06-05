// Cole Ellison
// Sandpile Object

import java.util.HashMap;
import java.util.HashSet;
import java.util.ArrayList;

public class Sandpile {
	
	private ColorGraph pile;
	private int dim;
	private int steps; 

	// grains fall when color value reaches/exceeds stackHeight
	static public final int stackHeight = 4;

	// constructor and helper method
	public Sandpile(int size) {
		dim = size;
		steps = 0;
		pile = new ColorGraph();
		for (int i=0; i<dim*dim; i++) {
			pile.addVertex(i);
			pile.eraseColor(i);
		}
		connectGraph();
	}

	private void connectGraph() {
		int count = 0;
		for (int i=0; i<(dim*dim); i++) {
			if (i>=dim) { // north
				pile.addEdge(i,i-dim);
			}
			if (i<dim) { // south
				pile.addEdge(i,i+dim);
			}
			if (i%dim!=dim-1) { // east
				pile.addEdge(i,i+1);
			}
			if (i%dim!=0) { // west
				pile.addEdge(i,i-1);
			}
		}
	}

	// stabilize pile
	public boolean isStable() {
		HashSet<Integer> vertex = pile.listVertex();
		for (Integer v : vertex) {
			if (getColor(v)>=stackHeight) {
				return false;
			}
		}
		return true;
	}

	public void spreadGrains(int v) {
		HashSet<Integer> adjacent = pile.listAdjacent(v);
		color(v,pile.getColor(v)-adjacent.size());
		for (Integer temp : adjacent) {
			color(temp,pile.getColor(temp)+1);
		}
	}

	public void stepPile(int v) {
		if (pile.getColor(v)>=stackHeight) {
			spreadGrains(v);
		}
	}

	public void fullStepPile() {
		for (int i=0; i<dim*dim; i++) {
			stepPile(i);
		}
	}

	public void stabilizePile() {
		while (isStable()==false) {
			fullStepPile();
			consolePrint();
			steps++;
			try {Thread.sleep(100);}
			catch (Exception e) {}
		}
	}

	// print the pile
	public void consolePrint() {
		System.out.println();
		System.out.print("\033[H\033[2J"); // clear console
		for (int i=0; i<dim*dim; i++) {
			System.out.print(pile.getColor(i)+" ");
			if (i%dim==dim-1) {System.out.println();}
		}
	}

	// methods passed up from Graph and ColorGraph
	public HashSet listAdjacent(int v) {
		return pile.listAdjacent(v);
	}
	public HashSet listVertex() {
		return pile.listVertex();
	}
	public int getColor(int v) {
		return pile.getColor(v);
	}

	// add color to the pile
	public void color(int v, int color) {
		pile.forceColor(v,color);
	}

	public void tallStack() {
		color(dim*(dim/2)+(dim/2-1),80);
	}

	public void trumpWall() {
		for (int i=0; i<dim; i++) {
			color(dim*(dim/2)+i,20);
		}
	}

	public static void main(String[] args) {
		Sandpile myPile = new Sandpile(10);
		System.out.println(myPile.listAdjacent(0));
		System.out.println(myPile.listAdjacent(95));
		System.out.println(myPile.listAdjacent(99));
		// myPile.tallStack();
		myPile.trumpWall();
		myPile.consolePrint();
		myPile.stabilizePile();
		myPile.consolePrint();
		System.out.println("\nStabilized in "+myPile.steps+" steps");
	}
}