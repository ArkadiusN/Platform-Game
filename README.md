### The Game Project 5 – Bring it all together

Okay we have most of the aspects of our side-scrolling game covered so
now it's time to bring all of these elements together. We're going to
be doing a lot of cutting and pasting here, but do it carefully and test
at the end of each stage.

The code will be quite extensive now so we will refactor it into our
functions to make it more manageable

1. Inspect the code.

2. Add game character controls [1 marks]
	- Copy and paste the code which draws your game character from part 3_interaction into the
	function `drawGameChar`
	- Check that your game character appears in your sketch
	- Copy and paste the code inside keyPressed and keyReleased functions from part 3_interaction
	into the same functions here
	- Test that your game character can move left and right and jump. NB. they won't fall back to
	the ground just yet.
	- Check that the animations look correct

3. Add falling code [1 marks]
	- From part 3b_canyonsAndCoins, copy and paste the conditional statement which makes the
	character fall into the `draw` function.
	- Test that the character now falls back to the ground when you jump.

4. Render background items [2 marks]
	- From part 4_scrollingBackground, copy and paste the arrays `trees_x`, `clouds`, and `mountains`
	- Copy and paste the `for loops` for each of these items into the `draw` function.
	- Now we are going to refactor this code.
	- Create three new functions `drawClouds`, `drawMountains`, `drawTrees`
	- Cut and paste each `for loop` into the relevant function.
	- In the `draw` function call each of the three new functions (eg. `drawClouds`)
	- You should now see all of the above items drawn to the screen

5. Render canyons and collectables [2 marks]
	- From 4_scrollingBackground, copy and paste the arrays `canyons`, `collectables`
	- Copy and paste the `for loops` for each of these items into the `draw` function.
	- We are also going to refactor this code but we will do things a little differently.
	- Cut and paste only the body of each `for loop` into the functions `drawCanyon` and
	`drawCollectable`
	- Now replace the references to the arrays with the argument provided by the function
	(eg. `canyons[i].posX` becomes `t_canyon.posX`)
	- Finally we need to call these functions passing each canyon or collectable as a
	parameter.
	- Do this inside the body of each `for loop`. (eg. `drawCanyon(canyons[i]);`)
	- You should now see canyons and collectables rendered. HINT: check the draw order is
	correct

6. Implement scrolling [1 marks]
	- From 4_scrollingBackground copy and paste the `push`, `pop` and `translate`
	commands into the correct places in the `draw` function
	- Try walking to the edge of the screen and check that all the rendered items
	move in the correct direction to create the illusion of motion.

7. Implement collectables interaction [2 marks]
	- From part 3b_canyonsAndCoins, copy the conditional statement which checks
	whether a player is within range of a collectable and paste it into the function
	`checkCollectable`
	- As you did with the `drawCollectable` function, replace the references to `collectable`
	with references to `t_collectable`.
	- Write the code to call `checkCollectables` just below the call to `drawCollectables`. It
	should use exactly the same format.
	- We now need to make sure that the collectable is not drawn once it has been found. Add
	a conditional statement to the same `for loop` which prevents both functions being called
	if that collectable's `isFound` property is `true`
	- Test your code to check that collectables disappear when the game character collides with
	them.
	- You'll notice that once the screen starts scrolling the collectable items stop functioning
	as expected. This is because `gameChar_x` only represents where the character appears
	on the screen not where they are in the game world.
	- The variable `gameChar_world_x` shows where the game character is in the game world. Replace
	`gameChar_x` in the `checkCollectable` function with `gameChar_world_x` to make the collectable items work with scrolling.

8. Implement canyons interaction [1 marks]
	- From part 3b_canyonsAndCoins, copy and paste the conditional statement which makes the
	character plummet into the `draw` function.
	- Copy and paste the conditional statement which detects whether the player is over a canyon
	into the function `checkCanyon`.
	- Adapt the code to use the argument `t_canyon`
	- Adapt the same code to use `gameChar_world_x` instead of `gameChar_x`
	- Call the function from the same `for loop` which draws the canyons, passing the each canyon
	as an argument in the same way as you did for `drawCanyon`
