// Cole Ellison
// Graph Object

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;

public class Graph {
	
	protected HashMap<Integer,HashSet<Integer>> map;

	public Graph() {
		map = new HashMap<Integer,HashSet<Integer>>();
	}

	public void addVertex(int v) {
		map.put(v,new HashSet<Integer>());
	}

	public void addEdge(int v1, int v2) {
		map.get(v1).add(v2);
		map.get(v2).add(v1);
	}

	public void elimVertex(int v) {
		map.remove(v);
		Iterator it = listAdjacent(v).iterator();
	    while (it.hasNext()) {
	    	map.get(it.next()).remove(v);
	    }
	}

	public void elimEdge(int v1, int v2) {
		if (map.containsKey(v1) && map.containsKey(v2)) {
			map.get(v1).remove(v2);
			map.get(v2).remove(v1);
		}
	}

	public boolean hasEdge(int v1, int v2) {
		return map.get(v1).contains(v2);
	}

	public boolean hasVertex(int v) {
		return map.containsKey(v);
	}

	public HashSet listVertex() {
		return new HashSet<Integer>(map.keySet());
	}

	public HashSet listAdjacent(int v) {
		return map.get(v);
	}

	public static void main(String[] args) {
		Graph mygraph = new Graph();
		mygraph.addVertex(3);
		mygraph.addVertex(4);
		mygraph.addVertex(2);
		mygraph.addVertex(1);
		System.out.println(mygraph.listVertex());
		mygraph.addEdge(3,4);
		mygraph.addEdge(4,1);
		mygraph.addEdge(3,3);
		System.out.println(mygraph.listAdjacent(3));
		mygraph.elimEdge(3,3);
		System.out.println(mygraph.listAdjacent(3));
		mygraph.elimVertex(3);
		System.out.println(mygraph.listAdjacent(4));
		mygraph.elimVertex(1);
		System.out.println(mygraph.listVertex());
		System.out.println(mygraph.listAdjacent(4));
	}

}