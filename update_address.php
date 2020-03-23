<?php
require_once 'login.php';
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);

if ($connection->connect_error) die($connection->connect_error);

if (    isset($_POST['contact_id'])     &&
        isset($_POST['elt_id'])     &&
        isset($_POST['address'])     &&
        isset($_POST['city'])     &&
        isset($_POST['state'])     &&
        isset($_POST['zip'])     &&
        isset($_POST['type'])    
    )
    {
        $contact_id = $_POST['contact_id'];
        $elt_id = $_POST['elt_id'];
        $address = $_POST['address'];
        $city = $_POST['city'];
        $state = $_POST['state'];
        $zip = $_POST['zip'];
        $type = $_POST['type'];
        $query  = "UPDATE Address SET Address='$address', City='$city', State='$state', ZIP='$zip', Address_type='$type' WHERE Address_id=$elt_id";

        $result = $connection->query($query);
        if (!$result) die ("Database access failed: " . $connection->error);
        echo $connection->insert_id;

    }





?>