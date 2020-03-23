<?php
require_once 'login.php';
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);

if ($connection->connect_error) die($connection->connect_error);

if (    isset($_POST['contact_id'])     &&
        isset($_POST['elt_id'])     &&
        isset($_POST['areaCode'])     &&
        isset($_POST['number'])     &&
        isset($_POST['type'])      
    )
    {
        $contact_id = $_POST['contact_id'];
        $elt_id = $_POST['elt_id'];
        $areaCode = $_POST['areaCode'];
        $number = $_POST['number'];
        $type = $_POST['type'];
        $query  = "UPDATE Phone SET Area_code='$areaCode', Number='$number', Phone_type='$type' WHERE Phone_id=$elt_id";

        $result = $connection->query($query);
        if (!$result) die ("Database access failed: " . $connection->error);
        echo $connection->insert_id;

    }





?>