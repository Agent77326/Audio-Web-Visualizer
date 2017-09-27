var init = true, curPlaylist = "";
var audio, audio_visualizer_top, audio_visualizer_bottom, audio_visualizer_left, audio_visualizer_right, ctx_top, ctx_bottom, ctx_left, ctx_right;
var context, analyser, fbc_array, bar_x, bar_width, bar_heigth;

var enableTop, enableBottom, enableLeft, enableRight;
var visualize_factor = 0.1, visualize_pow = 1.9;

var progresSong = setInterval(function () {
	if(audio && !audio.paused){
		if($("body").hasClass("pace-done")){
			$("body").removeClass("pace-done");
		}
		if($(".pace-progress").parent().hasClass("pace-inactive")){
			$(".pace-progress").parent().removeClass("pace-inactive");
		}
		var curr = parseInt((audio.currentTime / audio.duration) * 10000) / 100;
		$(".pace-progress").attr("data-progress", curr).css("transform", "translate3d(" + curr + "%, 0px, 0px)");
	}
}, 30);

function fetchStream(){
	var request = new XMLHttpRequest();
	var url = "./php/radio.php?playlist=" + curPlaylist;
	request.open("GET", url, true);
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log("Stream-URL: " + this.responseText);
			audio.src = this.responseText;
			whichVisualizerPosition();
			audio.play();
		}
	}
	request.send();
}

function runAudioVisualizer(){
	if(ctx_top || ctx_bottom || ctx_left || ctx_right){
		fbc_array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(fbc_array);
		var col = "hsl(" + curColorTheme[0] + ", " + curColorTheme[1] + "%, " + curColorTheme[2] + "%)";
		if(enableTop){
			ctx_top.clearRect(0, 0, audio_visualizer_top.width, audio_visualizer_top.height);
			ctx_top.fillStyle = col;
			ctx_top.fRect = function(x, y, w, h){
				ctx_top.fillRect(parseInt(x), parseInt(y), parseInt(w), parseInt(h));
			}
		}
		if(enableBottom){
			ctx_bottom.clearRect(0, 0, audio_visualizer_bottom.width, audio_visualizer_bottom.height);
			ctx_bottom.fillStyle = col;
			ctx_bottom.fRect = function(x, y, w, h){
				ctx_bottom.fillRect(parseInt(x), parseInt(y), parseInt(w), parseInt(h));
			}
		}
		if(enableLeft){
			ctx_left.clearRect(0, 0, audio_visualizer_left.width, audio_visualizer_left.height);
			ctx_left.fillStyle = col;
			ctx_left.fRect = function(x, y, w, h){
				ctx_left.fillRect(parseInt(x), parseInt(y), parseInt(w), parseInt(h));
			}
		}
		if(enableRight){
			ctx_right.clearRect(0, 0, audio_visualizer_right.width, audio_visualizer_right.height);
			ctx_right.fillStyle = col;
			ctx_right.fRect = function(x, y, w, h){
				ctx_right.fillRect(parseInt(x), parseInt(y), parseInt(w), parseInt(h));
			}
		}

		for(var i = 0; i < fbc_array.length; i++){
			bar_x = i * 3;
			bar_width = 1;
			bar_heigth = parseInt(Math.pow(fbc_array[i] * visualize_factor, visualize_pow));
			if(enableTop){
				ctx_top.fRect(bar_x, 0, bar_width, bar_heigth);
			}
			if(enableBottom){
				ctx_bottom.fRect(bar_x, audio_visualizer_bottom.height, bar_width, -bar_heigth);
			}
			if(enableLeft){
				ctx_left.fRect(0, bar_x, bar_heigth, bar_width);
			}
			if(enableRight){
				ctx_right.fRect(audio_visualizer_right.width, bar_x, -bar_heigth, bar_width);
			}
		}

		if(fbc_array[2] >= 70){
			var val = fbc_array[2] - 70;
			var size = 240 + Math.floor(val) * 0.003 * 240;
			document.getElementsByClassName("e-loadholder")[0].setAttribute("style", "width:" + size + "px; height:" + size + "px; border-radius:" + size / 2 + "px");
			size = 200 + Math.floor(val) * 0.002 * 200;
			document.getElementsByClassName("m-loader")[0].setAttribute("style", "width:" + size + "px; height:" + size + "px; border-radius:" + size / 2 + "px");
			size = 140 + Math.floor(val) * 0.001 * 140;
			var fSize = 50 + Math.floor(val) * 0.001 * 50;
			var lSize = size - 5;
			document.getElementsByClassName("e-text")[0].setAttribute("style", "width:" + size + "px; height:" + size + "px; border-radius:" + size / 2 + "px; font-size:" + fSize + "px; line-height:" + lSize + "px");
		}
		else{
			document.getElementsByClassName("e-loadholder")[0].setAttribute("style", "width:240px; height:240px; border-radius:170px");
			document.getElementsByClassName("m-loader")[0].setAttribute("style", "width:200px; height:200px; border-radius:100px");
			document.getElementsByClassName("e-text")[0].setAttribute("style", "width:140px; height:140px; border-radius:70px; font-size:50px; line-height:135px");
		}
	}
	window.requestAnimationFrame(runAudioVisualizer);
}

function resize(){
	if(ctx_top || ctx_bottom || ctx_left || ctx_right){
		var height_limit = 1
		console.log("Resize to: height " + window.innerHeight + " width " + window.innerWidth);
		if(enableTop){
			ctx_top.canvas.width = window.innerWidth;
			ctx_top.canvas.height = parseInt(window.innerHeight * height_limit);
		}
		if(enableBottom){
			ctx_bottom.canvas.width = window.innerWidth;
			ctx_bottom.canvas.height = parseInt(window.innerHeight * height_limit);
		}
		if(enableLeft){
			ctx_left.canvas.width = parseInt(window.innerWidth * height_limit);
			ctx_left.canvas.height = window.innerHeight;
		}
		if(enableRight){
			ctx_right.canvas.width = parseInt(window.innerWidth * height_limit);
			ctx_right.canvas.height = window.innerHeight;
		}
	}
}

function whichVisualizerPosition(){
	enableTop = $("#switch-top").is(':checked'), enableBottom = $("#switch-bottom").is(':checked'), enableLeft = $("#switch-left").is(':checked'), enableRight = $("#switch-right").is(':checked');
	if(enableTop){
		audio_visualizer_top = document.getElementById("audio-visualizer-top");
		ctx_top = audio_visualizer_top.getContext("2d");
	}
	if(enableBottom){
		audio_visualizer_bottom = document.getElementById("audio-visualizer-bottom");
		ctx_bottom = audio_visualizer_bottom.getContext("2d");
	}
	if(enableLeft){
		audio_visualizer_left = document.getElementById("audio-visualizer-left");
		ctx_left = audio_visualizer_left.getContext("2d");
	}
	if(enableRight){
		audio_visualizer_right = document.getElementById("audio-visualizer-right");
		ctx_right = audio_visualizer_right.getContext("2d");
	}
	resize();
}

runAudioVisualizer();
window.onresize = resize;
