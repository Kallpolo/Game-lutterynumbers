////////////////////////////////////////////////////////////
// P2
////////////////////////////////////////////////////////////
var canvas, ctx, w, h, world;
var scaleX = 50, scaleY = -50;

var holder_arr;
var physicsData = {paused:true};
				
function initPhysics(){
	// Init p2.js
	world = new p2.World({gravity:[0,-10]});
}

var ballPhysics_arr = [];
var hitPhysics_arr = [];

function createPhysics(){
	var ballMaterial = new p2.Material();
	var cageMaterial = new p2.Material();
	
	for(var n=0;n<gameData.ballsArray.length;n++){
		ballPhysics_arr.push({shape:'', body:'', material:'', property:{radius:(ballRadius/scaleX)/2}, position:[0, 0]});
		
		ballPhysics_arr[n].shape = new p2.Circle(ballPhysics_arr[n].property);
		ballPhysics_arr[n].material = ballMaterial;
		ballPhysics_arr[n].shape.material = ballPhysics_arr[n].material;
		ballPhysics_arr[n].body = new p2.Body({
		  mass:1,
		  position:ballPhysics_arr[n].position
		});
		ballPhysics_arr[n].body.addShape(ballPhysics_arr[n].shape);
		
		ballPhysics_arr[n].body.position[0] = ((gameData.ballsArray[n].obj.x) - (canvasW/2))/scaleX;
		ballPhysics_arr[n].body.position[1] = ((gameData.ballsArray[n].obj.y) - canvasH)/scaleY;
		ballPhysics_arr[n].body.contactType = 'ball';
		ballPhysics_arr[n].body.velocityTimer = 0;
		ballPhysics_arr[n].body.index = n;
		resetBallTimer(ballPhysics_arr[n].body);
		
		world.addBody(ballPhysics_arr[n].body);
	}
	
	for(var n=0;n<gameData.cageArray.length;n++){
		hitPhysics_arr.push({shape:'', body:'', material:'', property:{radius:(10/scaleX)/2}, position:[0, 0]});
		
		hitPhysics_arr[n].shape = new p2.Circle(hitPhysics_arr[n].property);
		hitPhysics_arr[n].material = cageMaterial;
		hitPhysics_arr[n].shape.material = hitPhysics_arr[n].material;
		hitPhysics_arr[n].body = new p2.Body({
		  mass:0,
		  position:hitPhysics_arr[n].position
		});
		hitPhysics_arr[n].body.addShape(hitPhysics_arr[n].shape);
		
		hitPhysics_arr[n].body.position[0] = ((gameData.cageArray[n].x) - (canvasW/2))/scaleX;
		hitPhysics_arr[n].body.position[1] = ((gameData.cageArray[n].y) - canvasH)/scaleY;
		hitPhysics_arr[n].body.contactType = 'cage';
		
		world.addBody(hitPhysics_arr[n].body);
	}
	
	holder_arr = [{shape:'', body:'', property:{width:1.3, height:1}, position:[0, 0]}];
	//holder
	for(var n=0;n<holder_arr.length;n++){
		holder_arr[n].shape = new p2.Box(holder_arr[n].property);
		holder_arr[n].body = new p2.Body({
		  mass:0,
		  position:holder_arr[n].position
		});
		
		holder_arr[n].body.position[0] = ((gameData.sphereX) - (canvasW/2))/scaleX;
		holder_arr[n].body.position[1] = ((gameData.sphereY+200) - canvasH)/scaleY;
		holder_arr[n].body.addShape(holder_arr[n].shape);
		holder_arr[n].body.contactType = 'cage';
		world.addBody(holder_arr[n].body);
	}
	
	/*var boxVsCage = new p2.ContactMaterial(cageMaterial, ballMaterial, {
		friction: 5,
		restitution: 1,
		surfaceVelocity:5
	});
	world.addContactMaterial(boxVsCage);*/

	world.on('beginContact', function (evt){
		if(evt.bodyA.contactType == 'ball' && evt.bodyB.contactType == 'cage'){
			setBallVelocity(evt.bodyA);
		}else if(evt.bodyA.contactType == 'cage' && evt.bodyB.contactType == 'ball'){
			setBallVelocity(evt.bodyB);
		}
	});
	
	// Disable any equations between the current passthrough body and the character
	world.on('preSolve', function (evt){
		for(var i=0; i<evt.contactEquations.length; i++){
			var eq = evt.contactEquations[i];
			eq.enabled = checkCollision(eq);
			
			if(eq.bodyA.contactType == 'ball' && eq.bodyB.contactType == 'cage'){
				setBallVelocity(eq.bodyA);
			}else if(eq.bodyA.contactType == 'cage' && eq.bodyB.contactType == 'ball'){
				setBallVelocity(eq.bodyB);
			}
		}
		
		for(var i=0; i<evt.frictionEquations.length; i++){
			var eq = evt.frictionEquations[i];
			eq.enabled = checkCollision(eq);
			
			if(eq.bodyA.contactType == 'ball' && eq.bodyB.contactType == 'cage'){
				setBallVelocity(eq.bodyA);
			}else if(eq.bodyA.contactType == 'cage' && eq.bodyB.contactType == 'ball'){
				setBallVelocity(eq.bodyB);
			}
		}
	});

	world.on('endContact', function (evt){
		
	});
}

function checkCollision(eq){
	var enable = true;
	
	if((eq.bodyA.contactType === 'ball' && eq.bodyB.contactType === 'cage' && gameData.winArray.indexOf(eq.bodyA.index) != -1)){
		enable = false;
	}else if((eq.bodyA.contactType === 'ball' && eq.bodyB.contactType === 'cage' && gameData.winArray.indexOf(eq.bodyA.index) != -1)){
		enable = false;
	}else if((eq.bodyA.contactType === 'cage' && eq.bodyB.contactType === 'ball' && gameData.winArray.indexOf(eq.bodyB.index) != -1)){
		enable = false;
	}else if((eq.bodyA.contactType === 'ball' && eq.bodyB.contactType === 'ball')){
		enable = false;
	}
	return enable;
}

function renderPhysics(){
	for(var n=0;n<ballPhysics_arr.length;n++){
		if(gameData.winArray.indexOf(n) != -1){
			ballPhysics_arr[n].body.velocity[0] = 0;
			ballPhysics_arr[n].body.velocity[1] = 0;
		}else{
			ballPhysics_arr[n].body.velocityTimer--;
			
			var x = ballPhysics_arr[n].body.position[0],
				y = ballPhysics_arr[n].body.position[1];
			
			var targetBall = gameData.ballsArray[n].obj;
			targetBall.x = (canvasW/2) + (x * scaleX);
			targetBall.y = canvasH + (y * scaleY);
			targetBall.rotation = (ballPhysics_arr[n].body.angle) * 180 / Math.PI;
		}
		
		updateBallRotate(n, ballPhysics_arr[n].body.velocity[0], ballPhysics_arr[n].body.velocity[1], ballPhysics_arr[n].body.angle);
	}
	
	for(var n=0;n<hitPhysics_arr.length;n++){
		var targetHit = gameData.cageArray[n];
		hitPhysics_arr[n].body.position[0] = ((targetHit.x) - (canvasW/2))/scaleX;
		hitPhysics_arr[n].body.position[1] = ((targetHit.y) - canvasH)/scaleY;
	}
}

function resetBallTimer(targetBody){
	targetBody.velocityTimer = randomIntFromInterval(30,100);
}

function resetBallsTimer(){
	for(var n=0;n<ballPhysics_arr.length;n++){
		ballPhysics_arr[n].body.position[0] = ((gameData.ballsArray[n].obj.x) - (canvasW/2))/scaleX;
		ballPhysics_arr[n].body.position[1] = ((gameData.ballsArray[n].obj.y) - canvasH)/scaleY;
		resetBallTimer(ballPhysics_arr[n].body);
	}	
}

function setBallVelocity(targetBody){
	if(gameData.winArray.indexOf(targetBody.index) != -1){
		return;
	}
	
	if(targetBody.velocityTimer < 0){
		var veloX = 0;
		var veloY = 0;
		
		if(radiusTweenData.radius < 3){
			veloX = randomIntFromInterval(-3,3);
			veloY = randomIntFromInterval(2,5);
		}else if(radiusTweenData.radius < 8){
			veloX = randomIntFromInterval(-3,5);
			veloY = randomIntFromInterval(5,10);
		}else{
			veloX = randomIntFromInterval(-3,10);
			veloY = randomIntFromInterval(10,20);
		}
		
		targetBody.velocity[0] += veloX;
		targetBody.velocity[1] += veloY;
		resetBallTimer(targetBody);
	}
}

//p2 loop
function updatePhysics(){
	world.step(1/60);
	renderPhysics();
}