<?php
	/*
	require '/var/www/html/php/sinusbot.class.php';
	$sinusbot = new SinusBot("http://agent77326.tk:8087");
	$sinusbot->login("admin", "5207aq00rPvh");
	echo $sinusbot->getWebStream($sinusbot->getInstances()[0]['uuid']);
	*/
	function scanDire($ordner){
		$dir = array_diff(scandir($ordner), array('..', '.', 'index.php'));
		sort($dir);
		return $dir;
	}
	
	switch($_GET['playlist']){
		case "nc":
			$scan = scanDire("/media/drive_2/www/media/audio/NC/");
			$output = "/media/audio/NC/" . $scan[mt_rand(0, count($scan))];
			break;
		case "ncs":
			$scan = scanDire("/media/drive_2/www/media/audio/NCS/");
			$output = "/media/audio/NCS/" . $scan[mt_rand(0, count($scan))];
			break;
		default:
			$scan = scanDire("/var/www/web-cloud/cdn/radio_test/");
			$output = "./cdn/radio_test/" . $scan[mt_rand(0, count($scan))];
			break;
	}
	echo $output;
?>