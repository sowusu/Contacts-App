<!doctype html>
<html>
    <head>
        <title>Contacts App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
        <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
        <link rel="stylesheet" href="index.css">
    </head>
    <body>
    <?php
        require_once 'login.php';
        $connection = new mysqli($db_hostname, $db_username, $db_password, $db_database);
    
        if ($connection->connect_error) die($connection->connect_error);
    ?>
    <div class="container">
        <?php
            echo "<h1> </h1>";
            function getDetails($contact_id, $table, $connection){
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
                return $retval;
            }
    
        ?>
        <div class="row">
        <div class="col-md-7" id="detail-pane">
                <h1><span class="fa fa-user"></span>&nbsp;&nbsp;&nbsp;<span id="Fname">John</span> <span id="Mname"></span> <span id="Lname">Appleseed</span></h1>
                <ul>  
                    <h6>Address</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item l-item">Address 1</li>
                        <li class="list-group-item l-item">Address 2</li>
                    </ul>
                    <h6>Phone</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item l-item">Phone 1</li>
                        <li class="list-group-item l-item">Phone 2</li>
                    </ul>
                    <h6>Dates</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item l-item">Date 1</li>
                        <li class="list-group-item l-item">Date 2</li>
                    </ul>
                </ul>
                <button type="button" class="btn btn-outline-dark btn-sm">New Contact</button>
                <button type="button" class="btn btn-dark btn-sm">Edit Contact</button>
            </div>
            <div class="col-md-5 " id="list-pane">
                <div class="form-group has-search">
                    <span class="fa fa-search form-control-feedback"></span>
                    <input type="text" class="form-control" placeholder="'Fred' or '1997-05-01' or '1 Cupertino ...''" aria-label="Search">
                </div>
                <ul id="contact-list-component" class="list-group overflow-auto">
                    <?php
                        $query  = "SELECT * FROM Contact";
                        $result = $connection->query($query);
                      
                        if (!$result) die ("Database access failed: " . $connection->error);
                      
                        $rows = $result->num_rows;
                        
                        for ($j = 0 ; $j < $rows ; ++$j)
                        {
                          $result->data_seek($j);
                          $row = $result->fetch_array(MYSQLI_NUM);
                          $address = getDetails($row[0], "Address", $connection);
                          $date = getDetails($row[0], "Date", $connection);
                          $phone = getDetails($row[0], "Phone", $connection);

                          echo <<<_END
                          <a href="#" id="$row[0]" data-address="$address" data-phone="$phone" data-date="$date" class="list-group-item list-group-item-action">$row[1] $row[2] $row[3]</a>
_END;
                        }
                    ?>
                </ul>

            </div>
            
        </div>
        
    </div>
    </body>
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script src="index.js"></script>
</html>