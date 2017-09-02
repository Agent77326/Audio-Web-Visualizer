<?php
	function import($file, $print = true){
		if(file_exists($file)){
			switch(substr($file, -3)){
				case "css":
					if($print){
						echo "<style>" . file_get_contents($file) . "</style>";
					}
					else{
						
					}
					break;
				case ".js":
					if($print){
						echo "<script>" . file_get_contents($file) . "</script>";
					}
					else{
						echo "<script src='" . str_replace("/var/www/web-cloud", "", $file) . "'></script>";
					}
					break;
				case "htm":
					echo file_get_contents($file);
					break;
				default:
					die("Unknown file-type of file: " . $file);
			}
		}
		else{
			die("Misconfiguration, file not found: " . $file);
		}
	}
?>