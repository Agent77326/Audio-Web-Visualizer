function setStatus(msg){
	document.getElementById("status").innerHTML = msg;
}

//#29d hsl(202, 73%, 50%)
//rgb(152, 68, 183)
//97, 73%, 50%
var curColorTheme, rgbCol; //{0: 152, 1: 68, 2: 183};
var col; // = "hsl(" + curColorTheme[0] + ", " + curColorTheme[1] + "%, " + curColorTheme[2] + "%)";
function setColor(){
	console.log("Using color-theme: " + col);
	$(".color-theme").html(
		"body, .scroll-btn {" +
			"color: " + col + ";" +
		"}" +
		".swipe-down-menu-blur, .circle-fromMiddle, .scroll-btn i, .input-range::-webkit-slider-thumb {" +
			"border: 2px solid " + col + ";" +
		"}" +
		".swipe-down-menu-blur {" +
			"border-top: none;" +
		"}" +
		".pace .pace-progress, .input-range::-webkit-slider-thumb, .input-range::-webkit-slider-runnable-track, .settings>li:after, .circle-fromMiddle span, .circle-fromMiddle:before, .circle-fromMiddle:after, .scroll-btn i:before, .swipe-down-menu:hover>.scroll-btn i, .swipe-down-menu:hover>.swipe-down-menu-blur, .swipe-down-menu:active>.swipe-down-menu-blur {" +
			"background-color: " + col + ";" +
		"}" +
		".settings>li:after, .pace .pace-progress {" +
			"box-shadow: 0px 2px 2px " + col + ";" +
		"}" +
		"@-webkit-keyframes textColour {0% {color: #fff;}100% {color: " + col + ";}}@-moz-keyframes textColour {0% {color: #fff;}100% {color: " + col + ";}}@-o-keyframes textColour {0% {color: #fff;}100% {color: " + col + ";}}@keyframes textColour {0% {color: #fff;}100% {color: " + col + ";}}" +
		".swipe-down-menu:hover>.swipe-down-menu-blur, .swipe-down-menu:active>.swipe-down-menu-blur {" +
			"box-shadow: 0px 0px 5px " + col + ";" +
			"background-color: rgba(" + rgbCol.r + ", " + rgbCol.g + ", " + rgbCol.b + ", 0.1);" +
		"}" +
		".e-loadholder .m-loader .e-text {border: 5px solid " + col + ";}.e-loadholder .m-loader {border: 5px solid hsl(" + curColorTheme[0] + ", " + curColorTheme[1] + "%, " + (curColorTheme[2] + 10) + "%);}.e-loadholder {border: 5px solid hsl(" + curColorTheme[0] + ", " + curColorTheme[1] + "%, " + (curColorTheme[2] + 20) + "%);}" +
		".switch {" +
			"--uiSwitchButtonBgColor: " + col + ";" +
			"--uiSwitchBgColorActive: " + col + ";" +
		"}"
	);
}

function toggle(){
	console.log("Toggeling");
	if(audio.src){
		console.log("Is paused: " + audio.paused);
		if(audio.paused != true){
			setControlIcons('play');
			audio.pause();
		}
		else{
			setControlIcons('pause');
			audio.play();
		}
	}
	else{
		fetchStream();
	}
}

function setControlIcons(icon){
	switch(icon){
		case "play":
			setStatus('<span class="oi" data-glyph="media-play"></span>');
			break;
		case "pause":
			setStatus('<span class="oi" data-glyph="media-pause"></span>');
			break;
	}
}

function toggleFullscreen(){
	var elem = document.documentElement;
	if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
	    if (document.documentElement.requestFullScreen) {
	      document.documentElement.requestFullScreen();
	    } else if (document.documentElement.mozRequestFullScreen) {
	      document.documentElement.mozRequestFullScreen();
	    } else if (document.documentElement.webkitRequestFullScreen) {
	      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	    }
	    $(".toggle-fullscreen").attr("data-glyph", "fullscreen-exit");
	  } else {
	    if (document.cancelFullScreen) {
	      document.cancelFullScreen();
	    } else if (document.mozCancelFullScreen) {
	      document.mozCancelFullScreen();
	    } else if (document.webkitCancelFullScreen) {
	      document.webkitCancelFullScreen();
	    }
	    $(".toggle-fullscreen").attr("data-glyph", "fullscreen-enter");
	  }
}

var mouseTimer, isHidden = false;

function magicMouse() {
    if (mouseTimer) {
        clearTimeout(mouseTimer);
    }
    mouseTimer = setTimeout(function() {
        if (!isHidden) {
            document.querySelector("body").style.cursor = "none";
            isHidden = true;
            $(".swipe-down-menu").addClass("swipe-down-menu-hide");
        }
    }, 1200);
    if (isHidden) {
        document.querySelector("body").style.cursor = "auto";
        $(".swipe-down-menu").removeClass("swipe-down-menu-hide");
        isHidden = false;
    }
};
document.addEventListener("mousemove", magicMouse);
$(window).on("mouseout", function () {
    document.querySelector("body").style.cursor = "none";
    isHidden = true;
    $(".swipe-down-menu").addClass("swipe-down-menu-hide");
});

var prevent = false, clickTimer;
$("#status")
	.on("click", function() {
		clickTimer = setTimeout(function() {
			if (!prevent) {
				toggle();
			}
			prevent = false;
		}, 300);
	})
	.on("dblclick", function(){
		clearTimeout(clickTimer);
		prevent = true;
		console.log("dbclick on #status");
		setStatus('<span class="oi" data-glyph="media-skip-forward"></span>');
		fetchStream();
	});

function toggleMenu(){
	if($(".holder").hasClass("blured")){
		$(".holder").removeClass("blured");
		$(".menu").removeClass("active-menu");
	}
	else{
		$(".holder").addClass("blured");
		$(".menu").addClass("active-menu");
	}
}

// FF doesn't recognize mousewheel as of FF3.x => Firefox sucks
var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
$(".swipe-down-menu")
	.on("dblclick", toggleMenu);

$(".holder")
	.on("swipedown", toggleMenu)
	.bind(mousewheelevt, function(e){
	    var evt = window.event || e; // equalize event object
	    evt = evt.originalEvent ? evt.originalEvent : evt; // convert to originalEvent if possible
	    var delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta; // check for detail first, because it is used by Opera and FF

	    if(delta > 0) {
	        //scroll up
	    }
	    else {
	    	//scroll down
	    	toggleMenu();
	    }
	});

$(document).on("keyup", function(e) {
    if (e.keyCode == 27) {
    	//escape
			toggleMenu();
    }
    else if (e.keyCode == 32) {
    	//space
    	toggle();
    }
    else if (e.keyCode == 38) {
    	//up arrow
    	$(".volume-range").val(parseInt($(".volume-range").val()) + 10);
    	updateVolume();
    	console.log("Increase volume by 1%");
    }
    else if (e.keyCode == 40) {
    	//down arrow
		$(".volume-range").val(parseInt($(".volume-range").val()) - 10);
    	updateVolume();
    	console.log("Decrease volume by 1%");
    }
});

$(".circle-fromMiddle").on("click", toggleMenu);
