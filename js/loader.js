////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[
			{src:'assets/background.png', id:'background'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/button_start.png', id:'buttonStart'},
			
			{src:'assets/item_ball.png', id:'itemBall'},
			{src:'assets/item_ball_dim.png', id:'itemBallDim'},
			{src:'assets/item_ball_guess.png', id:'itemBallGuess'},
			{src:'assets/item_ball_bonus.png', id:'itemBallBonus'},
			{src:'assets/item_ball_hit.png', id:'itemBallHit'},
			
			{src:'assets/item_ball_bg.png', id:'itemBallBg'},
			{src:'assets/item_ball_shadow.png', id:'itemBallShadow'},
			
			{src:'assets/item_sphere.png', id:'itemSphere'},
			{src:'assets/item_stick.png', id:'itemStick'},
			{src:'assets/item_shine.png', id:'itemShine'},
			{src:'assets/item_bar.png', id:'itemBar'},
			{src:'assets/item_bar_bonus.png', id:'itemBarBonus'},
			
			{src:'assets/item_card.png', id:'itemCard'},
			{src:'assets/item_number_bg.png', id:'itemNumberBg'},
			{src:'assets/item_number_select_bg.png', id:'itemNumberSelectBg'},
			{src:'assets/button_lucky.png', id:'buttonLucky'},
			{src:'assets/button_sphere.png', id:'buttonSphereStart'},
			{src:'assets/item_table.png', id:'itemTable'},
			
			{src:'assets/item_prize_bg.png', id:'itemPrizeBg'},
			{src:'assets/item_prize_select_bg.png', id:'itemPrizeSelectBg'},
			
			{src:'assets/button_confirm.png', id:'buttonConfirm'},
			{src:'assets/button_cancel.png', id:'buttonCancel'},
			{src:'assets/item_exit.png', id:'itemExit'},
			
			{src:'assets/item_result.png', id:'itemResult'},
			{src:'assets/button_continue.png', id:'buttonContinue'},
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'},
			{src:'assets/button_exit.png', id:'buttonExit'},
			{src:'assets/button_settings.png', id:'buttonSettings'},
			
			{src:'assets/button_left.png', id:'buttonLeft'},
			{src:'assets/button_right.png', id:'buttonRight'}];
	
	soundOn = true;
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/click.ogg', id:'soundClick'});
		manifest.push({src:'assets/sounds/balls.ogg', id:'soundBalls'});
		manifest.push({src:'assets/sounds/reveal.ogg', id:'soundReveal'});
		manifest.push({src:'assets/sounds/startspin.ogg', id:'soundStartSpin'});
		manifest.push({src:'assets/sounds/win.ogg', id:'soundWin'});
		manifest.push({src:'assets/sounds/suck.ogg', id:'soundSuck'});
		manifest.push({src:'assets/sounds/complete.ogg', id:'soundComplete'});
		manifest.push({src:'assets/sounds/number.ogg', id:'soundNumber'});
		manifest.push({src:'assets/sounds/random.ogg', id:'soundRandom'});
		manifest.push({src:'assets/sounds/cage.ogg', id:'soundCage'});
		manifest.push({src:'assets/sounds/fail.ogg', id:'soundFail'});
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	//console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error ", evt);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}