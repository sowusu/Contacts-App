<?php
require_once 'login.php';
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);

if ($connection->connect_error) die($connection->connect_error);

if (    isset($_POST['contact_id'])     &&
        isset($_POST['first_name'])     &&
        isset($_POST['middle_name'])    &&
        isset($_POST['last_name'])      &&
        isset($_POST['update']) 
    )
    {
        $contact_id = $_POST['contact_id'];
        $fname = $_POST['first_name'];
        $mname = $_POST['middle_name'];
        $lname = $_POST['last_name'];
        $query  = "INSERT INTO Contact (Fname, Mname, Lname) VALUES ('$fname', '$mname', '$lname')";
        if($_POST['update'] == "true"){
            $query = "UPDATE Contact SET Fname='$fname', Mname='$mname', Lname='$lname' WHERE Contact_id=$contact_id";
        }
        $result = $connection->query($query);
        if (!$result) die ("Database access failed: " . $connection->error);


    }





?>