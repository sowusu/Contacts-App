<?php
require_once 'login.php';
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

//open file and read
$row = 1;
if (($handle = fopen("Contacts.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $num = count($data);
        echo "<p> $num fields in line $row: <br /></p>\n";
        
        for ($c=0; $c < $num; $c++) {
            echo $data[$c] . "<br />\n";
        }
        if ($row > 1) insertContact($data, $connection);
        $row++;
    }
    $connection->close();
    fclose($handle);
}
else{
    echo "File I/O Error";
}


//$record = array(1, "James", "Pucker", "McGinnis", "732-392-7165", "441-443-4332", "", "", "", "", "435-122-4321", "90103 Glacier Hill Terrace", "Plano", "Texas", "75003", "1986-06-07");
//insertContact($record, $connection);

function insertContact($record, $connection){
    /* insert in Contact table*/
    if ($stmt = $connection->prepare("INSERT INTO Contact VALUES (?, ?, ?, ?)")){
        
        $stmt->bind_param("isss", $record[0], $record[1], $record[2],$record[3]);

        if ($stmt->execute()) {
            echo "Contact insert succeeded!";
        }
        else {
             echo "Contact insert failed!";
             exit();
        }
        $stmt->close();
    }

    /*insert in Phone table*/
    if (strlen($record[4]) > 0){
        insertPhone($record, $connection, "HOME", $record[4]);
    }
    if (strlen($record[5]) > 0){
        insertPhone($record, $connection, "CELL", $record[5]);
    }
    if (strlen($record[10]) > 0){
        insertPhone($record, $connection, "WORK", $record[10]);
    }
    /*insert home address if any part of address exists*/
    if ($record[6] != "" || $record[7] != "" || $record[8] != "" || $record[9] != ""){
        insertAddress($record, $connection, "HOME", 6);
    }
    /*insert work address if any part of address exists*/
    if ($record[11] != "" || $record[12] != "" || $record[13] != "" || $record[14] != ""){
        insertAddress($record, $connection, "WORK", 11);
    }
    if (strlen($record[15]) > 0){
        insertDate($record, $connection, "BDAY", $record[15]);
    }

}

function insertDate($record, $connection, $type, $date){
    if ($stmt = $connection->prepare("INSERT INTO Date (Contact_id, Date_type, Date) VALUES (?, ?, ?)")){
        $stmt->bind_param("iss", $record[0], $type, $date);

        if ($stmt->execute()) {
            echo "Date insert succeeded!";
        }
        else {
             echo "Date insert failed!";
        }
        $stmt->close();
    }
}

function insertAddress($record, $connection, $type, $number){
    if ($stmt = $connection->prepare("INSERT INTO Address (Contact_id, Address_type, Address, City, State, ZIP) VALUES (?, ?, ?, ?, ?, ?)")){
        $stmt->bind_param("isssss", $record[0], $type, $record[$number], $record[$number + 1], $record[$number + 2], $record[$number + 3]);

        if ($stmt->execute()) {
            echo "Address insert succeeded!";
        }
        else {
             echo "Address insert failed!";
        }
        $stmt->close();
    }
}

function insertPhone($record, $connection, $type, $number){
    if ($stmt = $connection->prepare("INSERT INTO Phone (Contact_id, Phone_type, Area_code, Number) VALUES (?, ?, ?, ?)")){
        $parts = explode("-", $number);
        $area_code = $parts[0];
        $rest = $parts[1] . $parts[2];
        $stmt->bind_param("isss", $record[0], $type, $area_code, $rest);

        if ($stmt->execute()) {
            echo "Phone insert succeeded!";
        }
        else {
             echo "Phone insert failed!";
        }
        $stmt->close();
    }
}

?>
