function inputRangeVisualize(range) {
	var a = ($(range).val() - $(range).attr('min')) * 100 / ($(range).attr('max') - $(range).attr('min'));
	$(range + "-style").html(range + "::-webkit-slider-runnable-track {" +
			"background:linear-gradient(to right, " + col + " 0%, " + col + " " + a + "%, #515151 " + a + "%)" +
			"}");
}

function updateVolume() {
	if(keepVolume){
		localStorage.setItem("volume", $('.volume-range').val());
	}
	inputRangeVisualize('.volume-range');
	audio.volume = $('.volume-range').val() / 1000;
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
	inputRangeVisualize(".color-range");
	inputRangeVisualize(".saturation-range");
	inputRangeVisualize(".lightness-range");
	setColor();
	updateVolume();
	updateVisualizer();
	runThemeColorParticle();
}

function updateVisualizer() {
	inputRangeVisualize(".visualize-factor-range")
	inputRangeVisualize(".visualize-pow-range");
	inputRangeVisualize(".visualize-hz-per-bar-range");
	inputRangeVisualize(".visualize-bar-width-range");
	inputRangeVisualize(".visualize-bar-dist-range");
	if(keepVisualizer){
		localStorage.setItem("visualize-factor", $(".visualize-factor-range").val());
		localStorage.setItem("visualize-pow", $(".visualize-pow-range").val());
		localStorage.setItem("visualize-hz-per-bar", $(".visualize-hz-per-bar-range").val());
		localStorage.setItem("visualize-bar-width", $(".visualize-bar-width-range").val());
		localStorage.setItem("visualize-bar-dist", $(".visualize-bar-dist-range").val());
	}
	visualize_factor = $(".visualize-factor-range").val() / 1000;
	console.log("Updated visualize_factor to: " + visualize_factor);
	visualize_pow = $(".visualize-pow-range").val() / 333;
	console.log("Updated visualize_pow to: " + visualize_pow);
	hz_per_bar = parseInt($(".visualize-hz-per-bar-range").val());
	console.log("Updated hz_per_bar to: " + hz_per_bar);
	bar_width = parseInt($(".visualize-bar-width-range").val());
	console.log("Updated bar_width to: " + bar_width);
	bar_dist = parseInt($(".visualize-bar-dist-range").val());
	console.log("Updated bar_dist to: " + bar_width);
}

function updatePlaylistList(){
	var out = "";
	for (var i = 0, f; f = playlist[i]; i++){
		out += '<tr><td class="playlist-list-nr">' + (i + 1) + '</td><td class="playlist-list-song">' + f.title + '</td></tr>';
	}
	$(".playlist-list-body").html(out);
}

var keepColor = false, keepVolume = true, keepVisualizer = false;

function checkIfKeep() {
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

		if(localStorage.getItem("keepVisualizer")) {
			console.log("Loading visualizer settings");
			keepVisualizer = true;
			$("#switch-keep-visualizer").prop("checked", true);
			$(".visualize-factor-range").val(localStorage.getItem("visualize-factor"));
			$(".visualize-pow-range").val(localStorage.getItem("visualize-pow"));
		}
	}
	else{
		notSupported();
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
				localStorage.removeItem("keepColor");
				localStorage.removeItem("color-h");
				localStorage.removeItem("color-s");
				localStorage.removeItem("color-l");
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
				localStorage.removeItem("keepVolume");
				localStorage.removeItem("volume");
			}
		}, 200);
	}
}

var notDBClickKeepVisualizer = true;
function toggleKeepVisualizer() {
	if(notDBClickKeepVisualizer){
		notDBClickKeepVisualizer = false;
		setTimeout(function () {
			notDBClickKeepVisualizer = true;
			if($("#switch-keep-visualizer").is(':checked')){
				console.log("Enabled keep-visualizer");
				keepVisualizer = true;
				localStorage.setItem("keepVisualizer", true);
				localStorage.setItem("visualize-factor", $(".visualize-factor-range").val());
				localStorage.setItem("visualize-pow", $(".visualize-pow-range").val());
			}
			else{
				console.log("Disabled keep-visualizer");
				keepVisualizer = false;
				localStorage.removeItem("keepVisualizer");
				localStorage.removeItem("visualize-factor");
				localStorage.removeItem("visualize-pow");
			}
		}, 200);
	}
}
