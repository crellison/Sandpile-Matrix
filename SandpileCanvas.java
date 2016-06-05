
import java.awt.*;

@SuppressWarnings("serial")
public class SandpileCanvas extends Canvas {

	// instance variables
	protected Sandpile game;
	protected SandpileApplet parent;
	// constants
	final int RADIUS = 5;
	final int PILE_BORDER = 1;
	final int BORDER = 20;
	final int INITIAL_X = 180; // non-dynamic implementation 
	final int INITIAL_Y = 20; // non dynamic implementation

	// constructor
	public SandpileCanvas(SandpileApplet a, Sandpile game) {
		parent = a;
		this.game = game;
	}

	// graphics
	public void paint(Graphics g) {
		Dimension d = getSize();
		// ...
	}

	public void printBoard(Graphics g, int x, int y) {
		// x and y are starting values for the upper left corner of the board
		// circles 
	}
	public void resetLabels(Graphics g) {
		parent.stableLabel().setText('is stable? '+game.isStable());
		parent.countLabel().setText('distance from original: '+game.steps+' steps');
		repaint();
	}
	public void stabilize(Graphics g) {
		game.stabilizePile() // possibly rehash this fucntion 
		// 
	}
	public void clear(Graphics g) {}
	public void color(Graphics g) {}
	public void animation(Graphics g) {}
	
	


}