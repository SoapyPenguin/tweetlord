<?php
function console_log( $data ) {

    $output = $data;
    if ( is_array( $output ) )
        $output = implode( ',', $output);

    echo "<script> console.log( 'Debug Objects: " . $output . "' ); </script>";
}

function dbconnect_tlbot() {

	$connection = new mysqli("localhost", "tlbot", "qIU3oeRqQR7Nw450tXid", "tweetlord");

	if ($connection->connect_error) {
		die("Error: " . $connection->connect_error);
	}

	return $connection;
}

function test_input($data) {

		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
}

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function generateGC() {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < 6; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
?>
