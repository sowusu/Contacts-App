<?php
require_once 'login.php';
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);

if ($connection->connect_error) die($connection->connect_error);

if (    isset($_POST['contact_id'])     &&
        isset($_POST['address'])     &&
        isset($_POST['city'])     &&
        isset($_POST['state'])     &&
        isset($_POST['zip'])     &&
        isset($_POST['type'])    
    )
    {
        $contact_id = $_POST['contact_id'];
        $address = $_POST['address'];
        $city = $_POST['city'];
        $state = $_POST['state'];
        $zip = $_POST['zip'];
        $type = $_POST['type'];
        $query  = "INSERT INTO Address (Contact_id, Address, City, State, ZIP, Address_type) VALUES ('$contact_id', '$address', '$city', '$state', '$zip', '$type')";

        $result = $connection->query($query);
        if (!$result) die ("Database access failed: " . $connection->error);
        echo $connection->insert_id;

    }





?>