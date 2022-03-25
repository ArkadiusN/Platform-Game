/*

The Game Project 5 - Bring it all together

*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var BGround1;
var BGround2;
var BGround3;
var platforms;


var mountains_x;
var mountains_y;
var trees_x;
var collectables;
var canyons_x;
var enemies;

var game_score;
var flagpole;
var lives;

function setup()
{
	createCanvas(1024, 700);
	floorPos_y = 635;
    lives = 4;
    startGame();
}

function draw()
{
	background(245,222,179);
    fill(255,228,196,45);
    noStroke();
    beginShape();
    vertex(0,159);
    vertex(1024,159);
    vertex(1024,700);
    vertex(0,700);
    vertex(0,259);
    endShape();
    
    push();
    translate(scrollPos, 0);
    drawMountains();
    createBackground3();
    createBackground2();
    createBackground1();
    createSun();
    drawTrees();
    pop();
    
    //DRAWING GROUND
	noStroke();
    fill(128,0,0);
	rect(0, floorPos_y, width, height/4); 
    push();
    translate(scrollPos,0)
    drawClouds();
    
    
	//DRAW CANYONS
    for(var k=0; k <canyons_x.length; k++){   
        drawCanyon(canyons_x[k])
        checkCanyon(canyons_x[k])
    }
	//DRAW COLLECTABLES
    for(var r=0; r< collectables.length; r++){
        if(!collectables[r].isFound){
            drawCollectable(collectables[r])
            checkCollectable(collectables[r]);
        }
    }

    renderFlagpole();
    
    for(var i = 0; i< platforms.length; i++){
            platforms[i].draw() 
        }
    for(var h =0; h <enemies.length; h++)
        {
            enemies[h].update();
            enemies[h].draw();
            if(enemies[h].isContact(gameChar_world_x, gameChar_y))
                {
                    startGame();
                    break;

                }
        }
    
    
    pop();
    
	drawGameChar();
    
    noStroke();
    fill(255,0,0,120)
    rect(90,16,380,44,10)
    noStroke();
    fill(255,255,0);
    textSize(42);
    textStyle(BOLD);
    text("Score: " + game_score, 100,50)
    text("Lives: " + lives,300,50)
    
    


	// Logic to make the game character move or the background scroll.
	if(isLeft){
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight){
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y){
        var isContact = false;
        for(var i=0; i < platforms.length; i++){
                if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true){
                        isContact = true;
                        break;
                    }

            }
        if(isContact == false){
        gameChar_y +=4; 
        isFalling = true;
        }
        else{
            isFalling = false;
        }
    }
    else{
        isFalling = false;
    }
    
    
    if(flagpole.isReached != true){
        checkFlagpole();
    }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
    if(gameChar_y >height +100 &&lives >0){
        startGame()
    }
    
    if(gameChar_y > height  && lives == 0){
        textSize(42);
        textStyle(BOLD);
        text("Game Over. Press space to continue.",width/6,height/2)
    }
    else{
        return false;
    }
    
    if(flagpole.isReached){
        textSize(42);
        textStyle(BOLD);
        text("Level complete. Press Ctrl + F5 to continue.", width/2, height/2)
    }
    else{
        return false;
    }
    
    if(lives >0){
        startGame();
    }   
}

// ---------------------
// Key control functions
// ---------------------
function keyPressed(){
    if(keyCode == 37){
        isLeft = true;
    }
    if(keyCode ==39){
        isRight = true;
    }
    if(keyCode == 32 && gameChar_y == floorPos_y){
        isFalling = true;
        gameChar_y = gameChar_y -100;
    } 
    
    if(flagpole.isReached && key == ' '){
        nextLevel();
        return
    }
    else if(lives == 0 && key == ' '){
        returnToStart();
        return
    }
}

function keyReleased(){
    if(keyCode == 37){
        isLeft = false;
    }
    if(keyCode ==39){
        isRight = false;
    }
    
    if(keyCode == 32){
        isFalling = false;
    } 
}

// ------------------------------
// Game character render function
// ------------------------------
function drawGameChar(){
    if(isLeft && isFalling){
		// add your jumping-left code
        fill(255,99,71);
        quad(gameChar_x -17,gameChar_y -2, gameChar_x -11,gameChar_y -2, gameChar_x -2,gameChar_y -12, gameChar_x -8,gameChar_y -12);
        quad(gameChar_x +13,gameChar_y -2, gameChar_x +19,gameChar_y -2, gameChar_x +7,gameChar_y -12, gameChar_x +2,gameChar_y -12);
        fill(25,25,112);
        //BUT Z LEWEJ
        quad(gameChar_x -17,gameChar_y -2,gameChar_x -11,gameChar_y -2,gameChar_x -7,gameChar_y -7,gameChar_x -13,gameChar_y -7);
        //BUT Z PRAWEJ
        quad(gameChar_x +19,gameChar_y -2,gameChar_x +12,gameChar_y -2,gameChar_x +7,gameChar_y -7,gameChar_x +13,gameChar_y -7); 
        fill(255,99,71);
        rect(gameChar_x -12, gameChar_y -10, 24,-20); //KLATKA PIERSIOWA
        fill(25,25,112);
        triangle(gameChar_x -12, gameChar_y -30, gameChar_x-12, gameChar_y -20, gameChar_x -3,gameChar_y -30);
        fill(253,245,230);
        strokeWeight(0.5);
        stroke(176,196,222);
        rect(gameChar_x,gameChar_y -30,5,18,20); //REKA Z PRAWEJ
        rect(gameChar_x -15, gameChar_y -60,30,30,10); //GLOWA
        stroke(255,255,255);            //OCZY
        fill(255,255,255);
        stroke(0,0,0);
        quad(gameChar_x -10,gameChar_y -48, gameChar_x -3,gameChar_y -50, gameChar_x -3,gameChar_y -46, gameChar_x -10, gameChar_y -45);                //OCZY
        line(gameChar_x -10,gameChar_y -43,gameChar_x -3,gameChar_y -45); //POLICZKI
        fill(0,0,0);                                                      //WŁOSY
        quad(gameChar_x -15,gameChar_y -56,gameChar_x -8,gameChar_y -56,gameChar_x -10,gameChar_y -52,gameChar_x -14,gameChar_y -50);
        quad(gameChar_x -14,gameChar_y -52,gameChar_x -24,gameChar_y -60,gameChar_x -17,gameChar_y -62,gameChar_x -9,gameChar_y -60);
        quad(gameChar_x -10,gameChar_y -60,gameChar_x -19,gameChar_y -73,gameChar_x -5,gameChar_y -67,gameChar_x -5,gameChar_y -60);
        quad(gameChar_x -5,gameChar_y -60,gameChar_x -4,gameChar_y -75,gameChar_x +6,gameChar_y -68,gameChar_x +12,gameChar_y -60);
        rect(gameChar_x -14,gameChar_y -60,27,5,20);
        fill(0,0,0);
        ellipse(gameChar_x-9, gameChar_y-47,2,2); //OCZY
	}
	else if(isRight && isFalling){
		// add your jumping-right code
        fill(255,99,71);
        quad(gameChar_x -17,gameChar_y -2, gameChar_x -11,gameChar_y -2, gameChar_x -3,gameChar_y -12, gameChar_x -8,gameChar_y -12);
        quad(gameChar_x +13,gameChar_y -2, gameChar_x +19,gameChar_y -2, gameChar_x +7,gameChar_y -12, gameChar_x +2,gameChar_y -12);
        fill(25,25,112);
        //BUT Z LEWEJ
        quad(gameChar_x -17,gameChar_y -2,gameChar_x -11,gameChar_y -2,gameChar_x -7,gameChar_y -7,gameChar_x -13,gameChar_y -7);
        //BUT Z PRAWEJ
        quad(gameChar_x +19,gameChar_y -2,gameChar_x +12,gameChar_y -2,gameChar_x +7,gameChar_y -7,gameChar_x +13,gameChar_y -7); 
        fill(255,99,71);
        rect(gameChar_x -12, gameChar_y -10, 24,-20); //KLATKA PIERSIOWA
        fill(25,25,112);
        triangle(gameChar_x +12, gameChar_y -30, gameChar_x +12, gameChar_y -20, gameChar_x +3,gameChar_y -30);
        fill(253,245,230);
        strokeWeight(0.5);
        stroke(176,196,222);
        rect(gameChar_x -5,gameChar_y -30,5,18,20); //REKA Z LEWEJ
        rect(gameChar_x -15, gameChar_y -60,30,30,10); //GLOWA
        stroke(255,255,255);            //OCZY
        fill(255,255,255);
        stroke(0,0,0);
        quad(gameChar_x +10,gameChar_y -48, gameChar_x +3,gameChar_y -50, gameChar_x +3,gameChar_y -46, gameChar_x+10, gameChar_y -45);
        line(gameChar_x +10,gameChar_y -43,gameChar_x +3,gameChar_y -45); //POLICZKI
        fill(0,0,0);  //WŁOSY
        quad(gameChar_x +15,gameChar_y -56,gameChar_x +8,gameChar_y -56,gameChar_x +10,gameChar_y -52,gameChar_x +14,gameChar_y -50);
        quad(gameChar_x +14,gameChar_y -52,gameChar_x +24,gameChar_y -60,gameChar_x +17,gameChar_y -62,gameChar_x +9,gameChar_y -60);
        quad(gameChar_x +10,gameChar_y -60,gameChar_x +19,gameChar_y -73,gameChar_x +5,gameChar_y -67,gameChar_x +5,gameChar_y -60);
        quad(gameChar_x +5,gameChar_y -60,gameChar_x +4,gameChar_y -75,gameChar_x -6,gameChar_y -68,gameChar_x -13,gameChar_y -60);
        rect(gameChar_x -14,gameChar_y -60,27,5,20);
        fill(0,0,0);
        ellipse(gameChar_x+9, gameChar_y-47,2,2); //OCZY
	}
	else if(isLeft){
		// add your walking left code
        fill(255,99,71);
        rect(gameChar_x -2,gameChar_y, 5,-20); //NOGA Z LEWEJ
        fill(25,25,112);
        rect(gameChar_x -2,gameChar_y -4,5,5); //BUTY
        fill(255,99,71);
        rect(gameChar_x -12, gameChar_y -10, 24,-20); //KLATKA PIERSIOWA
        fill(25,25,112);
        triangle(gameChar_x -12, gameChar_y -30, gameChar_x-12, gameChar_y -20, gameChar_x -3,gameChar_y -30);
        fill(253,245,230);
        strokeWeight(0.5);
        stroke(176,196,222);
        rect(gameChar_x,gameChar_y -30,5,18,20); //REKA Z PRAWEJ
        rect(gameChar_x -15, gameChar_y -60,30,30,10); //GLOWA
        stroke(255,255,255);            //OCZY
        fill(255,255,255);
        stroke(0,0,0);
        quad(gameChar_x -10,gameChar_y -48, gameChar_x -3,gameChar_y -50, gameChar_x -3,gameChar_y -46, gameChar_x -10, gameChar_y -45);                //OCZY
        line(gameChar_x -10,gameChar_y -43,gameChar_x -3,gameChar_y -45); //POLICZKI
        fill(0,0,0);                                                      //WŁOSY
        quad(gameChar_x -15,gameChar_y -56,gameChar_x -8,gameChar_y -56,gameChar_x -10,gameChar_y -52,gameChar_x -14,gameChar_y -50);
        quad(gameChar_x -14,gameChar_y -52,gameChar_x -24,gameChar_y -60,gameChar_x -17,gameChar_y -62,gameChar_x -9,gameChar_y -60);
        quad(gameChar_x -10,gameChar_y -60,gameChar_x -19,gameChar_y -73,gameChar_x -5,gameChar_y -67,gameChar_x -5,gameChar_y -60);
        quad(gameChar_x -5,gameChar_y -60,gameChar_x -4,gameChar_y -75,gameChar_x +6,gameChar_y -68,gameChar_x +12,gameChar_y -60);
        rect(gameChar_x -14,gameChar_y -60,27,5,20);
        fill(0,0,0);
        ellipse(gameChar_x-9, gameChar_y-47,2,2); //OCZY
	}
	else if(isRight){
		// add your walking right code
        fill(255,99,71);
        rect(gameChar_x -2,gameChar_y, 5,-20);  //NOGA Z PRAWEJ
        fill(25,25,112);
        rect(gameChar_x -2,gameChar_y -4,5,5); //BUTY
        fill(255,99,71);
        rect(gameChar_x -12, gameChar_y -10, 24,-20); //KLATKA PIERSIOWA
        fill(25,25,112);
        triangle(gameChar_x +12, gameChar_y -30, gameChar_x +12, gameChar_y -20, gameChar_x +3,gameChar_y -30);
        fill(253,245,230);
        strokeWeight(0.5);
        stroke(176,196,222);
        rect(gameChar_x -5,gameChar_y -30,5,18,20); //REKA Z LEWEJ
        rect(gameChar_x -15, gameChar_y -60,30,30,10); //GLOWA
        stroke(255,255,255);            //OCZY
        fill(255,255,255);
        stroke(0,0,0);
        quad(gameChar_x +10,gameChar_y -48, gameChar_x +3,gameChar_y -50, gameChar_x +3,gameChar_y -46, gameChar_x+10, gameChar_y -45);
        line(gameChar_x +10,gameChar_y -43,gameChar_x +3,gameChar_y -45); //POLICZKI
        fill(0,0,0);  //WŁOSY
        quad(gameChar_x +15,gameChar_y -56,gameChar_x +8,gameChar_y -56,gameChar_x +10,gameChar_y -52,gameChar_x +14,gameChar_y -50);
        quad(gameChar_x +14,gameChar_y -52,gameChar_x +24,gameChar_y -60,gameChar_x +17,gameChar_y -62,gameChar_x +9,gameChar_y -60);
        quad(gameChar_x +10,gameChar_y -60,gameChar_x +19,gameChar_y -73,gameChar_x +5,gameChar_y -67,gameChar_x +5,gameChar_y -60);
        quad(gameChar_x +5,gameChar_y -60,gameChar_x +4,gameChar_y -75,gameChar_x -6,gameChar_y -68,gameChar_x -13,gameChar_y -60);
        rect(gameChar_x -14,gameChar_y -60,27,5,20);
        fill(0,0,0);
        ellipse(gameChar_x+9, gameChar_y-47,2,2); //OCZY
	}
	else if(isFalling || isPlummeting){
		// add your jumping facing forwards code
        fill(255,99,71);
        rect(gameChar_x -10,gameChar_y, 5,-20); //NOGA Z LEWEJ
        rect(gameChar_x +5,gameChar_y, 5,-20);  //NOGA Z PRAWEJ
        fill(25,25,112);
        rect(gameChar_x -10,gameChar_y -4,5,5); //BUTY
        rect(gameChar_x +5,gameChar_y -4,5,5); //BUTY
        fill(255,99,71);
        rect(gameChar_x -12, gameChar_y -10, 24,-20); //KLATKA PIERSIOWA
        fill(25,25,112);
        triangle(gameChar_x -7, gameChar_y -30, gameChar_x, gameChar_y -20, gameChar_x +7,gameChar_y -30);
        fill(253,245,230);
        strokeWeight(0.5);
        stroke(176,196,222);
        rect(gameChar_x -15, gameChar_y -60,30,30,10); //GLOWA
        rect(gameChar_x -15,gameChar_y -40,5,18,20); //REKA Z LEWEJ
        rect(gameChar_x +10,gameChar_y -40,5,18,20); //REKA Z PRAWEJ
        stroke(255,255,255);            //OCZY
        fill(255,255,255);
        stroke(0,0,0);
        quad(gameChar_x -10,gameChar_y -50, gameChar_x -3,gameChar_y -48, gameChar_x -3,gameChar_y -45, gameChar_x-10, gameChar_y -46);
        quad(gameChar_x +3,gameChar_y -48, gameChar_x +10,gameChar_y -50, gameChar_x +10,gameChar_y -46, gameChar_x +3, gameChar_y -45);                //OCZY
        line(gameChar_x -3,gameChar_y -43,gameChar_x -11,gameChar_y -45); //POLICZKI
        line(gameChar_x +3,gameChar_y -43,gameChar_x +11,gameChar_y -45);
        //WŁOSY
        fill(0,0,0)
        noStroke();
        quad(gameChar_x -5,gameChar_y -57,gameChar_x,gameChar_y -57,gameChar_x -3,gameChar_y -53,gameChar_x -7,gameChar_y -48);
        quad(gameChar_x,gameChar_y -56,gameChar_x +5,gameChar_y -56,gameChar_x +3,gameChar_y -53,gameChar_x -1,gameChar_y -51);
        noStroke()
        rect(gameChar_x -14,gameChar_y -60,27,5,20);
        quad(gameChar_x +5,gameChar_y -56,gameChar_x +12,gameChar_y -56,gameChar_x +10,gameChar_y -52,gameChar_x +6,gameChar_y -50);
        quad(gameChar_x -13,gameChar_y -56,gameChar_x -7,gameChar_y -56,gameChar_x -10,gameChar_y -53,gameChar_x -9,gameChar_y -51);
        quad(gameChar_x -14,gameChar_y -58,gameChar_x -13,gameChar_y -56,gameChar_x -13,gameChar_y -50,gameChar_x -15,gameChar_y -55);
        quad(gameChar_x +11,gameChar_y -60,gameChar_x +16,gameChar_y -61,gameChar_x +21,gameChar_y -57,gameChar_x +11,gameChar_y -54);
        quad(gameChar_x -14,gameChar_y -52,gameChar_x -24,gameChar_y -60,gameChar_x -17,gameChar_y -62,gameChar_x -9,gameChar_y -60);
        quad(gameChar_x -10,gameChar_y -60,gameChar_x -19,gameChar_y -73,gameChar_x -5,gameChar_y -67,gameChar_x -5,gameChar_y -60);
        quad(gameChar_x -5,gameChar_y -60,gameChar_x -4,gameChar_y -75,gameChar_x +5,gameChar_y -68,gameChar_x +7,gameChar_y -60);
        fill(0,0,0);
        ellipse(gameChar_x-5, gameChar_y-48,2,2); //OCZY
        ellipse(gameChar_x+5, gameChar_y-48,2,2); //OCZY
	}
	else{
		// add your standing front facing code
        fill(255,99,71);
        rect(gameChar_x -10,gameChar_y, 5,-20); //NOGA Z LEWEJ
        rect(gameChar_x +5,gameChar_y, 5,-20);  //NOGA Z PRAWEJ
        fill(25,25,112);
        rect(gameChar_x -10,gameChar_y -4,5,5); //BUTY
        rect(gameChar_x +5,gameChar_y -4,5,5); //BUTY
        fill(255,99,71);
        rect(gameChar_x -12, gameChar_y -10, 24,-20); //KLATKA PIERSIOWA
        fill(25,25,112);
        triangle(gameChar_x -7, gameChar_y -30, gameChar_x, gameChar_y -20, gameChar_x +7,gameChar_y -30);
        fill(253,245,230);
        strokeWeight(0.5);
        stroke(176,196,222);
        rect(gameChar_x -15,gameChar_y -30,5,18,20); //REKA Z LEWEJ
        rect(gameChar_x +10,gameChar_y -30,5,18,20); //REKA Z PRAWEJ
        rect(gameChar_x -15, gameChar_y -60,30,30,10); //GLOWA
        stroke(255,255,255);            //OCZY
        fill(255,255,255);
        stroke(0,0,0);
        quad(gameChar_x -10,gameChar_y -50, gameChar_x -3,gameChar_y -48, gameChar_x -3,gameChar_y -45, gameChar_x-10, gameChar_y -46);
        quad(gameChar_x +3,gameChar_y -48, gameChar_x +10,gameChar_y -50, gameChar_x +10,gameChar_y -46, gameChar_x +3, gameChar_y -45);                //OCZY
        line(gameChar_x -3,gameChar_y -43,gameChar_x -11,gameChar_y -45); //POLICZKI
        line(gameChar_x +3,gameChar_y -43,gameChar_x +11,gameChar_y -45); //POLICZKI
        fill(0,0,0);                                                      //WŁOSY
        quad(gameChar_x -5,gameChar_y -55,gameChar_x,gameChar_y -55,gameChar_x -3,gameChar_y -53,gameChar_x -7,gameChar_y -48);
        quad(gameChar_x,gameChar_y -56,gameChar_x +5,gameChar_y -56,gameChar_x +3,gameChar_y -53,gameChar_x -1,gameChar_y -51);
        quad(gameChar_x +5,gameChar_y -56,gameChar_x +12,gameChar_y -56,gameChar_x +10,gameChar_y -52,gameChar_x +6,gameChar_y -50);
        quad(gameChar_x -13,gameChar_y -56,gameChar_x -7,gameChar_y -56,gameChar_x -10,gameChar_y -53,gameChar_x -9,gameChar_y -51);
        quad(gameChar_x -14,gameChar_y -58,gameChar_x -13,gameChar_y -56,gameChar_x -13,gameChar_y -50,gameChar_x -15,gameChar_y -55);
        quad(gameChar_x +11,gameChar_y -60,gameChar_x +16,gameChar_y -61,gameChar_x +21,gameChar_y -57,gameChar_x +11,gameChar_y -54);
        quad(gameChar_x -14,gameChar_y -52,gameChar_x -24,gameChar_y -60,gameChar_x -17,gameChar_y -62,gameChar_x -9,gameChar_y -60);
        quad(gameChar_x -10,gameChar_y -60,gameChar_x -19,gameChar_y -73,gameChar_x -5,gameChar_y -67,gameChar_x -5,gameChar_y -60);
        quad(gameChar_x -5,gameChar_y -60,gameChar_x -4,gameChar_y -75,gameChar_x +5,gameChar_y -68,gameChar_x +7,gameChar_y -60);
        rect(gameChar_x -14,gameChar_y -60,27,5,20);
        fill(0,0,0);
        ellipse(gameChar_x-5, gameChar_y-47,2,2); //OCZY
        ellipse(gameChar_x+5, gameChar_y-47,2,2); //OCZY
	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds(){
   for(var c1 = 0; c1< cloud1_x.length; c1++){
        noStroke();
        fill(224,255,255,235);
        ellipse(cloud1_x[c1], 150,
                120,
                80);
        ellipse(cloud1_x[c1] +50,
                140, 110,
                75 );
        ellipse(cloud1_x[c1] +100,
                155, 120,
                75 );      
    }
    for(var c2 = 0; c2 <cloud2_x.length; c2++){
        noStroke();
        fill(255,250,250,235);
        ellipse(cloud2_x[c2], 150,
                110 ,
                90 );
        ellipse(cloud2_x[c2]+50,
                140, 130 ,
                65 );
        ellipse(cloud2_x[c2] +50 ,
                190, 90 ,
                65 );
        ellipse(cloud2_x[c2] +100 ,
                156, 120 ,
                85 );
        ellipse(cloud2_x[c2]+150 ,
                215, 50 ,
                40 );
        ellipse(cloud2_x[c2] +185 ,
                235, 30 ,
                20 );          
    }
}

// Function to draw mountains objects.
function drawMountains(){
    for (var z =0; z < mountains_x.length; z++){
        for(var v =0; v<mountains_y.length; v++){
        noStroke();
        fill(255,165,0);
        triangle(mountains_x[z] +579,mountains_y[v] +149, mountains_x[z] +442,mountains_y[v] +148, mountains_x[z] +452,mountains_y[v] +71); 
        triangle(mountains_x[z] +414,mountains_y[v] +139, mountains_x[z] +452,mountains_y[v] +73, mountains_x[z] +442,mountains_y[v] +148); 
        triangle(mountains_x[z] +383,mountains_y[v] +131, mountains_x[z] +452,mountains_y[v] +73, mountains_x[z] +446,mountains_y[v] +145); 
        stroke(255,140,0);
        fill(255,140,0);
        triangle(mountains_x[z] +260,mountains_y[v] +52, mountains_x[z] +339,mountains_y[v] +5, mountains_x[z] +392,mountains_y[v] +59); 
        triangle(mountains_x[z] +324,mountains_y[v] +189, mountains_x[z] +348,mountains_y[v] +56, mountains_x[z] +413,mountains_y[v] +138);  
        triangle(mountains_x[z] +149,mountains_y[v] +188, mountains_x[z] +260,mountains_y[v] +52, mountains_x[z] +324,mountains_y[v] +188); 
        triangle(mountains_x[z] +260,mountains_y[v] +52, mountains_x[z] +324,mountains_y[v] +189, mountains_x[z] +348,mountains_y[v] +56); 
        triangle(mountains_x[z] +324,mountains_y[v] +189, mountains_x[z] +442,mountains_y[v] +148, mountains_x[z] +579,mountains_y[v] +149); 
        triangle(mountains_x[z] +172,mountains_y[v] +241, mountains_x[z] +324,mountains_y[v] +189, mountains_x[z] +579,mountains_y[v] +149); 
        triangle(mountains_x[z] +229,mountains_y[v] +90, mountains_x[z] +250,mountains_y[v] +65, mountains_x[z] +229,mountains_y[v] +64); 
        triangle(mountains_x[z] +150,mountains_y[v] +90, mountains_x[z] +229,mountains_y[v] +64, mountains_x[z] +229,mountains_y[v] +90); 
        triangle(mountains_x[z] +172,mountains_y[v] +241, mountains_x[z] +579,mountains_y[v] +149, mountains_x[z] +710,mountains_y[v] +196); 
        triangle(mountains_x[z] +13,mountains_y[v] +73, mountains_x[z] +150,mountains_y[v] +90, mountains_x[z] +149,mountains_y[v] +188); 
        triangle(mountains_x[z] +13,mountains_y[v] +73, mountains_x[z] +111,mountains_y[v] +14, mountains_x[z] +150,mountains_y[v] +90); 
        triangle(mountains_x[z] +149,mountains_y[v] +188, mountains_x[z] +150,mountains_y[v] +90, mountains_x[z] +229,mountains_y[v] +90); 
            
            
        triangle(mountains_x[z] -116,mountains_y[v] +195,  mountains_x[z] +13,mountains_y[v] +73, mountains_x[z] +149,mountains_y[v] +188); 
            
            
        triangle(mountains_x[z] +13,mountains_y[v] +73, mountains_x[z] +47,mountains_y[v] +138, mountains_x[z] +74,mountains_y[v] +62); 
        triangle(mountains_x[z] -27,mountains_y[v] +155, mountains_x[z]+159,mountains_y[v] +359, mountains_x[z] +325,mountains_y[v] +188);

        noStroke();
        beginShape();
        vertex(mountains_x[z]+ 465,mountains_y[v] +80);
        vertex(mountains_x[z]+537,mountains_y[v]  +28);
        vertex(mountains_x[z]+574,mountains_y[v]  +80);
        vertex(mountains_x[z]+667,mountains_y[v]  +19);
        vertex(mountains_x[z]+756,mountains_y[v]  +109);
        vertex(mountains_x[z]+756,mountains_y[v]  +196);
        vertex(mountains_x[z]+566,mountains_y[v]  +196);
        vertex(mountains_x[z]+542,mountains_y[v]  +128);
        vertex(mountains_x[z]+465,mountains_y[v]  +80);
        endShape();
        fill(255,165,0);
        beginShape();
        vertex(mountains_x[z]+533,mountains_y[v]  +28);
        vertex(mountains_x[z]+574,mountains_y[v]  +80);
        vertex(mountains_x[z]+603,mountains_y[v]  +62);
        vertex(mountains_x[z]+538,mountains_y[v]  +28);
        endShape();
        fill(255,165,0);
        beginShape();
        vertex(mountains_x[z]+667,mountains_y[v]  +19);
        vertex(mountains_x[z]+756,mountains_y[v]  +62);
        vertex(mountains_x[z]+806,mountains_y[v]  +186);
        vertex(mountains_x[z]+667,mountains_y[v]  +19);
        endShape();
            
        fill(255,165,0);
        beginShape();
        vertex(mountains_x[z] +755,mountains_y[v]+62);
        vertex(mountains_x[z] +930,mountains_y[v]+148);
        vertex(mountains_x[z] +783,mountains_y[v] +149);
         endShape();
            
        stroke(255,140,0);
        fill(255,140,0);
        beginShape();
        vertex(128,324);
        vertex(36,382);
        vertex(90,370);
        endShape();
            

        stroke(255,165,0);
        fill(255,165,0);
        triangle(mountains_x[z] +339,mountains_y[v] +5, mountains_x[z] +392,mountains_y[v] +59, mountains_x[z] +452,mountains_y[v] +71); 
        triangle(mountains_x[z] +348,mountains_y[v] +56, mountains_x[z] +413,mountains_y[v] +138, mountains_x[z] +452,mountains_y[v] +71); 
        triangle(mountains_x[z] +353,mountains_y[v] +57, mountains_x[z] +392,mountains_y[v] +59, mountains_x[z] +449,mountains_y[v] +70); 
        triangle(mountains_x[z] +395,mountains_y[v] +64, mountains_x[z] +419,mountains_y[v] +59, mountains_x[z] +450,mountains_y[v] +72); 
        triangle(mountains_x[z] +324,mountains_y[v] +189, mountains_x[z] +413,mountains_y[v] +138, mountains_x[z] +442,mountains_y[v] +148); 
        triangle(mountains_x[z] +229,mountains_y[v] +90, mountains_x[z] +239,mountains_y[v] +65, mountains_x[z] +250,mountains_y[v] +65); 
        triangle(mountains_x[z] +111,mountains_y[v] +14, mountains_x[z] +150,mountains_y[v] +90, mountains_x[z] +201,mountains_y[v] +73); 
        triangle(mountains_x[z] +110,mountains_y[v] +57, mountains_x[z] +133,mountains_y[v] +57, mountains_x[z] +150,mountains_y[v] +90);
            }
    }   
}

// Function to draw trees objects.
function drawTrees(){
    for (var i = 0; i < trees_x.length; i++){
        noStroke();
        fill(210,105,30);
        rect(trees_x[i] -241,floorPos_y -162,10,35);
        rect(trees_x[i] -241,floorPos_y -98,10,35);
        rect(trees_x[i] -241,floorPos_y -34,10,35);
        fill(218,165,32);
        triangle(trees_x[i] -256, floorPos_y -162, trees_x[i] -236, floorPos_y -211, trees_x[i] -216,floorPos_y -162);
        triangle(trees_x[i] -256, floorPos_y -98, trees_x[i] -236,floorPos_y -147, trees_x[i] -216,floorPos_y -98);
        triangle(trees_x[i] -256, floorPos_y -34, trees_x[i] -236,floorPos_y -83, trees_x[i] -216,floorPos_y -34);
    }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------
function drawCanyon(t_canyon){
    strokeWeight(0.6);
    stroke(0,0,0);
    fill(0,0,0);
    rect(t_canyon.x_pos,floorPos_y+1,t_canyon.width,144); 
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon){
    if(gameChar_world_x >t_canyon.x_pos && gameChar_world_x <t_canyon.x_pos +t_canyon.width && gameChar_y >=floorPos_y){
        isPlummeting = true;
        gameChar_y +=4;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------
function drawCollectable(t_collectable){
        //ball
    strokeWeight(3);
    stroke(224,255,255,120);
    fill(255,140,0);
    ellipse(t_collectable.x_pos -120,t_collectable.y_pos+300,t_collectable.size-10,t_collectable.size-10);
    
    noStroke();
    fill(255,165,0);
    ellipse(t_collectable.x_pos-124,t_collectable.y_pos+296,t_collectable.size-20,t_collectable.size-20);
    
    noStroke();
    fill(255,201,20);
    ellipse(t_collectable.x_pos-132,t_collectable.y_pos+290,t_collectable.size-40,t_collectable.size-40);
    ellipse(t_collectable.x_pos-126,t_collectable.y_pos+296,t_collectable.size-45,t_collectable.size-45);
    
    
    fill(237, 34, 93);
    noStroke();
    triangle(t_collectable.x_pos-124,t_collectable.y_pos+304,t_collectable.x_pos-116,t_collectable.y_pos+304,t_collectable.x_pos-120,t_collectable.y_pos+292);
    triangle(t_collectable.x_pos-124,t_collectable.y_pos+302,t_collectable.x_pos-124,t_collectable.y_pos+305,t_collectable.x_pos-120,t_collectable.y_pos+304);
    triangle(t_collectable.x_pos-116,t_collectable.y_pos+302,t_collectable.x_pos-116,t_collectable.y_pos+305,t_collectable.x_pos-120,t_collectable.y_pos+304);
    triangle(t_collectable.x_pos-123,t_collectable.y_pos+303,t_collectable.x_pos-127,t_collectable.y_pos+299,t_collectable.x_pos-121,t_collectable.y_pos+296);
    triangle(t_collectable.x_pos-117,t_collectable.y_pos+303,t_collectable.x_pos-113,t_collectable.y_pos+299,t_collectable.x_pos-119,t_collectable.y_pos+296); 
}
function createSun()
{
    noStroke();
    fill(255,250,205,70);
    ellipse(78,87,180,180, 100)
    stroke(255,215,0);
    fill(255,255,0);
    ellipse(78, 87, 100, 100);    
}

//BACKGROUND LAYERS
function createBackground1()
{
    noStroke();
    fill(178,34,34);
    beginShape(line);
    for(var n=0; n<BGround1.length; n++)
    {
        vertex(BGround1[n].x_pos,BGround1[n].y_pos)
    }
    endShape(); 
}

function createBackground2()
{
    noStroke();
    fill(255,0,0);
    beginShape();
    for(var h=0; h<BGround2.length; h++)
    {
        vertex(BGround2[h].x_pos,BGround2[h].y_pos)
    }
    endShape(); 
    
}

function createBackground3()
{
    noStroke();
    fill(255,89,0);
    beginShape();
    for(var m=0; m<BGround3.length; m++)
        {
            vertex(BGround3[m].x_pos,BGround3[m].y_pos)
        }
    endShape();  
}
// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    var q= dist(gameChar_world_x,gameChar_y,t_collectable.x_pos-120,605);
    if(q <=60){
        t_collectable.isFound =true;
        game_score +=1
    }
}

function renderFlagpole()
{
    push();
    stroke(150);
    fill(0,0,0);
    strokeWeight(3)
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y -300, 10,300);
    if(flagpole.isReached)
    {
        fill(255,160,122);
        rect(flagpole.x_pos, floorPos_y -300, 50,50);
    }
    else
    {
        noStroke();
        fill(255,160,122);
        rect(flagpole.x_pos, floorPos_y -60, 50,50);  
    }
    pop(); 
}

function checkFlagpole()
{
    
    var l = abs(gameChar_world_x - flagpole.x_pos);
    
    if(l < 50)
    {
        flagpole.isReached = true;
    }
}

function createPlatform(x,y,length)
{
    var p ={
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(189,183,107);
            strokeWeight(0.8);
            stroke(0);
            rect(this.x, this.y, this.length, 20)
        
    },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
                {
                    var d = this.y - gc_y; 
                    if( d >= 0 && d < 5)
                        {
                            return true;
                        }
                }
            return false;
        }
    }
    return p;   
}

function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.ranege = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function()
    {
        fill(0,255,255);
        ellipse(this.current_x -5, this.y -25, 50);
        fill(0,191,255);
        ellipse(this.current_x -5, this.y -25, 35);
        
        

    }
    
    this.update = function()
    {
        this.current_x += this.incr;
        
        if(this.current_x < this.x)
            {
                this.incr += 1;
            }
        else if(this.current_x > this.x + this.range)
            {
                this.incr = -1;
            }
    }
    
    this.isContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x,gc_y, this.current_x, this.y);
        
        if(d <25)
            {
                return true;
            }
        return false;
        

    }
}






function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    
	// Variable to control the background scrolling.
	scrollPos = 0;
	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [280, 401, 709, 835 ,942, 990, 1150, 1250, 1356, 1563, 1832, 2021, 2267, 2498, 2742, 2796, 2908, 3120, 3300, 3421, 3599, 3712, 3810, 4178, 4290, 4438, 4600,4900,5300, 5500,5650, 5890, 6120,6260, 6400,6550,6600,6750,7000, 7300, 7500,7700,7900, 8150,8300,8450,8600, 8900,9100,9250,9400,9560,9656,9800,9950, 10100, 10250,10400,10600,10800,11000]
    mountains_x = [116,1500, 3000, 4000 ,6000, 8155, 9000]
    mountains_y = [250]
    cloud1_x = [100,900,1700,2600,3400,4200,5000,5800,6600,7400,8200,9000,9800,10600]
    cloud2_x = [500,1300,2100,2900,3700,4500,5300,6100,6900,7700,8500,9300,10100]
    canyons_x = [
        {x_pos:1420, width:76},
        {x_pos:2400,width:76 },
        {x_pos:3600, width:76},
        {x_pos:4300, width:76},
        {x_pos:5000, width:76},
        {x_pos:5800, width:76},
        {x_pos:6300, width:76},
        {x_pos:6925, width:76},
        {x_pos:7320, width:76},
        {x_pos:7900, width:76},
        {x_pos:8400, width:76},
        {x_pos:8900, width:76},
        {x_pos:9200, width:76},
        {x_pos:9700, width:76}]
    collectables = [
        {x_pos:800, y_pos:305, size:50, isFound:false},
        {x_pos:900, y_pos:305, size:50, isFound:false},
        {x_pos:1300, y_pos:205, size:50, isFound:false},
        {x_pos:1500, y_pos:305, size:50, isFound:false},
        {x_pos:1800, y_pos:205, size:50, isFound:false},
        {x_pos:2000, y_pos:305, size:50, isFound:false},
        {x_pos:2100, y_pos:305, size:50, isFound:false},
        {x_pos:2250, y_pos:305, size:50, isFound:false},
        {x_pos:2700, y_pos:205, size:50, isFound:false},
        {x_pos:2800, y_pos:305, size:50, isFound:false},
        {x_pos:2900, y_pos:305, size:50, isFound:false},
        {x_pos:3100, y_pos:305, size:50, isFound:false},
        {x_pos:3250, y_pos:305, size:50, isFound:false},
        {x_pos:3400, y_pos:305, size:50, isFound:false},
        {x_pos:3700, y_pos:205, size:50, isFound:false},
        {x_pos:3900, y_pos:305, size:50, isFound:false},
        {x_pos:4000, y_pos:305, size:50, isFound:false},
        {x_pos:4100, y_pos:305, size:50, isFound:false},
        {x_pos:4300, y_pos:305, size:50, isFound:false},
        {x_pos:4400, y_pos:305, size:50, isFound:false},
        {x_pos:4700, y_pos:305, size:50, isFound:false},
        {x_pos:4850, y_pos:305, size:50, isFound:false},
        {x_pos:5200, y_pos:205, size:50, isFound:false},
        {x_pos:5400, y_pos:305, size:50, isFound:false},
        {x_pos:5500, y_pos:305, size:50, isFound:false},
        {x_pos:5600, y_pos:305, size:50, isFound:false},
        {x_pos:5800, y_pos:305, size:50, isFound:false},
        {x_pos:6000, y_pos:305, size:50, isFound:false},
        {x_pos:6100, y_pos:305, size:50, isFound:false},
        {x_pos:6400, y_pos:205, size:50, isFound:false},
        {x_pos:6600, y_pos:305, size:50, isFound:false},
        {x_pos:6700, y_pos:305, size:50, isFound:false},
        {x_pos:6900, y_pos:305, size:50, isFound:false},
        {x_pos:7300, y_pos:305, size:50, isFound:false},
        {x_pos:7500, y_pos:305, size:50, isFound:false},
        {x_pos:7600, y_pos:305, size:50, isFound:false},
        {x_pos:8000, y_pos:205, size:50, isFound:false},
        {x_pos:8200, y_pos:305, size:50, isFound:false},
        {x_pos:8400, y_pos:305, size:50, isFound:false},
        {x_pos:8700, y_pos:305, size:50, isFound:false},
        {x_pos:8800, y_pos:305, size:50, isFound:false},
        {x_pos:9100, y_pos:205, size:50, isFound:false},
        {x_pos:9300, y_pos:305, size:50, isFound:false},
        {x_pos:9600, y_pos:205, size:50, isFound:false},
        {x_pos:9900, y_pos:305, size:50, isFound:false},]
    
    BGround3 =[
        {x_pos:0,    y_pos:332},{x_pos:296,  y_pos:468},{x_pos:367,  y_pos:468},{x_pos:411,  y_pos:440},
        {x_pos:456,  y_pos:440},{x_pos:471,  y_pos:417},{x_pos:569,  y_pos:417},{x_pos:657,  y_pos:376},
        {x_pos:1024, y_pos:376},{x_pos:1024, y_pos:700},{x_pos:1024, y_pos:376},{x_pos:1102, y_pos:402},
        {x_pos:1130, y_pos:487},{x_pos:1327, y_pos:417},{x_pos:1416, y_pos:382},{x_pos:1568, y_pos:464},
        {x_pos:1739, y_pos:393},{x_pos:1900, y_pos:426},{x_pos:2005, y_pos:392},{x_pos:2115, y_pos:392},
        {x_pos:2155, y_pos:401},{x_pos:2215, y_pos:392},{x_pos:2235, y_pos:360},{x_pos:2295, y_pos:360},
        {x_pos:2352, y_pos:397},{x_pos:2406, y_pos:383},{x_pos:2500, y_pos:355},{x_pos:2602, y_pos:410},
        {x_pos:2775, y_pos:343},{x_pos:2842, y_pos:408},{x_pos:2856, y_pos:352},{x_pos:2947, y_pos:348},
        {x_pos:3119, y_pos:364},{x_pos:3159, y_pos:410},{x_pos:3452, y_pos:392},{x_pos:3528, y_pos:368},
        {x_pos:3970, y_pos:366},{x_pos:4000, y_pos:333},{x_pos:4184, y_pos:365},{x_pos:4266, y_pos:396},
        {x_pos:4414, y_pos:366},{x_pos:4484, y_pos:365},{x_pos:4556, y_pos:341},{x_pos:4624, y_pos:385},
        {x_pos:4668, y_pos:339},{x_pos:4883, y_pos:352},{x_pos:4979, y_pos:377},{x_pos:5051, y_pos:229},
        {x_pos:5151, y_pos:229},{x_pos:5251, y_pos:377},{x_pos:5429, y_pos:259},{x_pos:5495, y_pos:280},
        {x_pos:5358, y_pos:410},{x_pos:5526, y_pos:409},{x_pos:5589, y_pos:433},{x_pos:5660, y_pos:296},
        {x_pos:5859, y_pos:435},{x_pos:6000, y_pos:397},{x_pos:6200, y_pos:397},{x_pos:6300, y_pos:470},
        {x_pos:6500, y_pos:450},{x_pos:6700, y_pos:375},{x_pos:6950, y_pos:375},{x_pos:7000, y_pos:450},
        {x_pos:7200, y_pos:450},{x_pos:7250, y_pos:374},{x_pos:7350, y_pos:374},{x_pos:7400, y_pos:450},
        {x_pos:7450, y_pos:450},{x_pos:7700, y_pos:469},{x_pos:7920, y_pos:365},{x_pos:8072, y_pos:365},
        {x_pos:8200, y_pos:469},{x_pos:8250, y_pos:469},{x_pos:8300, y_pos:424},{x_pos:8360, y_pos:424},
        {x_pos:8420, y_pos:340},{x_pos:8520, y_pos:340},{x_pos:8630, y_pos:340},{x_pos:8680, y_pos:382},
        {x_pos:8730, y_pos:340},{x_pos:8900, y_pos:320},{x_pos:9100, y_pos:350},{x_pos:9954, y_pos:360},
        {x_pos:11200, y_pos:900},{x_pos:11200,y_pos:700},{x_pos:0,y_pos:700}]
    
    BGround2 =[
        {x_pos:195,  y_pos:527},{x_pos:225,  y_pos:502},{x_pos:315,  y_pos:502},{x_pos:330,  y_pos:519},
        {x_pos:420,  y_pos:519},{x_pos:440,  y_pos:534},{x_pos:510,  y_pos:534},{x_pos:560,  y_pos:495},
        {x_pos:680,  y_pos:495},{x_pos:690,  y_pos:542},{x_pos:720,  y_pos:495},{x_pos:790,  y_pos:495},
        {x_pos:1024, y_pos:430},{x_pos:1024, y_pos:635},{x_pos:1024, y_pos:430},{x_pos:1097, y_pos:467},
        {x_pos:1189, y_pos:544},{x_pos:1270, y_pos:491},{x_pos:1270, y_pos:510},{x_pos:1385, y_pos:417},
        {x_pos:1649, y_pos:492},{x_pos:1657, y_pos:568},{x_pos:1900, y_pos:470},{x_pos:2052, y_pos:408},
        {x_pos:2215, y_pos:405},{x_pos:2233, y_pos:475},{x_pos:2248, y_pos:405},{x_pos:2386, y_pos:420},
        {x_pos:2500, y_pos:510},{x_pos:2570, y_pos:420},{x_pos:2690, y_pos:410},{x_pos:2767, y_pos:565},
        {x_pos:2862, y_pos:392},{x_pos:2884, y_pos:462},{x_pos:2962, y_pos:392},{x_pos:3032, y_pos:450},
        {x_pos:3200, y_pos:392},{x_pos:3480, y_pos:437},{x_pos:3670, y_pos:350},{x_pos:3700, y_pos:550},
        {x_pos:4000, y_pos:350},{x_pos:4110, y_pos:409},{x_pos:4199, y_pos:391},{x_pos:4307, y_pos:427},
        {x_pos:4348, y_pos:368},{x_pos:4400, y_pos:364},{x_pos:4400, y_pos:410},{x_pos:4485, y_pos:364},
        {x_pos:4487, y_pos:390},{x_pos:4585, y_pos:364},{x_pos:4600, y_pos:470},{x_pos:4700, y_pos:364},
        {x_pos:4800, y_pos:460},{x_pos:4900, y_pos:350},{x_pos:5000, y_pos:481},{x_pos:5052, y_pos:327},
        {x_pos:5142, y_pos:327},{x_pos:5178, y_pos:421},{x_pos:5273, y_pos:454},{x_pos:5313, y_pos:465},
        {x_pos:5400, y_pos:457},{x_pos:5567, y_pos:402},{x_pos:5518, y_pos:472},{x_pos:5689, y_pos:447},
        {x_pos:5689, y_pos:372},{x_pos:5859, y_pos:569},{x_pos:6000, y_pos:533},{x_pos:6200, y_pos:485},
        {x_pos:6300, y_pos:560},{x_pos:6450, y_pos:560},{x_pos:6470, y_pos:590},{x_pos:6500, y_pos:560},
        {x_pos:6600, y_pos:560},{x_pos:6670, y_pos:590},{x_pos:6700, y_pos:560},{x_pos:6800, y_pos:560},
        {x_pos:6840, y_pos:449},{x_pos:6976, y_pos:449},{x_pos:7055, y_pos:525},{x_pos:7300, y_pos:525},
        {x_pos:7500, y_pos:600},{x_pos:7585, y_pos:505},{x_pos:7670, y_pos:600},{x_pos:7900, y_pos:495},
        {x_pos:8220, y_pos:565},{x_pos:8520, y_pos:465},{x_pos:8620, y_pos:465},{x_pos:8950, y_pos:545},
        {x_pos:9239, y_pos:381},{x_pos:9360, y_pos:499},{x_pos:9717, y_pos:562},{x_pos:9851, y_pos:435},
        {x_pos:11120, y_pos:665},{x_pos:11120,  y_pos:700},{x_pos:195,  y_pos:700}]

    BGround1 =[
        {x_pos:0  ,  y_pos:493},{x_pos:157,  y_pos:493},{x_pos:220,  y_pos:526},{x_pos:300,  y_pos:526},
        {x_pos:395,  y_pos:558},{x_pos:484,  y_pos:548},{x_pos:1024, y_pos:600},{x_pos:1024, y_pos:635},
        {x_pos:1024, y_pos:600},{x_pos:1032, y_pos:551},{x_pos:1132, y_pos:551},{x_pos:1162, y_pos:591},
        {x_pos:1192, y_pos:551},{x_pos:1192, y_pos:551},{x_pos:1321, y_pos:496},{x_pos:1391, y_pos:486},
        {x_pos:1691, y_pos:635},{x_pos:1706, y_pos:581},{x_pos:1725, y_pos:581},{x_pos:1748, y_pos:635},
        {x_pos:1867, y_pos:550},{x_pos:1900, y_pos:550},{x_pos:1950, y_pos:590},{x_pos:1930, y_pos:610},
        {x_pos:2001, y_pos:585},{x_pos:2125, y_pos:523},{x_pos:2208, y_pos:512},{x_pos:2271, y_pos:572},
        {x_pos:2451, y_pos:538},{x_pos:2500, y_pos:572},{x_pos:2583, y_pos:490},{x_pos:2683, y_pos:490},
        {x_pos:2750, y_pos:540},{x_pos:2813, y_pos:476},{x_pos:2900, y_pos:476},{x_pos:3100, y_pos:540},
        {x_pos:3300, y_pos:440},{x_pos:3500, y_pos:440},{x_pos:3600, y_pos:500},{x_pos:3600, y_pos:550},
        {x_pos:3860, y_pos:500},{x_pos:3860, y_pos:420},{x_pos:3940, y_pos:420},{x_pos:4000, y_pos:560},
        {x_pos:4219, y_pos:600},{x_pos:4444, y_pos:550},{x_pos:4465, y_pos:586},{x_pos:4514, y_pos:607},
        {x_pos:4604, y_pos:597},{x_pos:4719, y_pos:550},{x_pos:4852, y_pos:598},{x_pos:5103, y_pos:541},
        {x_pos:5117, y_pos:430},{x_pos:5190, y_pos:420},{x_pos:5210, y_pos:390},{x_pos:5240, y_pos:387},
        {x_pos:5257, y_pos:576},{x_pos:5289, y_pos:587},{x_pos:5325, y_pos:578},{x_pos:5346, y_pos:554},
        {x_pos:5458, y_pos:494},{x_pos:5700, y_pos:554},{x_pos:5708, y_pos:584},{x_pos:5808, y_pos:584},
        {x_pos:5900, y_pos:554},{x_pos:6000, y_pos:630},{x_pos:6321, y_pos:583},{x_pos:6558, y_pos:583},
        {x_pos:6697, y_pos:637},{x_pos:6851, y_pos:567},{x_pos:7377, y_pos:572},{x_pos:7477, y_pos:646},
        {x_pos:7967, y_pos:640},{x_pos:8286, y_pos:543},{x_pos:8607, y_pos:653},{x_pos:8813, y_pos:599},
        {x_pos:9356, y_pos:586},{x_pos:9415, y_pos:651},{x_pos:10000, y_pos:560},{x_pos:10600, y_pos:700},
        {x_pos:10600, y_pos:700},{x_pos:0,    y_pos:700}]
    game_score = 0;
    flagpole = {x_pos: 10000, isReached: false}
    lives -= 1;
    platforms = [];
    platforms.push(createPlatform(1100,floorPos_y - 100,100));
    platforms.push(createPlatform(1600,floorPos_y - 100,100));
    platforms.push(createPlatform(2500,floorPos_y - 100,100));
    platforms.push(createPlatform(3500,floorPos_y - 100,100));
    platforms.push(createPlatform(5000,floorPos_y - 100,100));
    platforms.push(createPlatform(6200,floorPos_y - 100,100));
    platforms.push(createPlatform(7800,floorPos_y - 100,100));
    platforms.push(createPlatform(8900,floorPos_y - 100,100));
    platforms.push(createPlatform(9400,floorPos_y - 100,100));
    enemies=[];
    enemies.push(new Enemy(0, floorPos_y, 100));
    enemies.push(new Enemy(1600, floorPos_y, 100));
    enemies.push(new Enemy(2500, floorPos_y, 100));
    enemies.push(new Enemy(4500, floorPos_y, 100));
    enemies.push(new Enemy(6500, floorPos_y, 100));
    enemies.push(new Enemy(8500, floorPos_y, 100));

}