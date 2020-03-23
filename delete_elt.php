<?php
require_once 'login.php';
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);

if ($connection->connect_error) die($connection->connect_error);

if (    isset($_POST['elt_id'])     &&
        isset($_POST['table'])
    )
    {
        $table = $_POST['table'];
        $elt_id = $_POST['elt_id'];

        $query  = "DELETE FROM $table  WHERE " . $table . "_id=$elt_id";

        $result = $connection->query($query);
        if (!$result) die ("Database access failed: " . $connection->error);
        echo $result;
    }





?>