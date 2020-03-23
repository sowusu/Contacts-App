<?php
require_once 'login.php';
$connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);

if ($connection->connect_error) die($connection->connect_error);

if (    isset($_POST['toSearch'])     &&
        isset($_POST['id'])
    )
    {
        $contact_id = $_POST['id'];
        $table = $_POST['toSearch'];
       
        $query  = "SELECT * FROM $table WHERE Contact_id=$contact_id";
        $result = $connection->query($query);
            
        if (!$result) die ("Database access failed: " . $connection->error);
        
        $rows = $result->num_rows;
        $retval  = "";
        if ($rows != 0) {
            for ($j = 0 ; $j < $rows ; ++$j)
            {
                if ($j > 0) {
                    $retval .= "|";
                }
                
                $result->data_seek($j);
                $row = $result->fetch_array(MYSQLI_NUM);
                $new_val = "";
                switch ($table) {
                    case "Address":
                        $new_val = "$row[2]#$row[3]#$row[4]#$row[5]#$row[6]";
                        break;
                    case "Phone":
                        $new_val = "$row[2]#$row[3]#$row[4]";
                        break;
                    case "Date":
                        $new_val = "$row[2]#$row[3]";
                        break;
                }
                
                $retval .= $new_val;
            }
        }
        echo $retval;
        $result->close();
}
$connection->close();





?>