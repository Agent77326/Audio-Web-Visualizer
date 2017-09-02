function updateVolume() {
	if(keepVolume){
		localStorage.setItem("volume", $('.volume-range').val());
	}
	var a = $('.volume-range').val() / 10;
	$('.volume-range-style').html(".volume-range::-webkit-slider-runnable-track {" +
			"background:linear-gradient(to right, " + col + " 0%, " + col + " " + a + "%, #515151 " + a + "%)" +
	  	"}");
	audio.volume = a / 100;
	console.log("Updated Audio-volume");
}

$('.volume-range').on("input change", updateVolume);

function updateColor() {
	curColorTheme = {0: parseInt($(".color-range").val()), 1: parseInt($('.saturation-range').val()), 2: parseInt($('.lightness-range').val()) + 20};
	if(keepColor){
		localStorage.setItem("color-h", $(".color-range").val());
		localStorage.setItem("color-s", $('.saturation-range').val());
		localStorage.setItem("color-l", $('.lightness-range').val());
	}
	col = "hsl(" + curColorTheme[0] + ", " + curColorTheme[1] + "%, " + curColorTheme[2] + "%)";
	rgbCol = hslToRgb(curColorTheme[0], curColorTheme[1], curColorTheme[2]);
	var a = ($(".color-range").val() * 100 / 360);
	$('.color-range-style').html(".color-range::-webkit-slider-runnable-track {" +
			"background:linear-gradient(to right, " + col + " 0%, " + col + " " + a + "%, #515151 " + a + "%)" +
	  	"}");
	a = $(".saturation-range").val();
	$('.saturation-range-style').html(".saturation-range::-webkit-slider-runnable-track {" +
			"background:linear-gradient(to right, " + col + " 0%, " + col + " " + a + "%, #515151 " + a + "%)" +
	  	"}");
	a = ($(".lightness-range").val() * 100 / 80);
	$('.lightness-range-style').html(".lightness-range::-webkit-slider-runnable-track {" +
			"background:linear-gradient(to right, " + col + " 0%, " + col + " " + a + "%, #515151 " + a + "%)" +
	  	"}");
	setColor();
	updateVolume();
	runThemeColorParticle();
}

function notSupported() {
	alert("Browser/Device not supported!!!\nThere may be a lot of major bugs and misfunctions in other browsers then Google Chrome Desktop.\nTo get the best experience use the newest stable desktop version of Google Chrome.\nYou can get it here: https://www.google.de/chrome/browser/desktop/");
}

var keepColor = false, keepVolume = true;

function checkIfKeep() {
	// test browser usability
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent)) {
		notSupported();
	}
	else if (!/Chrome/.test(navigator.userAgent) || !/Google Inc/.test(navigator.vendor)) {
		notSupported();
	}
	if (typeof(Storage) !== "undefined") {
		if(localStorage.getItem("keepColor")){
			keepColor = true;
			$("#switch-keep-color").prop('checked', true);
			$(".color-range").val(localStorage.getItem("color-h"));
			$(".saturation-range").val(localStorage.getItem("color-s"));
			$(".lightness-range").val(localStorage.getItem("color-l"));
		}
		else{
			$(".color-range").val(rand(0, 360));
		}
		if(localStorage.getItem("keepVolume")){
			$(".volume-range").val(localStorage.getItem("volume"));
			$("#switch-keep-volume").prop('checked', true);
		}
		else if(localStorage.getItem("keepVolume") === null){
			// save volume by default
			console.log("Enabled keep-volume (default)");
			localStorage.setItem("keepVolume", true);
			$("#switch-keep-volume").prop('checked', true);
		}
		else{
			keepVolume = false;
		}
	}
}

var notDBClickKeepColor = true;
function toggleKeepColor() {
	if(notDBClickKeepColor){
		notDBClickKeepColor = false;
		setTimeout(function () {
			notDBClickKeepColor = true;
			if($("#switch-keep-color").is(':checked')){
				console.log("Enabled keep-color");
				keepColor = true;
				localStorage.setItem("keepColor", true);
				updateColor();
			}
			else{
				console.log("Disabled keep-color");
				keepColor = false;
				localStorage.setItem("keepColor", false);
			}
		}, 200);
	}
}

var notDBClickKeepVolume = true;
function toggleKeepVolume() {
	if(notDBClickKeepVolume){
		notDBClickKeepVolume = false;
		setTimeout(function () {
			notDBClickKeepVolume = true;
			if($("#switch-keep-volume").is(':checked')){
				console.log("Enabled keep-volume");
				keepVolume = true;
				localStorage.setItem("keepVolume", true);
			}
			else{
				console.log("Disabled keep-volume");
				keepVolume = false;
				localStorage.setItem("keepVolume", false);
				localStorage.removeItem("volume");
			}
		}, 200);
	}
}