Sandpile Animation
Created by: Cole Ellison
18 Jan 2016 
-

The enclosed documents are meant as personal projects and are not intended for commercial use at any time. 
-

The GOOGLE ‘G’ © 2015 Google Inc, used with permission. Google and the Google logo are registered trademarks of Google Inc.

‘In the Hall of the Mountain King’ - Edvard Grieg, from the Peer Gynt Suite, No. 1
-

Sandpile theory relates to a mathematical interpretation of the toppling behavior of sand grains. Under it’s rules, grains can be placed at coordinates on a matrix. If any pile of grains reaches a height greater than or equal to four, four grains from that pile fall (vertically and horizontally) to occupy the four adjacent stacks. The cascading/avalanche process of a sandpile is abelian - the order in which the piles fall have no bearing on the stabilized state of the sandpile. More on sandpile theory can be found here: http://nautil.us/issue/23/dominoes/the-amazing-autotuning-sandpile

I initially created this code as a way to better visualize the process of avalanching in sandpile theory, but soon realized that the updated version of the GOOGLE ‘G’ logo lent itself well to an expansion of my previous code for greater flexibility in implementation. The produced video, which contains approximately 1700 full steps of the initial sandpile condensed into one minute, displays the sandpile attempt to stabilize itself. However, the segment in the hook of the G enters into a loop, preventing the GOOGLE ‘G’ from ever stabilizing.

By editing the comment status of various lines in the if statement at the bottom of the document referencing the top-level script environment, it is possible to run the code with different initial matrix states. This is useful for further understanding the process of toppling in sandpile theory. It may also shed light on the characteristics of the avalanche of the GOOGLE ‘G’