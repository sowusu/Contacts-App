<?php

    require_once 'login.php';
    $connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);

    if ($connection->connect_error) die($connection->connect_error);

    $query  = "SELECT Contact.Contact_id, Fname, Mname, Lname, Address_id, Address_type, Address, City, State, ZIP, Phone_id, Phone_type, Area_code, Number, Date_id, Date_type, Date FROM Contact 
                LEFT JOIN Address ON Contact.Contact_id = Address.Contact_id 
                LEFT JOIN Phone ON Contact.Contact_id = Phone.Contact_id 
                LEFT JOIN Date ON Contact.Contact_id=Date.Contact_id
                ORDER BY Fname ASC";
    $result = $connection->query($query);
    
    if (!$result) die ("Database access failed: " . $connection->error);
    
    $rows = $result->num_rows;
    $items = array();
    while ($row = $result->fetch_assoc()){
        $items[] = $row;
    }
    echo json_encode($items);




?>