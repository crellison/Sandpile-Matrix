// Cole Ellison
// Color Graph Object

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.ArrayList;

class ColorGraph extends Graph {

	// CHANGE TO MATRIX	
	private HashMap<Integer,Integer> colors;

	public ColorGraph() {
		super();
		colors = new HashMap<Integer,Integer>();
	}

	public void eraseColor(int v) {
		colors.put(v,0);
	}

	public void eraseAll() {
		Iterator it = map.keySet().iterator();
		while (it.hasNext()) {
	    	colors.put((Integer)it.next(),0);
	    }
	}

	public void addVertex(int v) {
		super.addVertex(v);
		colors.put(v,0);
	}

	public void elimVertex(int v) {
		super.elimVertex(v);
		colors.remove(v);
	}

	public boolean canColor(int v, int color) {
		HashSet<Integer> adjacents = super.listAdjacent(v);
		boolean can = true;
		for (Integer temp : adjacents) {
			can = can && (getColor(temp) != color);
		}
	    return can;
	}

	public boolean putColor(int v, int color) {
		if (canColor(v,color)==true) {
			colors.put(v,color);
			return true;
		} else {return false;}
	}

	public void forceColor(int v, int color) {
		colors.put(v,color);
	}

	public int getColor(int v) {
		return colors.get(v);
	}

	public ArrayList colorList() {
		ArrayList<Integer> c = new ArrayList<Integer>();
		for (Integer vertex : colors.keySet()) {
			c.add(getColor(vertex));
		}
		return c;
	}

	public boolean hasColor(int v) {
		return getColor(v)!=0;
	}

	public ArrayList<Integer> possibleColors(int v,int max) {
		if (hasColor(v)!=true) { // solo busca vertices sin color
			HashSet<Integer> adjacent = listAdjacent(v);
			ArrayList<Integer> nums = new ArrayList<Integer>();
			for (int i=1; i<max+1; i++) { // busca color no contenido en los adjacent
				nums.add(i);
			}
			for (Integer temp : adjacent) {
				int index = nums.indexOf(getColor(temp));
				if (index != -1) {
					nums.remove(index);
				}
			}
			return nums;
		} else {
			return new ArrayList<Integer>();
		}
	}

	public static void main(String[] args) {
		ColorGraph graph = new ColorGraph();
		graph.addVertex(3);
		graph.addVertex(4);
		graph.addVertex(2);
		graph.addVertex(1);
		System.out.println(graph.listVertex());
		graph.addEdge(3,4);
		graph.addEdge(4,1);
		graph.addEdge(3,3);
		System.out.println(graph.listAdjacent(3));
		graph.putColor(3,10);
		System.out.println(graph.colorList());
		System.out.println(graph.canColor(4,10));
		graph.elimEdge(3,3);
		System.out.println(graph.listAdjacent(3));
		graph.elimVertex(3);
		System.out.println(graph.listAdjacent(4));
		graph.elimVertex(1);
		System.out.println(graph.listVertex());
		System.out.println(graph.listAdjacent(4));
	}
}