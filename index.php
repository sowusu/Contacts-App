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
    <!-- 
        <div class="form-row">
                <div class="col-md-6 mb-3">
                <input type="text" class="form-control" id="addressInput" placeholder="Address" required>
                </div>
                <div class="col-md-2 mb-3">
                <input type="text" class="form-control" id="cityInput" placeholder="City" required>
                </div>
                <div class="col-md-2 mb-3">
                <input type="text" class="form-control" id="stateInput" placeholder="State" required>
                </div>
                <div class="col-md-2 mb-3">
                <input type="text" class="form-control" id="zipInput" placeholder="Zip" required>

                </div>
            </div>


    -->
        <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="modalHeaderLabel">Add New Contact</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
        <form id="main" action="insertOrUpdate.php" method="post">
            <div class="form-group">
                <input type="text" class="form-control" id="first-name" placeholder="First Name">
            </div>  
            <div class="form-group">
                <input type="text" class="form-control" id="middle-name" placeholder="Middle Name">
            </div>  
            <div class="form-group">
                <input type="text" class="form-control" id="last-name" placeholder="Last Name">
            </div>
            <div class="form-group">
                <label for="date-picker-example">Pick a Date</label>
                <input placeholder="Selected date" type="date" id="date-picker" class="form-control">
            </div>
        </form>
        </div>
        <div class="modal-footer">
        <input type="submit" class="btn btn-primary" value="Add Contact">
        <input type="reset" class="btn btn-default" data-dismiss="modal" value="Back">
        </div>
        </div>
    </div>
    </div>
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
                <div class="row" id="nameShow">
                    <div class="col-md-11">
                        <h1><span class="fa fa-user"></span>&nbsp;&nbsp;&nbsp;<span id="Fname">John</span> <span id="Mname"></span> <span id="Lname">Appleseed</span></h1></div>
                    <div class="col-md-1">
                        <button id="editNameButtonPress" type="button" class="btn btn-info">
                            <span class="fa fa-edit" aria-label="editName"></span>
                        </button>
                    </div>
                </div>
                <div id="nameEdit" class="form-row">
                    <div class="col-md-1 mb-3">
                        <span class="fa fa-user"></span>
                    </div>
                    <div class="col-md-3 mb-3 form-group">
                        <input type="text" class="form-control" id="nameEditFirstName" placeholder="First" value=""required>
                    </div>
                    <div class="col-md-3 mb-3 form-group">
                        <input type="text" class="form-control" id="nameEditMiddleName" placeholder="Middle" value="" >
                    </div>
                    <div class="col-md-4 mb-3 form-group">
                        <input type="text" class="form-control" id="nameEditLastName" placeholder="Last" value="" required>
                    </div>
                    <div class="col-md-1 mb-3">
                        <button id="saveNameButtonPress" type="submit" form="editName" value="Submit" class="btn btn-success">
                            <span aria-hidden="true">&#10004;</span>
                        </button>
                    </div>
                </div>
                <ul >
                    <h6>
                        Address
                        <button id="address-add" class="btn side-button add-button">
                            <span class="fa fa-plus-circle"></span>
                        </button>
                    </h6>
                    <ul id="address-details" class="list-group list-group-flush">
                        <!-- content generated with js -->
                    </ul>
                    <h6>Phone
                        <button id="phone-add" class="btn side-button add-button">
                            <span class="fa fa-plus-circle"></span>
                        </button>
                    </h6>
                    <ul id="phone-details" class="list-group list-group-flush">
                        <!-- content generated with js -->
                    </ul>
                    <h6>Dates
                        <button id="date-add" class="btn side-button add-button">
                            <span class="fa fa-plus-circle"></span>
                        </button>
                    </h6>
                    <ul id="date-details" class="list-group list-group-flush">
                        <!-- content generated with js -->
                    </ul>
                </ul>
                <button type="button" class="btn btn-outline-dark btn-sm" data-toggle="modal" data-target="#exampleModal">New Contact</button>
            </div>
            <div class="col-md-5 " id="list-pane">
                <div class="form-group has-search">
                    <span class="fa fa-search form-control-feedback"></span>
                    <input id="searchBox" type="text" class="form-control" placeholder="'Fred' or '1997-05-01' or '1 Cupertino ...''" aria-label="Search">
                </div>
                <ul id="contact-list-component" class="list-group overflow-auto">
                    <!-- content generated with js -->
                </ul>
            </div>
            
        </div>
        
    </div>
    </body>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>    
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script src="index.js"></script>
</html>