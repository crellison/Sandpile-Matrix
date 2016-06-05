// Cole Ellison
// Sandpile Applet

import java.applet.*;
import java.awt.*;
import java.awt.event.*;

@SuppressWarnings("serial")
public class SandpileApplet extends Applet implements ActionListener {

	private SandpileCanvas canvas;
	private Button satabilizeButton, clearButton, colorButton, animationButton; // add pause button?
	private Label isStable;
	private Label stepCounter;
	private TextField xCoor; // for colorButton
	private TextField yCoor; // for colorButton
	private TextField colorAdd; // for colorButton
	private Sandpile pile;
	private Choice preset;

	static public final int dim = 10;

	public void init() {
		// create pile
		pile = new Sandpile(10);
		// intiate labels and textfields
		isStable = new Label("");
		stepCounter = new Label("");
		preset1Button = new Label("");
		preset2Button = new Label("");
		xCoor = new TextField(3)
		yCoor = new TextField(3)
		color = new TextField(3)

		// make canvas;
		canvas = new SandpileCanvas(this, pile);
		// design layout
		this.setLayout(new BorderLayout());
		this.add("West", playPanel());
		this.add("Center", canvas);
		// start pile
		canvas.resetLabels();
		this.setSize(500, 340);
	}

	// panel/button/label constructors
	public Panel xCoor() {
		Panel x = new Panel();
		x.setLayout(new FlowLayout());
		xCoor.addActionListener(this);
		x.add(new Label("column: "));
		x.add(xCoor);
		return x;
	}
	public Panel yCoor() {
		Panel y = new Panel();
		y.setLayout(new FlowLayout());
		yCoor.addActionListener(this);
		y.add(new Label("row: "));
		y.add(yCoor);
		return y;
	}
	public Panel colorAdd() {
		Panel color = new Panel();
		color.setLayout(new FlowLayout());
		colorAdd.addActionListener(this);
		color.add(new Label("color: "));
		color.add(colorAdd);
		return color;
	}
	public Label stableLabel() {
		isStable.setAlignment(Label.RIGHT);
		isStable.setColor(Color.white);
		return isStable;
	}
	public Label countLabel() {
		stepCounter.setAlignment(Label.RIGHT);
		stepCounter.setColor(Color.white);
		return stepCounter;
	}
	public Button playButton(String s) { // general button constructor
		Button pButton = new Button(s);
		pButton.setBackground(white);
		return pButton;
	}
	public Panel presetChoice() {
		Panel piles = new Panel();
		piles.setLayout(new FlowLayout());
		preset = new Choice();
		preset.add("tall tower");
		preset.add("trump wall");
		preset.setBackground(Color.white);
		piles.add(preset);
		return piles;
	}
	// interactive panel
	public Panel playPanel() {
		setFont("Helvetica Neue",Font.BOLD,12);
		Panel controlBoard = new Panel();
		controlBoard.setLayout(new GridLayout(1,4));
		Label title = new Label("SANPILE\nMATRIX");
		title.setAlignment(Label.RIGHT);
		controlBoard.add(title);
		// initilize buttons
		colorButton = playButton("add color");
		colorButton.addActionListener(this);
		satabilizeButton = playButton("stabilize pile");
		satabilizeButton.addActionListener(this);
		clearButton = playButton("clear pile");
		clearButton.addActionListener(this);
		animationButton = playButton("toggle animation");
		animationButton.addActionListener(this);
		// panel for addition of color at specified location
		Panel specAdd = new Panel(); 
		specAdd.setLayout(new GridLayout(1,4));
		specAdd.add(yCoor());
		specAdd.add(xCoor());
		specAdd.add(colorAdd());
		specAdd.add(colorButton);
		controlBoard.add(specAdd);
		// tools to interact with the sandpile
		Panel actionButtons = new Panel();
		actionButtons.setLayout(new GridLayout(2,1));
		actionButtons.add(clearButton);
		actionButtons.add(satabilizeButton);
		controlBoard.add(actionButtons);
		// label counters for action of pile
		Panel pileStatus = new Panel();
		pileStatus.setLayout(new GridLayout(2,1));
		pileStatus.add(stableLabel());
		pileStatus.add(countLabel());
		controlBoard.add(pileStatus);
		return controlBoard;
	}
	// action event listener
	public void actionPerformed(ActionEvent e) {
		if (e.getSource() == satabilizeButton)
			canvas.stabilize();
		else if (e.getSource() == clearButton)
			canvas.clear();
		else if (e.getSource() == colorButton)
			canvas.color();
		else if (e.getSource() == animationButton)
			canvas.animation();
	}


}