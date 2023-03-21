// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];
        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
function checkContentHeight(target){
	var stageHeight=$( window ).height();
	var newHeight = (stageHeight/2)-(target.height()/2);
	return newHeight;
}

function checkContentWidth(target){
	var stageWidth=$( window ).width();
	var newWidth = (stageWidth/2)-(target.width()/2);
	return newWidth;
}

function getDeviceVer() {
	var ua = navigator.userAgent;
	var uaindex;
	
	// determine OS
	if ( ua.match(/(iPad|iPhone|iPod touch)/) ){
		userOS = 'iOS';
		uaindex = ua.indexOf( 'OS ' );
	}else if ( ua.match(/Android/) ){
		userOS = 'Android';
		uaindex = ua.indexOf( 'Android ' );
	}else{
		userOS = 'unknown';
	}
	
	// determine version
	if ( userOS === 'iOS' && uaindex > -1 ){
		userOSver = ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
	}else if ( userOS === 'Android'  &&  uaindex > -1 ){
		userOSver = ua.substr( uaindex + 8, 3 );
	}else{
		userOSver = 'unknown';
	}
	return Number(userOSver)
}

function shuffle(array) {
	var currentIndex = array.length
	, temporaryValue
	, randomIndex
	;
	
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	
	return array;
}

function randomBoolean(){
    return Math.random() < 0.5;
}

function sortOnObject(array, object, rev) {
	if(rev){
		array.sort(function(a, b){
			var a1= a[object], b1= b[object];
			if(a1== b1) return 0;
			return a1< b1? 1: -1;
		});
	}else{
		array.sort(function(a, b){
			var a1= a[object], b1= b[object];
			if(a1== b1) return 0;
			return a1> b1? 1: -1;
		});
	}
	return array;
}

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function isEven(num){
    // if(num % 2 == 0){return true;}else{return false;} //<–old
    return !(num%2);//shorter
    // return !(num & 1);//seems the fastest one
}

function getDistance(objA, objB) {
    var deltaX = objA.x-objB.x;
    var deltaY = objA.y-objB.y;
    var dist2 = Math.floor(Math.sqrt((deltaX*deltaX)+(deltaY*deltaY)));
    return dist2;
}

function getDistanceByValue(x1, y1, x2, y2) {
    var deltaX = x1-x2;
    var deltaY = y1-y2;
    var dist2 = Math.floor(Math.sqrt((deltaX*deltaX)+(deltaY*deltaY)));
    return dist2;
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

function getCenterPosition(startX, startY, endX, endY) {
	var position = {x:0, y:0};
    position.x=(startX+endX)/2;
    position.y=(startY+endY)/2;
	
	return position;
}

function getAnglePosition(obj, radius, angle){
	var position = {x:0, y:0};
    position.x = obj.x + radius * Math.cos(angle * Math.PI/180);
    position.y = obj.y + radius * Math.sin(angle * Math.PI/180);
	return position;
}

function getAnglePositionByValue(x, y, radius, angle){
	var position = {x:0, y:0};
    position.x = x + radius * Math.cos(angle * Math.PI/180);
    position.y = y + radius * Math.sin(angle * Math.PI/180);
	return position;
}

function getDirection(x1,y1,x2,y2) {
    var radiance = 180/Math.PI;
    var walkdirection = -(Math.atan2(x2-x1, y2-y1))*radiance;
    return walkdirection+180;
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}