<?php

    if( isset( $_SERVER['PHP_AUTH_USER'] ) ) {
        $user = strtolower( $_SERVER['PHP_AUTH_USER'] );
    }
    else {
        $user = 'guest';
    }

?>


<!doctype html>

<html lang="en">

<head>
    <title>DT Server COPNIX Shell</title>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/styles.php">

    <script>
        var username = '<?= $user ?>';
    </script>
    <script src="js/shell.js"></script>
</head>

<body onload="startShell();">

    <main>
        <div id="shell"
             contenteditable="true"
             spellcheck="false"
             onkeydown="checkKey( event, this );"
             onkeypress="processKey( event, this );"></div>
    </main>

</body>

</html>
