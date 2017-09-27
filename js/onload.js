window.onload = function(){
	checkIfKeep();
	audio = document.getElementById("audio");
	updateVolume();
	audio.crossOrigin = "anonymous";
	audio.addEventListener("error", fetchStream);
	audio.addEventListener("ended", fetchStream);
	context = new AudioContext();
	analyser = context.createAnalyser();
	var src = context.createMediaElementSource(audio);
	src.connect(analyser);
	analyser.connect(context.destination);
	updateColor();
	updateVisualizer();
	runThemeColorParticle();
	whichVisualizerPosition();
	setStatus('<span class="oi" data-glyph="power-standby"></span>');
};
