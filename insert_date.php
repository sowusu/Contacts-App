<?php
require_once 'login.php';
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);

if ($connection->connect_error) die($connection->connect_error);

if (    isset($_POST['contact_id'])     &&
        isset($_POST['date'])     &&
        isset($_POST['type'])    
    )
    {
        $contact_id = $_POST['contact_id'];
        $date = $_POST['date'];
        $type = $_POST['type'];
        $query  = "INSERT INTO Date (Contact_id, Date, Date_type) VALUES ('$contact_id', '$date', '$type')";

        $result = $connection->query($query);
        if (!$result) die ("Database access failed: " . $connection->error);
        echo $connection->insert_id;

    }





?>