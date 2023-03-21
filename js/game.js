////////////////////////////////////////////////////////////
// GAME v2.0
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

var selectTextDisplay = 'Select [NUMBER] Numbers'; //select number text display
var ballRadius = 60; //ball radius
var totalBall = 36; //total balls
var rotateBall = true; //rotate balls in 3d angle
var numberStartZero = false; //number start from zero instead of one

var spinDirection = true; //true for anticlockwise
var spinStartSpeed = 5; //spin starting speed
var spinEndSpeed = 5; //spin ending speed
var spinSpeed = 10; //spin speed
var revealTimer = 6; //reveal ball timer

var prizeTableDisplay = 'Score Table'; //score table text display
var numberTextDisplay = 'Your Numbers'; //your score text display
var matchTextDisplay = 'MATCH [NUMBER]'; //match text display
var scoreTextDisplay = '[NUMBER]PTS'; //prize score text display

var bonusBall = true; //toggle bonus ball
var bonusTextDisplay = 'MATCH [NUMBER] + BONUS'; //match bonus text display

var enablePercentage = false; //option to have result base on percentage

//score points array and also the total number to reveal
var score_arr = [
					{prize:50, percent:25},
					{prize:100, percent:20},
					{prize:500, percent:15},
					{prize:1000, percent:10},
					{prize:10000, percent:5},
					{prize:100000, percent:1}
];

//bonus score point
var bonusScore = [
					{prize:50000, percent:3}
];

var exitMessage = 'ARE YOUR SURE\nYOU WANT TO QUIT THE GAME?'; //go to main page message
var resultCompleteText = 'YOU WON [NUMBER]PTS!'; //result complete text display
var resultFailText = 'YOU DIDN\'T WIN!';  //result fail text display

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareText = 'SHARE THIS GAME'; //social share message
var shareTitle = 'Highscore on Lottery Numbers Game is [SCORE]PTS.';//social share score title
var shareMessage = '[SCORE]PTS is mine new highscore on Lottery Numbers Game! Try it now!'; //social share score message
				
/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */

var playerData = {score:0};
var gameData = {paused:true, sphereX:400, sphereY:325, cageRadius:225, radius:0, spin:false, selectNum:0, numberNum:0, numberArray:[], selectArray:[], winArray:[], buttonArray:[], indexArray:[], dimArray:[], matchNum:0, ballsArray:[], cageArray:[], revealArray:[], totalBall:[], ballNumber:[]};
var radiusTweenData = {radius:0};
var soundTweenData = {volume:0};
var optimizeData = {balls:40};
var cardData = {max:36, page:1, maxPage:0};
var ballData = {radius:60, scale:1};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	if($.browser.mobile || isTablet){
		
	}else{
		var isInIframe = (window.location != window.parent.location) ? true : false;
		if(isInIframe){
			$(window).blur(function() {
				appendFocusFrame();
			});
			appendFocusFrame();
        }
	}
	
	if(enablePercentage){
		createPercentage();	
	}
	
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('game');
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		toggleConfirm(true);
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		toggleConfirm(false);
		stopGame();
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		toggleConfirm(false);
	});
	
	buttonLucky.cursor = "pointer";
	buttonLucky.addEventListener("click", function(evt) {
		playSound('soundRandom')
		randomizeNumber();
	});
	
	buttonSphereStart.cursor = "pointer";
	buttonSphereStart.addEventListener("click", function(evt) {
		startSpin();
	});
	
	buttonLeft.cursor = "pointer";
	buttonLeft.addEventListener("click", function(evt) {
		playSound('soundClick');
		toggleNumberCard(false);
	});
	
	buttonRight.cursor = "pointer";
	buttonRight.addEventListener("click", function(evt) {
		playSound('soundClick');
		toggleNumberCard(true);
	});
}

function appendFocusFrame(){
	$('#mainHolder').prepend('<div id="focus" style="position:absolute; width:100%; height:100%; z-index:1000;"></div');
	$('#focus').click(function(){
		$('#focus').remove();
	});	
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
		break;
		
		case 'game':
			targetContainer = gameContainer;
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			
			if(gameData.matchNum != -1){
				playSound('soundComplete');
				resultTitleTxt.text = resultCompleteText.replace('[NUMBER]', addCommas(playerData.score));
				saveGame(playerData.score);
			}else{
				playSound('soundFail');
				resultTitleTxt.text = resultFailText;
				saveGame(0);
			}
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

function toggleConfirm(con){
	confirmContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		gameData.paused = true;
	}else{
		TweenMax.resumeAll(true, true)
		gameData.paused = false;
	}
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */

function startGame(){
	playerData.score = 0;
	
	gameData.spin = false;
	gameData.selectArray = [];
	gameData.winArray = [];
	gameData.radius = 0;
	gameData.matchNum = -1;
	gameData.numberNum = 0;
	radiusTweenData.radius = 0;
	
	resetCard();
	shuffle(gameData.numberArray);
	shuffle(gameData.indexArray);
	
	var thisTotalBall = totalBall > optimizeData.balls ? optimizeData.balls : totalBall;
	for(var n=0; n<thisTotalBall; n++){
		var targetIndex = gameData.indexArray[n];
		var targetBall = gameData.ballsArray[targetIndex].obj;
		targetBall.scaleX = targetBall.scaleY = ballData.scale * .9;
		
		targetBall.x = randomIntFromInterval(gameData.sphereX-100,gameData.sphereX+100);
		targetBall.y = gameData.sphereY;
		ballsContainer.setChildIndex(targetBall, n);
	}
	resetBallsTimer();
	
	//randomize numbers
	gameData.ballNumber = [];
	
	shuffle(gameData.totalBall);
	for(var n=0; n<gameData.ballsArray.length; n++){
		var currentNumber = Number(gameData.totalBall[n]);
		gameData.ballNumber.push({index:n, number:currentNumber, status:false});
		if(numberStartZero){
			currentNumber = pad(currentNumber,2);
		}else{
			currentNumber = pad(currentNumber+1,2);	
		}

		for(var p=0; p<gameData.ballsArray[n].text.length; p++){
			gameData.ballsArray[n].text[p].text = currentNumber;
			gameData.ballsArray[n].rotate.cache(-30, -30, 120, 120);
		}
	}
	
	var extraBall = bonusBall == true ? 1 : 0;
	var totalNum = score_arr.length+extraBall;
	for(var n=0; n<totalNum;n++){
		$.prize['bg'+n] .alpha = 1;
		$.prize['bgselect'+n].alpha = 1;
		$.prize['text'+n].color = $.prize['score'+n].color = "#8d6d2c";
	}
	
	//gameData.revealArray = [12,25,10,3,5,15];
	
	itemBarUser.visible = false;
	buttonSphereStart.visible = true;
	buttonLucky.visible = true;
	cardContainer.visible = true;
	tableContainer.visible = false;
	
	gameData.paused = false;
	setRevealBalls();
	playSoundLoop('soundBalls');
	setSoundVolume('soundBalls',0.1);
	playSoundLoop('soundCage');
	setSoundVolume('soundCage',0.1);
		
	selectTitleTxt.text = selectTextDisplay.replace('[NUMBER]', score_arr.length);
	
	cardData.page = 1;
	toggleNumberCard(false);
	
	displayNumberCard();
}

/*!
 * 
 * START SPIN - This is the function that runs to start spin
 * 
 */
function startSpin(){
	gameData.selectArray = [];
	
	for(var n = 0; n<totalBall; n++){
		var targetNumber = gameData.buttonArray[n].bg;
		if(targetNumber.isSelected){
			gameData.selectArray.push(n);	
		}
	}
	
	if(gameData.selectArray.length == score_arr.length){
		//memberpayment
		if(typeof memberData != 'undefined'){
			if(!checkMemberGameType()){
				goMemberPage('user');
				return;
			}else{
				playerData.chance--;
				updateUserPoint();
			}
		}
		
		
		playSound('soundStartSpin');
		
		itemBarUser.visible = true;
		buttonSphereStart.visible = false;
		buttonLucky.visible = false;
		cardContainer.visible = false;
		tableContainer.visible = true;
		
		selectTitleTxt.text = prizeTableDisplay;
		
		shuffle(gameData.numberArray);
		setSelectBalls();
		gameData.spin = true;
		
		if(gameData.revealArray.length == 0 && enablePercentage){
			getResultOnPercent();	
		}
		
		if(gameData.revealArray.length == 0){
			var extraBall = bonusBall == true ? 1 : 0;
			for(var b = 0; b < score_arr.length+extraBall; b++){
				gameData.revealArray.push(gameData.numberArray[b]);
			}
		}
		
		for(var n=0; n<gameData.revealArray.length; n++){
			var currentNumber = gameData.revealArray[n];
			
			for(var p=0; p<gameData.ballNumber.length; p++){
				if(currentNumber == gameData.ballNumber[p].number){
					gameData.ballNumber[p].status = true;
				}
			}
		}
		
		TweenMax.to(radiusTweenData, spinStartSpeed, {radius:spinSpeed, overwrite:true, onComplete:beginWinNumberTimer});
		TweenMax.to(soundTweenData, spinStartSpeed, {volume:1, overwrite:true, onUpdate:updateBallsVolume});
	}
}

function updateBallsVolume(){
	setSoundVolume('soundBalls', soundTweenData.volume);	
	setSoundVolume('soundCage', soundTweenData.volume);
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	stopSoundLoop('soundBalls');
	stopSoundLoop('soundCage');
	
	gameData.paused = true;
	gameData.spin = false;
	gameData.selectArray = [];
	gameData.winArray = [];
	gameData.revealArray = [];
	gameData.radius = 0;
	radiusTweenData.radius = 0;
	TweenMax.killAll();
	
	ballsSelectContainer.removeAllChildren();
	ballsRevealContainer.removeAllChildren();
}

/*!
 * 
 * SAVE GAME - This is the function that runs to save game
 * 
 */
function saveGame(score){
	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * READY GAME - This is the function that runs to setup card and physics
 * 
 */
function readyGame(){
	var startX = 707;
	var startY = 260;
	var currentX = startX;
	var currentY = startY;
	var spaceX = 65;
	var spaceY = 55;
	var columnNum = 0;
	
	var countNum = 0;
	for(var n = 0; n<totalBall; n++){
		gameData.totalBall.push(n);
		
		var newNumberBg = itemNumberBg.clone();
		var newNumberSelectBg = itemNumberSelectBg.clone();
		
		newNumberBg.x = currentX;
		newNumberBg.y = currentY;
		
		newNumberSelectBg.x = currentX;
		newNumberSelectBg.y = currentY;
		
		var newText = new createjs.Text();
		newText.font = "35px quantifybold";
		newText.color = "#000";
		newText.textAlign = "center";
		newText.textBaseline='alphabetic';
		if(numberStartZero){
			newText.text = pad(n,2);
		}else{
			newText.text = pad(n+1,2);	
		}
		newText.x = currentX;
		newText.y = currentY+11;
		
		newNumberBg.highlight = newNumberSelectBg;
		newNumberBg.text = newText;
		
		cardContainer.addChild(newNumberBg, newNumberSelectBg, newText);
		gameData.buttonArray.push({bg:newNumberBg, select:newNumberSelectBg, text:newText});
		
		newNumberBg.cursor = "pointer";
		newNumberBg.addEventListener("click", function(evt) {
			if(!gameData.spin){
				playSound('soundNumber')
				toggleNumber(evt.target);
			}
		});
		
		currentX += spaceX;
		
		columnNum++;
		if(columnNum > 5){
			columnNum = 0;
			currentX = startX;
			currentY += spaceY;	
		}
		
		countNum++;
		if(countNum >= cardData.max){
			countNum = 0;
			 currentX = startX;
			currentY = startY; 
		}
		
		gameData.numberArray.push(n);
	}
	
	var thisTotalBall = totalBall > optimizeData.balls ? optimizeData.balls : totalBall;
	for(var n=0; n<thisTotalBall; n++){
		gameData.indexArray.push(n);
		createBall(n);
	}
	
	itemBarBonus.visible = false;
	if(bonusBall){
		itemBar.visible = false;
		itemBarBonus.visible = true;	
	}
	
	cardData.maxPage=totalBall/cardData.max;
	if (String(cardData.maxPage).indexOf('.') > -1){
		cardData.maxPage=Math.floor(cardData.maxPage)+1;
	}
	
	createCages();
	createPhysics();
}

function toggleNumber(obj){	
	if(!obj.highlight.visible){
		if(gameData.selectNum < score_arr.length){
			obj.isSelected = true;
			
			if(obj.visible){
				obj.highlight.visible = true;
				obj.text.color = "#fff";
			}
			gameData.selectNum++;
		}
	}else{
		obj.isSelected = false;
		
		if(obj.visible){
			obj.highlight.visible = false;
			obj.text.color = "#000";
		}
		gameData.selectNum--;
	}
}

function toggleNumberCard(con){
	if(con){
		cardData.page++;
		cardData.page = cardData.page > cardData.maxPage ? cardData.maxPage : cardData.page;
	}else{
		cardData.page--;
		cardData.page = cardData.page < 1 ? 1 : cardData.page;
	}
	
	buttonLeft.visible = false;
	if(cardData.page > 1){
		buttonLeft.visible = true;
	}
	
	buttonRight.visible = false;
	if(cardData.page != cardData.maxPage && cardData.maxPage > 1){
		buttonRight.visible = true;
	}
	
	displayNumberCard();
}

function displayNumberCard(){
	var startNum = (cardData.page-1) * cardData.max;
	var endNum = startNum + cardData.max;
	
	for(var n=0; n<gameData.buttonArray.length; n++){
		gameData.buttonArray[n].text.color = "#000";
		gameData.buttonArray[n].bg.visible = false;
		gameData.buttonArray[n].select.visible = false;
		gameData.buttonArray[n].text.visible = false;
		
		if(n >= startNum && n< endNum){
			gameData.buttonArray[n].bg.visible = true;
			gameData.buttonArray[n].text.visible = true;
			
			if(gameData.buttonArray[n].bg.isSelected){
				gameData.buttonArray[n].select.visible = true;
				gameData.buttonArray[n].text.color = "#fff";
			}
		}
	}
}

/*!
 * 
 * RESET CARD - This is the function that runs to reset card
 * 
 */
function resetCard(){
	gameData.selectNum = 0;
	
	for(var n = 0; n<totalBall; n++){
		var targetNumber = gameData.buttonArray[n].bg;
		targetNumber.isSelected = false;
		targetNumber.highlight.visible = false;
		targetNumber.text.color = "#000";
	}	
}

/*!
 * 
 * RANDOMIZE NUMBERS - This is the function that runs to randomize numbers
 * 
 */
function randomizeNumber(){
	resetCard();
	shuffle(gameData.numberArray);	
	for(var n=0; n<score_arr.length; n++){
		toggleNumber(gameData.buttonArray[gameData.numberArray[n]].bg);	
	}
}

/*!
 * 
 * LOOP UPDATE GAME - This is the function that runs to update game loop
 * 
 */

function updateGame(){
	spinCage();
	updatePhysics();
	
	if(spinDirection){
		gameData.radius -= radiusTweenData.radius;
		gameData.radius = gameData.radius < -360 ? 0 : gameData.radius;
	}else{
		gameData.radius += radiusTweenData.radius;
		gameData.radius = gameData.radius > 360 ? 0 : gameData.radius;		
	}
	itemStick.rotation = itemShine.rotation = gameData.radius;
}

/*!
 * 
 * CREATE BALL - This is the function that runs to create ball
 * 
 */
function createBall(number){
	var newBallContainer = new createjs.Container();
	var newBall = itemBallBg.clone();
	newBall.x = 0;
	newBall.y = 0;
	newBall.regX = 30;
	newBall.regY = 30;
	
	var newBallShadow = itemBallShadow.clone();
	newBallShadow.x = 0;
	newBallShadow.y = 0;
	
	var ballNumber;
	if(numberStartZero){
		ballNumber = pad(number,2);
	}else{
		ballNumber = pad(number+1,2);	
	}
	
	var space = 53;
	var newText = new createjs.Text();
	newText.font = "25px quantifybold";
	newText.color = "#000";
	newText.textAlign = "center";
	newText.textBaseline='alphabetic';
	newText.text = ballNumber;
	newText.x = 0;
	newText.y = 10;
	
	var newText2 = new createjs.Text();
	newText2.font = "25px quantifybold";
	newText2.color = "#000";
	newText2.textAlign = "center";
	newText2.textBaseline='alphabetic';
	newText2.text = ballNumber;
	newText2.x = space;
	newText2.y = 10;
	
	var newText3 = new createjs.Text();
	newText3.font = "25px quantifybold";
	newText3.color = "#000";
	newText3.textAlign = "center";
	newText3.textBaseline='alphabetic';
	newText3.text = ballNumber;
	newText3.x = 0;
	newText3.y = space+10;
	
	var newText4 = new createjs.Text();
	newText4.font = "25px quantifybold";
	newText4.color = "#000";
	newText4.textAlign = "center";
	newText4.textBaseline='alphabetic';
	newText4.text = ballNumber;
	newText4.x = space;
	newText4.y = space+10;
	
	var newBallInsideContainer = new createjs.Container();
	newBallInsideContainer.addChild(newBall, newText, newText2, newText3, newText4);
	
	var ballMask = new createjs.Shape();
	ballMask.graphics.beginFill('red').drawCircle(0,0,30);
	newBallInsideContainer.cache(-30, -30, 120, 120);
	newBallInsideContainer.mask = ballMask;
	
	ballData.scale = ballRadius/ballData.radius;
	newBallContainer.x = randomIntFromInterval(gameData.sphereX-150, gameData.sphereX+150);
	newBallContainer.y = gameData.sphereY;
	newBallContainer.addChild(newBallShadow, newBallInsideContainer);
	newBallContainer.scaleX = newBallContainer.scaleY = ballData.scale;
	
	ballsContainer.addChild(newBallContainer);
	gameData.ballsArray.push({obj:newBallContainer, rotate:newBallInsideContainer, text:[newText,newText2,newText3,newText4]});
}

function updateBallRotate(num, velX, velY, angle){
	if(!rotateBall){
		return;	
	}
	
	var targetBall = gameData.ballsArray[num].obj;
	var targetRotateBall = gameData.ballsArray[num].rotate;
	
	targetRotateBall.x += velX;
	targetRotateBall.y += velY;
	
	var end = -53;
	targetRotateBall.x = targetRotateBall.x > 0 ? end : targetRotateBall.x;
	targetRotateBall.x = targetRotateBall.x < end ? 0 : targetRotateBall.x;
	
	targetRotateBall.y = targetRotateBall.y > 0 ? end : targetRotateBall.y;
	targetRotateBall.y = targetRotateBall.y < end ? 0 : targetRotateBall.y;
}

function createCages(){
	var totalNum = 35;
	var wheelRadius = 360 / totalNum;
	
	for(var n=0; n<totalNum; n++){
		var currentRadius = wheelRadius * n;
		var newPos = getAnglePositionByValue(gameData.sphereX, gameData.sphereY, gameData.cageRadius, currentRadius);
		var newHit = itemBallHit.clone();
		newHit.x = newPos.x;
		newHit.y = newPos.y;
		newHit.radius = currentRadius;
		
		gameData.cageArray.push(newHit);
	}
}

function spinCage(){
	for(var n=0; n<gameData.cageArray.length; n++){
		var targetHit = gameData.cageArray[n];
		var newPos = getAnglePositionByValue(gameData.sphereX, gameData.sphereY, gameData.cageRadius, targetHit.radius+gameData.radius);
		targetHit.x = newPos.x;
		targetHit.y = newPos.y;
	}
}

/*!
 * 
 * WIN NUMBERS - This is the function that runs to reveal win numbers
 * 
 */
 
function beginWinNumberTimer(){
	TweenMax.to(ballsContainer, revealTimer, {overwrite:true, onComplete:revealWinNumber});	
}

function revealWinNumber(){
	var tweenNum = gameData.revealArray[gameData.numberNum];
	var revealNum = gameData.revealArray[gameData.numberNum];
	
	var findBallClone = false;
	for(var p=0; p<gameData.ballNumber.length; p++){
		if(tweenNum == gameData.ballNumber[p].number){
			findBallClone = true;
			tweenNum = gameData.ballNumber[p].index;
			p = gameData.ballNumber.length;
		}
	}
	
	if(!findBallClone){
		for(var p=0; p<gameData.ballNumber.length; p++){
			if(!gameData.ballNumber[p].status){
				gameData.ballNumber[p].status = true;
				tweenNum = gameData.ballNumber[p].index;
				p = gameData.ballNumber.length;
			}
		}
	}
	
	gameData.revealIndex = tweenNum;
	gameData.winArray.push(tweenNum);
	
	var targetBall = gameData.ballsArray[tweenNum].obj;
	var targetBallRotate = gameData.ballsArray[tweenNum].rotate;
	var currentNumber = gameData.revealArray[gameData.numberNum];
	if(numberStartZero){
		currentNumber = pad(currentNumber,2);
	}else{
		currentNumber = pad(currentNumber+1,2);	
	}
	for(var p=0; p<gameData.ballsArray[tweenNum].text.length; p++){
		gameData.ballsArray[tweenNum].text[p].text = currentNumber;
		gameData.ballsArray[tweenNum].rotate.cache(-30, -30, 120, 120);
	}
	gameData.numberNum++;
	
	playSound('soundSuck');
	TweenMax.to(targetBallRotate, .5, {x:0, y:0, rotation:0, overwrite:true});
	TweenMax.to(targetBall, .5, {x:gameData.sphereX, y:canvasH/100 * 71, rotation:0, scaleX:1, scaleY:1, overwrite:true, onComplete:function(){
		playSound('soundReveal');
		setRevealBalls();
		matchWinBalls(revealNum);
		
		TweenMax.to(targetBall, .2, {delay:1, x:gameData.sphereX, y:canvasH/100 * 80, rotation:0, overwrite:true});
	}});
	
	var extraBall = bonusBall == true ? 1 : 0;
	if(gameData.numberNum < score_arr.length+extraBall){
		beginWinNumberTimer();
	}else{
		endGame();
	}
}

/*!
 * 
 * REVEAL BALLS - This is the function that runs to reveal balls
 * 
 */
function setRevealBalls(){
	ballsRevealContainer.removeAllChildren();
	
	var extraBall = bonusBall == true ? 1 : 0;
	var totalBalls = score_arr.length + extraBall;
	var totalSplit = Math.floor(totalBalls/2);
	var spaceX = 65;
	var startX = itemBar.x - (spaceX * totalSplit);
	
	if(isEven(totalBalls)){
		startX += spaceX/2;		
	}
	if(bonusBall){
		startX -= spaceX/5;	
	}
	var startY = itemBar.y-3;
	
	for(var n=0; n<score_arr.length; n++){
		if(n<gameData.winArray.length){
			var currentBallRotate = gameData.ballsArray[gameData.winArray[n]].rotate;
			currentBallRotate.x = currentBallRotate.y = 0;
			var newGuessBall = gameData.ballsArray[gameData.winArray[n]].obj.clone(true);
			newGuessBall.x = startX;
			newGuessBall.y = startY;	
		}else{
			var newGuessBall = itemBallGuess.clone();
			newGuessBall.x = startX;
			newGuessBall.y = startY;		
		}
		
		ballsRevealContainer.addChild(newGuessBall);
		startX += spaceX;
	}
	
	if(bonusBall){
		startX += spaceX/3;
		
		if(gameData.winArray.length > score_arr.length){
			var currentBallRotate = gameData.ballsArray[gameData.winArray[gameData.winArray.length-1]].rotate;
			currentBallRotate.x = currentBallRotate.y = 0;
			var newGuessBall = gameData.ballsArray[gameData.winArray[gameData.winArray.length-1]].obj.clone(true);
			newGuessBall.x = startX;
			newGuessBall.y = startY;		
		}else{
			var newGuessBall = itemBallBonus.clone();
			newGuessBall.x = startX;
			newGuessBall.y = startY;	
		}
		
		ballsRevealContainer.addChild(newGuessBall);	
	}
}

/*!
 * 
 * SELECT BALLS - This is the function that runs to select balls
 * 
 */
function setSelectBalls(){
	ballsSelectContainer.removeAllChildren();
	gameData.dimArray = []
	
	var totalSplit = Math.floor(score_arr.length/2);
	var spaceX = 65;
	var startX = itemBarUser.x - (spaceX * totalSplit);
	if(isEven(score_arr.length)){
		startX += spaceX/2;		
	}
	var startY = itemBarUser.y-3;
	
	var storeNumber = gameData.ballsArray[0].text[0].text;
	
	for(var n=0; n<gameData.selectArray.length; n++){
		var currentBallRotate = gameData.ballsArray[0].rotate;
		currentBallRotate.x = currentBallRotate.y = 0;
		
		//set current number
		var currentNumber = gameData.selectArray[n];
		if(numberStartZero){
			currentNumber = pad(currentNumber,2);
		}else{
			currentNumber = pad(currentNumber+1,2);	
		}
		for(var p=0; p<gameData.ballsArray[n].text.length; p++){
			gameData.ballsArray[0].text[p].text = currentNumber;
			gameData.ballsArray[0].rotate.cache(-30, -30, 120, 120);
		}
		
		var newGuessBall = gameData.ballsArray[0].obj.clone(true);
		newGuessBall.scaleX = newGuessBall.scaleY = 1;
		newGuessBall.x = startX;
		newGuessBall.y = startY;
		newGuessBall.rotation = 0;
		
		var newDimBall = itemBallDim.clone();
		newDimBall.x = startX;
		newDimBall.y = startY;
		newDimBall.active = true;
		newDimBall.selectNumber = gameData.selectArray[n];
		gameData.dimArray.push(newDimBall);
		
		startX += spaceX;
		ballsSelectContainer.addChild(newGuessBall, newDimBall);
	}
	
	//set back number
	for(var p=0; p<gameData.ballsArray[n].text.length; p++){
		gameData.ballsArray[0].text[p].text = storeNumber;
		gameData.ballsArray[0].rotate.cache(-30, -30, 120, 120);
	}
}

/*!
 * 
 * MATCH PRIZE - This is the function that runs to match prize
 * 
 */
function matchWinBalls(number){	
	var oldMatch = gameData.matchNum;
	
	for(var n=0; n<gameData.selectArray.length; n++){
		//if(gameData.winArray.indexOf(gameData.selectArray[n]) != -1){
		if(gameData.dimArray[n].selectNumber == number){
			if(gameData.dimArray[n].active){
				gameData.matchNum++;
				gameData.dimArray[n].active = false;
				animateHighlight(gameData.dimArray[n]);
			}
		}
	}
	
	if(oldMatch == gameData.matchNum){
		return;	
	}
	
	var extraBall = bonusBall == true ? 1 : 0;
	var totalMatchNum = score_arr.length+extraBall;
	totalMatchNum--;
	
	for(var n=0; n<score_arr.length;n++){
		if(gameData.matchNum == n){
			var targetNum = totalMatchNum - n;
			if(bonusBall && gameData.matchNum == (score_arr.length-1)){
				if(gameData.winArray.length > score_arr.length){
					//bonus
				}else{
					targetNum = 0;		
				}
			}
			TweenMax.to($.prize['bg'+targetNum], 1, {overwrite:true, onComplete:animatePrize, onCompleteParams:[targetNum]});
		}
	}
}

function animatePrize(num){
	var extraBall = bonusBall == true ? 1 : 0;
	for(var n=0; n<score_arr.length+extraBall;n++){
		$.prize['bg'+n].alpha = 1;
		$.prize['bgselect'+n].alpha = 1;
		$.prize['text'+n].color = $.prize['score'+n].color = "#8d6d2c";
	}
	
	playSound('soundWin');
	animateHighlight($.prize['bg'+num]);
	$.prize['text'+num].color = $.prize['score'+num].color = "#fff";	
	playerData.score = $.prize['score'+num].score;
}

/*!
 * 
 * ANIMATE HIGHLIGHT - This is the function that runs to animate highlight
 * 
 */
function animateHighlight(obj){
	TweenMax.to(obj, .1, {alpha:.2, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .1, {alpha:1, overwrite:true, onComplete:function(){
			TweenMax.to(obj, .1, {alpha:.2, overwrite:true, onComplete:function(){
				TweenMax.to(obj, .1, {alpha:1, overwrite:true, onComplete:function(){
					TweenMax.to(obj, .1, {alpha:0, overwrite:true, onComplete:function(){
		
					}});
				}});
			}});
		}});
	}});
}

/*!
 * 
 * END GAME - This is the function that runs to end game
 * 
 */
function endGame(){
	TweenMax.to(radiusTweenData, spinEndSpeed, {radius:0, overwrite:true});
	TweenMax.to(soundTweenData, spinEndSpeed, {volume:.1, overwrite:true, onUpdate:updateBallsVolume});
		
	TweenMax.to(ballsContainer, 4, {overwrite:true, onComplete:function(){
		//memberpayment
		if(typeof memberData != 'undefined'){
			updateUserPoint();
		}
		
		goPage('result');	
	}});	
}

/*!
 * 
 * PERCENTAGE - This is the function that runs to create result percentage
 * 
 */
function createPercentage(){
	gameData.percentageArray = [];
	
	var extraBall = bonusBall == true ? 1 : 0;
	var totalNum = score_arr.length+extraBall;
	var totalBall = 0;
	var percent = 0;
	var isBonusBall = false;
	
	for(var n=0; n<score_arr.length+extraBall;n++){
		isBonusBall = false;
		
		if(bonusBall){			
			if(n == 0){
				totalNum--;	
				totalBall = totalNum;
				percent = score_arr[totalNum-1].percent;
			}else if(n == 1){
				totalBall = totalNum;
				percent = bonusScore[0].percent;
				totalNum++;
				isBonusBall = true;
			}else{
				totalBall = totalNum;
				percent = score_arr[totalNum-1].percent;
			}
		}else{
			totalBall = totalNum;
			percent = score_arr[totalNum-1].percent;
		}
		
		totalNum--;
		if(!isNaN(percent)){
			if(percent > 0){
				for(var p=0; p<percent; p++){
					gameData.percentageArray.push({total:totalNum, bonus:isBonusBall});
				}
			}
		}
	}
	
	for(var n=gameData.percentageArray.length; n<100; n++){
		gameData.percentageArray.push({total:0, bonus:false});
	}
}

function getResultOnPercent(){	
	shuffle(gameData.percentageArray);
	
	var selectArray = [];
	var leftArray = [];
	
	for(var n=0; n<gameData.selectArray.length;n++){
		selectArray.push(gameData.selectArray[n]);
	}
	
	shuffle(selectArray);
	
	var extraBall = bonusBall == true ? 1 : 0;
	var numberIndex = 0;
	for(var b = 0; b < score_arr.length; b++){
		if(selectArray.indexOf(gameData.numberArray[numberIndex]) == -1){
			gameData.revealArray.push(gameData.numberArray[numberIndex]);	
		}else{
			b--;
		}
		numberIndex++;
	}
	
	var bonusNum = 0;
	if(gameData.percentageArray[0].total > 0){
		for(var n=0; n<gameData.percentageArray[0].total;n++){
			gameData.revealArray[n] = selectArray[n];
			
			if(gameData.percentageArray[0].bonus && n == gameData.percentageArray[0].total-1){
				bonusNum = selectArray[n+1];
			}
		}
		shuffle(gameData.revealArray);
	}
	
	if(extraBall){
		if(gameData.percentageArray[0].bonus){
			gameData.revealArray.push(bonusNum);
		}else{
			for(var b = 0; b < 1; b++){
				if(selectArray.indexOf(gameData.numberArray[numberIndex]) == -1){
					gameData.revealArray.push(gameData.numberArray[numberIndex]);	
				}else{
					b--;
				}
				numberIndex++;
			}
		}
	}
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}

/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = shareTitle;
	var text = shareMessage;
	
	title = shareTitle.replace("[SCORE]", addCommas(playerData.score));
	text = shareMessage.replace("[SCORE]", addCommas(playerData.score));
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}