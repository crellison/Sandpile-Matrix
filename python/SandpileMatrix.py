# -*- coding: utf-8 -*-
"""
Cole Ellison
Sandpile Matrix Animation
January 2016
"""

from random import randint
from turtle import pu,pd,goto,forward,left,seth,done,tracer,update
from turtle import circle,color,begin_fill,end_fill,screensize,ht,clear
from time import time

### Constants

DOTSIZE = 8
BORDER = 15

### Sandpile Architecture

def makePileMatrix(x,y):
	'''created x*y matrix initialized at zero for sandpile'''
	Matrix = [[0 for i in range(x)] for i in range(y)]
	return Matrix

def RandomizePile(matrix):
	'''randomizes values in pile with either 0,1,2,3,4'''
	x=len(matrix)
	y=len(matrix[0])
	for i in range(0,x):
		for j in range (0,y):
			height = randint(0,4)
			matrix[i][j] = height
	return matrix

def printMatrix(matrix):
	'''prints the sandpile matrix in terminal window'''
	for i in range(0,len(matrix)):
		print (matrix[i])
	print ('\n')

def fullStepSandpile(matrix):
	'''completes one full step of the sandpile'''
	x=len(matrix)
	y=len(matrix[0])
	for i in range(0,x):
		for j in range (0,y):
			if matrix[i][j] >= 4:
				stepSandpile(matrix,i,j, "east")
				stepSandpile(matrix,i,j, "west")
				stepSandpile(matrix,i,j, "north")
				stepSandpile(matrix,i,j, "south")
				matrix[i][j]-=4
	return matrix

def stepSandpile(matrix,i,j,direction):
	'''steps grains down in desired direction (east,west,north,south)'''
	x=len(matrix)-1
	y=len(matrix[0])-1
	if direction == "north":
		if i+1 <= x:
			matrix[i+1][j] += 1
		else:
			matrix[i-1][j] += 1
	if direction == "south":
		if i-1 >= 0:
			matrix[i-1][j] += 1
		else:
			matrix[i+1][j] += 1
	if direction == "east":
		if j+1 <= y:
			matrix[i][j+1] += 1
		else:
			matrix[i][j-1] += 1
	if direction == "west":
		if j-1 >= 0:
			matrix[i][j-1] += 1
		else:
			matrix[i][j+1] += 1

def fullStepSandpileNoWhite(matrix,frame):
	'''completes one full step of the sandpile
	limits steps to only those within the given frame
	frame must be a matrix pre-set with values 0 and non-0
	NoWhite indicates that only moves w/in original frame
	of non-0 moves are legal'''
	x=len(matrix)
	y=len(matrix[0])
	for i in range(0,x):
		for j in range (0,y):
			if matrix[i][j] >= 4:
				stepSandpileNoWhite(matrix,i,j, "east",frame)
				stepSandpileNoWhite(matrix,i,j, "west",frame)
				stepSandpileNoWhite(matrix,i,j, "north",frame)
				stepSandpileNoWhite(matrix,i,j, "south",frame)
				matrix[i][j]-=4
	return matrix

def stepSandpileNoWhite(matrix,i,j,direction,frame):
	'''steps grains down in desired direction (east,west,north,south)
	limits steps to only those within the given frame
	frame must be a matrix pre-set with values 0 and non-0
	NoWhite indicates that only moves w/in original frame
	of non-0 moves are legal'''
	x=len(matrix)-1
	y=len(matrix[0])-1
	if direction == "north":
		if i+1 <= x and frame[i+1][j] != 0:
			matrix[i+1][j] += 1
		else:
			matrix[i-1][j] += 1
	if direction == "south":
		if i-1 >= 0 and frame[i-1][j] != 0:
			matrix[i-1][j] += 1
		else:
			matrix[i+1][j] += 1
	if direction == "east":
		if j+1 <= y and frame[i][j+1] != 0:
			matrix[i][j+1] += 1
		else:
			matrix[i][j-1] += 1
	if direction == "west":
		if j-1 >= 0 and frame[i][j-1] != 0:
			matrix[i][j-1] += 1
		else:
			matrix[i][j+1] += 1

def isStable(matrix):
	'''returns boolean based on stability of sandpile
	stable means all values are less than 4'''
	Bool = True
	for i in range(0,len(matrix)):
		Bool = Bool and all(n < 4 for n in matrix[i])
	return Bool

def stabilize(matrix):
	'''goes through full steps of the sandpile until matrix is stable'''
	printMatrix(myPile)
	while (isStable(matrix) == False):
		fullStepSandpile(myPile)
		printMatrix(myPile)
	print ('done!')

### Turtle Graphics

def setScreen(matrix):
	'''sets the screensize'''
	dim = (DOTSIZE+1)*len(matrix)+BORDER
	screensize(dim,dim)

def chooseColor(value):
	'''sets color based on value of location in matrix'''
	if value == 0:
		return '#ffffff'
	if value == 1:
		return '#3366ff'
	if value == 2:
		return '#00b359'
	if value == 3:
		return '#ffcc00'
	if value >= 4:
		return '#e60000'

def drawEntry(i,j,matrix,size):
	'''draws square on turtle canvas based on value at matrix[i][j]
	0 = black; 1 = blue; 2 = green; 3 = yellow; 4 >= red
	size denotes radius'''
	pd()
	value = matrix[i][j]
	color(chooseColor(value))
	begin_fill()
	circle(size)
	end_fill()
	pu()

def drawPile(matrix):
	'''sends turtle to starting position, draws pile, then sends the turtle
	back to the starting position'''
	clear() # clears canvas to reduce RAM clogging
	matrixDim = (DOTSIZE+1)*len(matrix)
	pu()
	goto(-matrixDim,matrixDim)
	for i in range(0,len(matrix)):
		for j in range(0,len(matrix[0])):
			drawEntry(i,j,matrix,DOTSIZE)
			forward(2*DOTSIZE+DOTSIZE//4)
		goto(-matrixDim,matrixDim-(2*DOTSIZE+DOTSIZE//4)*(i+1))

def googleMatrix():
	'''makes google G with colors'''
	matrix = makePileMatrix(25,25)
	#red upper
	for i in range(4,8):
		for j in range(9,19):
			matrix[i][j] = 4
	for j in range(11,17):
		matrix[3][j] = 4
	for i in range(6,10):
		for j in range(6,9):
			matrix[i][j] = 4
	red = [[8,5],[9,5],[5,7],[5,8],[10,7],[10,8],[9,9],[8,9],[8,10]]
	red.extend([[8,17],[8,18],[7,19],[6,19],[5,19],[6,20]])
	for entry in red:
		matrix[entry[0]][entry[1]] = 4
	#yellow side
	for i in range(10,17):
		for j in range(4,7):
			matrix[i][j] = 3
	for i in range(12,16):
		matrix[i][3] = 3
		matrix[i][7] = 3
	yellow = [[11,7],[17,4],[17,5]]
	for entry in yellow:
		matrix[entry[0]][entry[1]] = 3
	#green bottom
	for i in range(17,20):
		for j in range(6,9):
			matrix[i][j] = 2
	for i in range(20,23):
		for j in range(8,20):
			matrix[i][j] = 2
	for j in range(10,19):
		matrix[23][j] = 2
	green = [[16,7],[18,5],[19,5],[20,6],[20,7],[21,7],[18,9],[19,9]]
	green.extend([[19,10],[19,17],[21,20]])
	for entry in green:
		matrix[entry[0]][entry[1]] = 2
	#blue side
	for i in range(12,16):
		for j in range(14,24):
			matrix[i][j] = 1
	for i in range(16,18):
		for j in range(20,24):
			matrix[i][j] = 1
	for i in range(18,20):
		for j in range(18,22):
			matrix[i][j] = 1
	blue = [[17,19],[18,22],[20,20],[20,21]]
	for entry in blue:
		matrix[entry[0]][entry[1]] = 1
	return matrix

	
if __name__ == '__main__':
	tracer(0,0)
	# comment these two lines out for other examples
	myPile = googleMatrix()
	frame = googleMatrix()
	# Other examples
	# myPile = makePileMatrix(15,15)

	# the following line generates random values for the pile
	# myPile = RandomizePile(myPile)

	# the loop creates a line of grains 20 high across the center of the matrix
	# for i in range(0,15):
	# 	myPile[7][i]=20

	# this puts a pile 80 grains high at the center of the matrix
	# myPile[7][7] = 80
	setScreen(myPile)
	drawPile(myPile)
	update()
	while (isStable(myPile) == False):
			# switch the comment status of the next two lines when
			# not working with the googleMatrix() function
		myPile = fullStepSandpileNoWhite(myPile,frame)
			# myPile = fullStepSandpile(myPile)
		drawPile(myPile)
		update()
	ht()
	done()