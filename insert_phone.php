<?php
require_once 'login.php';
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);

if ($connection->connect_error) die($connection->connect_error);

if (    isset($_POST['contact_id'])     &&
        isset($_POST['areaCode'])     &&
        isset($_POST['number'])     &&
        isset($_POST['type'])    
    )
    {
        $contact_id = $_POST['contact_id'];
        $areaCode = $_POST['areaCode'];
        $number = $_POST['number'];
        $type = $_POST['type'];
        $query  = "INSERT INTO Phone (Contact_id, Area_code, Number, Phone_type) VALUES ('$contact_id', '$areaCode', '$number', '$type')";

        $result = $connection->query($query);
        if (!$result) die ("Database access failed: " . $connection->error);
        echo $connection->insert_id;

    }





?>