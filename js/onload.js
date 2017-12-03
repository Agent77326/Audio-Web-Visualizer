function addFiles(files, index){
	if (files[index].type.match(/audio.*/)){
		console.log("Added File: ");
		console.log(files[index]);
		var fr = new FileReader();
		fr.onloadend = (function(files, index) {
			return function(e) {
				console.log(files);
				playlist.push({
					title: files[index].name,
					url: fr.result
				});
				updatePlaylistList();
				if(files[++index]){
					addFiles(files, index);
				}
			};
		})(files, index);
		fr.readAsDataURL(files[index]);
	}
	else{
		console.log("Invalid Filetype: ");
		console.log(files[index]);
		if(files[++index]){
			addFiles(files, index);
		}
	}

}

window.onload = function(){
	checkIfKeep();
	var b = document.getElementsByTagName("body")[0];
	b.addEventListener("dragover", function(e){
		e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
	});
	b.addEventListener("drop", function(e){
    e.stopPropagation();
    e.preventDefault();
		addFiles(e.dataTransfer.files, 0);
	});
	document.getElementsByClassName('file-input')[0].addEventListener("change", function(e){
		addFiles(e.target.files, 0);
	});

	audio = document.getElementsByTagName('audio')[0];
	updateVolume();
	audio.crossOrigin = "anonymous";
	audio.addEventListener("error", fetchStream);
	audio.addEventListener("ended", fetchStream);
	context = new AudioContext();
	analyser = context.createAnalyser();
	catchPlayer();
	updateColor();
	updateVisualizer();
	runThemeColorParticle();
	whichVisualizerPosition();
	setStatus('<span class="oi" data-glyph="power-standby"></span>');
};
