<?php
require_once 'login.php';
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

insertContact($_POST['firstName'], $_POST['middleName'], $_POST['lastName'], $connection);
$contact_id = $connection->insert_id;

//insert addresses
$addresses = $_POST['addresses'];
for ($i = 0; $i < count($_POST['addresses']); $i++){
    insertAddress($connection, $contact_id, $addresses[$i]['add_type'], $addresses[$i]['address'], $addresses[$i]['city'], $addresses[$i]['state'], $addresses[$i]['zip']);
}

//insert phones
$phones = $_POST['phones'];
for ($i = 0; $i < count($_POST['phones']); $i++){
    insertPhone($connection, $contact_id, $phones[$i]['phone_type'], $phones[$i]['area_code'], $phones[$i]['number']);
}

//insert dates
$dates = $_POST['dates'];
for ($i = 0; $i < count($_POST['dates']); $i++){
    insertDate($connection, $contact_id, $dates[$i]['date_type'], $dates[$i]['date']);
}

function insertContact($fname, $mname, $lname, $connection){
    /* insert in Contact table*/
    if ($stmt = $connection->prepare("INSERT INTO Contact (Fname, Mname, Lname) VALUES ( ?, ?, ?)")){
        
        $stmt->bind_param("sss", $fname, $mname,$lname);

        if ($stmt->execute()) {
            echo "Contact insert succeeded! - contact-id" . $connection->insert_id;
        }
        else {
             echo "Contact insert failed!";
             exit();
        }
        $stmt->close();
    }
}


function insertDate($connection, $contact_id, $type, $date){
    if ($stmt = $connection->prepare("INSERT INTO Date (Contact_id, Date_type, Date) VALUES (?, ?, ?)")){
        $stmt->bind_param("iss",  $contact_id, $type, $date);

        if ($stmt->execute()) {
            echo "Date insert succeeded - date-id" . $connection->insert_id;
        }
        else {
             echo "Date insert failed!";
        }
        $stmt->close();
    }
}

function insertAddress($connection, $contact_id, $type, $address, $city, $state, $zip){
    if ($stmt = $connection->prepare("INSERT INTO Address (Contact_id, Address_type, Address, City, State, ZIP) VALUES (?, ?, ?, ?, ?, ?)")){
        $stmt->bind_param("isssss", $contact_id, $type, $address, $city, $state, $zip);

        if ($stmt->execute()) {
            echo "Address insert succeeded- address-id" . $connection->insert_id;
        }
        else {
             echo "Address insert failed!";
        }
        $stmt->close();
    }
}

function insertPhone($connection, $contact_id, $type, $area_code, $number){
    if ($stmt = $connection->prepare("INSERT INTO Phone (Contact_id, Phone_type, Area_code, Number) VALUES (?, ?, ?, ?)")){
        $stmt->bind_param("isss", $contact_id, $type, $area_code, $number);

        if ($stmt->execute()) {
            echo "Phone insert succeeded - phone-id" . $connection->insert_id;
        }
        else {
             echo "Phone insert failed!";
        }
        $stmt->close();
    }
}

?>
