<?php
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
