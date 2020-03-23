$(document).ready(function(){
    loadListWrapper();
})


/***********************************    EVENT LISTENERS   ****************************************** */

$("#searchBox").keyup(function(){
    const val = $(this).val();
    /*show all*/
    $("#contact-list-component a").css("display", "block");
    if (val != ""){
        for (elt of $("#contact-list-component a")){
            /*hides elt if not a match with search val*/
            filterElts(elt, val);
        }
    }
});

$(".add-button").click(function(){
    let elt = this.getAttribute("id").split("-")[0];
    let parent = document.getElementById(elt + "-details");
    /*remove pre-existing*/
    let old = document.getElementById(elt + "NewEditListItem");
    if (old !== null ) old.remove();
    let l_item = document.createElement("li");
    parent.prepend(l_item);
    let parts = ["new"];
    l_item.classList.add("list-group-item", "l-item");
    l_item.setAttribute("id", elt + "NewEditListItem");
    switch(elt){
        case "address":
            $(l_item).append('<div id="addressEdit-' + parts[0] + '" class="form-row">' +
                                '<div class="col-md-7 mb-3 form-group">' +
                                    '<input type="text" class="form-control" id="addEdit-' + parts[0]+ '" placeholder="1 Infinite" value=""required></div>' + 
                                '<div class="col-md-5 mb-3 form-group">' +
                                    '<input type="text" class="form-control" id="cityEdit-' + parts[0]+ '" placeholder="Cupertino" value="" ></div>' +
                                '<div class="col-md-6 mb-3 form-group"><input type="text" class="form-control" id="stateEdit-' + parts[0]+ '" placeholder="California" value="" required></div>' + 
                                '<div class="col-md-3 mb-3 form-group"><input type="text" class="form-control" id="zipEdit-' + parts[0]+ '" placeholder="45321" value="" required></div>' +
                                '<div class="col-md-3 mb-3 form-group">' +
                                    '<select class="form-control" name="address_type" id="addTypeEdit-' + parts[0]+ '" >' + 
                                        '<option value="HOME">HOME</option>' + 
                                        '<option value="WORK">WORK</option>' +
                                        '<option value="OTHER">OTHER</option>' +
                                    '</select>' +
                                '</div>' +
                            '</div>');
        break;
        case "date":
            $(l_item).append(
                                '<div id="dateEdit-' + parts[0] + '" class="form-row">' +
                                '<div class="col-md-6 mb-3 form-group"><input type="text" class="form-control" id="calDateEdit-' + parts[0]+ '" placeholder="1999-09-09" value=""required></div>' +
                                '<div class="col-md-3 mb-3 form-group"><select name="date_type" class="form-control" id="dateTypeEdit-' + parts[0]+ '" ><option value="BDAY">BDAY</option><option value="ANNIV">ANNIV</option><option value="OTHER">OTHER</option></select></div></div>'
                            );
        break;
        case "phone":
            $(l_item).append(
                                '<div id="phoneEdit-' + parts[0] + '" class="form-row"><div class="col-md-3 mb-3 form-group">' +
                                    '<input type="text" class="form-control" id="areaCodeEdit-' + parts[0]+ '" placeholder="123" value=""required></div>' +
                                '<div class="col-md-6 mb-3 form-group"><input type="text" class="form-control" id="numberEdit-' + parts[0]+ '" placeholder="456789" value=""required></div>' +
                                '<div class="col-md-3 mb-3 form-group"><select name="phone_type" class="form-control" id="phoneTypeEdit-' + parts[0]+ '" >' +
                                        '<option value="HOME">HOME</option><option value="WORK">WORK</option><option value="CELL">CELL</option><option value="FAX">FAX</option><option value="OTHER">OTHER</option></select></div></div>'
                            );
        break;
    }
    let s_button = document.createElement("button");
    let d_button = document.createElement("button");
    s_button.addEventListener("click", function(){
                saveButtonPressed(this);
            });
    d_button.addEventListener("click", function(){
                delButtonPressed(this);
            });
    s_button.classList.add("btn", "side-button", "save-button");
    d_button.classList.add("btn", "side-button", "del-button");
    let s_span = document.createElement("span");
    let d_span = document.createElement("span");
    s_span.classList.add("fa", "fa-save");
    d_span.classList.add("fa", "fa-times-circle");
    s_button.append(s_span);
    d_button.append(d_span);
    s_button.setAttribute("id", "save-" + elt + "-" + parts[0]);
    d_button.setAttribute("id", "del-" + elt + "-" + parts[0]);
    document.getElementById(elt + "Edit-" + parts[0]).append(s_button);
    document.getElementById(elt + "Edit-" + parts[0]).append(d_button);
            
});

$("#editNameButtonPress").click(function(){
    document.getElementById("nameEdit").style.display = "flex";
    document.getElementById("nameShow").style.display = "none";
    document.getElementById("nameEditFirstName").value = document.getElementById("Fname").innerText;
    document.getElementById("nameEditMiddleName").value = document.getElementById("Mname").innerText;
    document.getElementById("nameEditLastName").value = document.getElementById("Lname").innerText;
});

$("#saveNameButtonPress").click(function(){
    document.getElementById("nameEdit").style.display = "none";
    document.getElementById("nameShow").style.display = "flex";
    const c_id = document.querySelector("[data-id]").getAttribute("data-id");
    const fn = document.getElementById("nameEditFirstName").value;
    const mn = document.getElementById("nameEditMiddleName").value;
    const ln = document.getElementById("nameEditLastName").value;
    

    /*db update*/
    $.post(
        "update_contact.php",
        {
            contact_id: c_id,
            first_name: fn,
            middle_name: mn,
            last_name: ln,
            update: "true"
        }
    ).done(function(data){
        /*updadate li item*/
        document.getElementById(c_id).innerText = [fn, mn, ln].join(" ");
        /*update detail view*/
        document.getElementById("Fname").innerText = fn;
        document.getElementById("Mname").innerText = mn;
        document.getElementById("Lname").innerText = ln;
    });

});



/***********************************    FUNCTIONS   ****************************************** */
function loadListWrapper(){
    loadContactList()
    .then(function(response){
            initDetailPane();
        }, 
        function(Error){
            console.log(Error);
        }
        );
}

function loadContactList(){

    /*make post request to php*/
    return new Promise(function(resolve, reject){
        $.post(
            "selectContacts.php"
        ).done(function(data){
            //console.log(data);
            const contacts = JSON.parse(data);
            //console.log(contacts);
            
            for (c of contacts){
                let anchorElement = document.getElementById(c.Contact_id);
                if (null == anchorElement){
                    anchorElement = document.createElement('a');
                    anchorElement.classList.add("list-group-item", "list-group-item-action");
                    anchorElement.setAttribute("id", c.Contact_id);
                    anchorElement.setAttribute("href", "#");
                    anchorElement.innerText = c.Fname + " " + c.Mname + " " + c.Lname;
                    /*add necessary event listeners */
                    anchorElement.addEventListener("click", function(e){
                        setDetails(e.target);
                    });
                    document.getElementById("contact-list-component").appendChild(anchorElement);
                }
                
                if (null == anchorElement.getAttribute("data-address") && validAddress(c)){
                    anchorElement.setAttribute("data-address", [c.Address_id, c.Address_type, c.Address, c.City, c.State, c.ZIP].join("#"));
                }
                else{
                    if (validAddress(c) && anchorElement.getAttribute("data-address").indexOf([c.Address_id, c.Address_type, c.Address, c.City, c.State, c.ZIP].join("#")) === -1){
                        anchorElement.setAttribute("data-address", anchorElement.getAttribute("data-address") + "|" + [c.Address_id, c.Address_type, c.Address, c.City, c.State, c.ZIP].join("#"));
                    }
                }
                if (null == anchorElement.getAttribute("data-phone") && validPhone(c)){
                    anchorElement.setAttribute("data-phone", [c.Phone_id, c.Phone_type, c.Area_code, c.Number].join("#"));
                }
                else{
                    if (validPhone(c) && anchorElement.getAttribute("data-phone").indexOf([c.Phone_id, c.Phone_type, c.Area_code, c.Number].join("#")) === -1 ){
                        anchorElement.setAttribute("data-phone", anchorElement.getAttribute("data-phone") + "|" + [c.Phone_id, c.Phone_type, c.Area_code, c.Number].join("#"));
                    }
                }
                if (null == anchorElement.getAttribute("data-date") && validDate(c)){
                    anchorElement.setAttribute("data-date", [c.Date_id, c.Date_type, c.Date].join("#"));
                }
                else{
                    if (validDate(c) && anchorElement.getAttribute("data-date").indexOf([c.Date_id, c.Date_type, c.Date].join("#")) === -1){
                        anchorElement.setAttribute("data-date", anchorElement.getAttribute("data-date") + "|" + [c.Date_id, c.Date_type, c.Date].join("#"));
                    }
                }
            }
            
            resolve(data);
        }).fail(function (){
            reject("post failed!");
        });
    });
    
}

function validAddress(c){
    return null !== c.Address_id;
}

function validPhone(c){
    return null !== c.Phone_id;
}

function validDate(c){
    return null !== c.Date_id;
}

function filterElts(elt, val){
    val = val.toLowerCase();
    if (  elt.innerText.toLowerCase().indexOf(val) === -1 &&
            ((undefined == elt.dataset.address) ? true: (elt.dataset.address.toLowerCase().indexOf(val) === -1)) &&
            ((undefined == elt.dataset.phone) ? true: (elt.dataset.phone.toLowerCase().indexOf(val) === -1)) &&
            ((undefined == elt.dataset.date) ? true: (elt.dataset.date.toLowerCase().indexOf(val) === -1))  
        ){
        elt.style.display = "none";
    }
}

function initDetailPane() {
    /*set detail pane to be first item on list*/
    setDetails(document.querySelector("#contact-list-component a:first-child"));
}

function editButtonPressed(button_target){
    const psis = button_target.getAttribute("id").split("-");
    document.getElementById([psis[1] + "Show", psis[2]].join("-")).style.display = "none";
    document.getElementById([psis[1] + "Edit", psis[2]].join("-")).style.display = "flex";

    /*populate previous values*/
    let full_text = document.getElementById([psis[1] + "Show", psis[2]].join("-")).innerText;
    setEditFields(psis[1], full_text, psis[2]);
}

function setEditFields(table, details, elt_id){
    let type_and_rest = details.split("|");
    switch(table){
        case "address":
            document.getElementById("addTypeEdit-" + elt_id).value = type_and_rest[0].trim();
            let addDetails = type_and_rest[1].split(",");
            document.getElementById("addEdit-" + elt_id).value = addDetails[0].trim();
            document.getElementById("cityEdit-" + elt_id).value = addDetails[1].trim();
            document.getElementById("stateEdit-" + elt_id).value = addDetails[2].trim();
            document.getElementById("zipEdit-" + elt_id).value = addDetails[3].trim();
        break;
        case "phone":
                document.getElementById("phoneTypeEdit-" + elt_id).value = type_and_rest[0].trim();
                let phoneDetails = type_and_rest[1].split(")");
                document.getElementById("areaCodeEdit-" + elt_id).value = phoneDetails[0].trim().substr(1);
                document.getElementById("numberEdit-" + elt_id).value = phoneDetails[1].trim();
        break;
        case "date":
                document.getElementById("dateTypeEdit-" + elt_id).value = type_and_rest[0].trim();
                document.getElementById("calDateEdit-" + elt_id).value = type_and_rest[1].trim();
        break;
    }
}

function saveButtonPressed(button_target){
    const psis = button_target.getAttribute("id").split("-");
    const details = getFormDetails(psis[1], psis[2]);
    if (hasChanged(details)){//always true for edit
        if (psis[2] == "new") {
            /*create request with new details*/
            sendCreateEltRequest(capitalize(psis[1]), details);
        }
        else {
            //document.getElementById([psis[1] + "Show", psis[2]].join("-")).style.display = "block";
            //document.getElementById([psis[1] + "Edit", psis[2]].join("-")).style.display = "none";
            sendUpdateEltRequest(capitalize(psis[1]), details, psis[2]);
        }
    }
    
    
}

function hasChanged(details){
    for (item in details){
        if (item !== ""){
            return true;
        }
    }
    return false;
}

function getFormDetails(elt, elt_id){
    let details  = {};
    switch (elt){
        case "address": 
            details.address = document.getElementById("addEdit-" + elt_id).value;
            details.city = document.getElementById("cityEdit-" + elt_id).value;
            details.state = document.getElementById("stateEdit-" + elt_id).value;
            details.zip = document.getElementById("zipEdit-" + elt_id).value;
            details.type = document.getElementById("addTypeEdit-" + elt_id).value;
        break;
        case "date":
            details.date = document.getElementById("calDateEdit-" + elt_id).value;
            details.type = document.getElementById("dateTypeEdit-" + elt_id).value;
        break;
        case "phone": 
            details.areaCode = document.getElementById("areaCodeEdit-" + elt_id).value;
            details.number = document.getElementById("numberEdit-" + elt_id).value;
            details.type = document.getElementById("phoneTypeEdit-" + elt_id).value;
        break;
    }
    return details;
}

function sendUpdateEltRequest(table, details, elt_id){

    details.contact_id = document.querySelector("[data-id]").getAttribute("data-id");
    details.elt_id = elt_id;
    
    /*db create elt*/
    $.post(
        "update_" + table.toLowerCase() + ".php",
        details
    ).done(function(data){
        console.log(data);
        /*create detail elt*/
        let new_elt_entry = "";
        switch (table){
            case "Address": 
                new_elt_entry = elt_id + "#" + details.type + "#" + details.address + "#" + details.city + "#" + details.state + "#" + details.zip;
            break;
            case "Date":
                new_elt_entry = elt_id + "#" + details.type + "#" + details.date;        
            break;
            case "Phone": 
                new_elt_entry = elt_id + "#" + details.type + "#" + details.areaCode + "#" + details.number;        
            break;
        }
        document.getElementById([table.toLowerCase() + "Show", elt_id].join("-")).parentNode.remove();
        addDetail(table, [new_elt_entry]);
        /*update detail metadata in list item*/
        let l_item = document.getElementById(details.contact_id);
        let elt_details = l_item.getAttribute("data-"+table.toLowerCase()).split("|");
        elt_details = elt_details.filter(function(value, index, arr){return value.indexOf(elt_id) === -1});
        elt_details.push(new_elt_entry);
        l_item.setAttribute("data-"+table.toLowerCase(), elt_details.join("|"));

    });
}

function sendCreateEltRequest(table, details){

    details.contact_id = document.querySelector("[data-id]").getAttribute("data-id");
    /*db create elt*/
    $.post(
        "insert_" + table.toLowerCase() + ".php",
        details
    ).done(function(new_elt_id){//data should have new id of created elt
        document.getElementById(table.toLowerCase() + "NewEditListItem").remove();
        /*create detail elt*/
        let new_elt_entry = "";
        switch (table){
            case "Address": 
                new_elt_entry = new_elt_id + "#" + details.type + "#" + details.address + "#" + details.city + "#" + details.state + "#" + details.zip;
            break;
            case "Date":
                new_elt_entry = new_elt_id + "#" + details.type + "#" + details.date;        
            break;
            case "Phone": 
                new_elt_entry = new_elt_id + "#" + details.type + "#" + details.areaCode + "#" + details.number;        
            break;
        }
        addDetail(table, [new_elt_entry]);
        /*update detail metadata in list item*/
        let l_item = document.getElementById(details.contact_id);
        if (null != l_item.getAttribute("data-"+table.toLowerCase()) ){
            if (l_item.getAttribute("data-"+table.toLowerCase()) ==""){
                l_item.setAttribute("data-"+table.toLowerCase(), new_elt_entry);
            }
            else{
                l_item.setAttribute("data-"+table.toLowerCase(), l_item.getAttribute("data-"+table.toLowerCase()) + "|" + new_elt_entry);
            }
        }
        else{
            l_item.setAttribute("data-"+table.toLowerCase(), new_elt_entry);
        }
    });
}

function delButtonPressed(button_target){
    const psis = button_target.getAttribute("id").split("-");
    if (psis[2] == "new"){
        document.getElementById(psis[1] + "NewEditListItem").remove();
    }
    else{
        
        let details = {};
        let contact_id = document.querySelector("[data-id]").getAttribute("data-id");
        details.elt_id = psis[2];
        details.table = capitalize(psis[1]);
        /*db delete elt*/
        $.post(
            "delete_elt.php",
            details
        ).done(function(delete_result){
            console.log(delete_result);
            /*do when delete is successful*/
            document.getElementById([psis[1] + "Show", psis[2]].join("-")).parentNode.remove();

            /*remove from detail metadata in list item*/
            let l_item = document.getElementById(contact_id);
            let elt_details = l_item.getAttribute("data-"+psis[1]).split("|");
            elt_details = elt_details.filter(function(value, index, arr){return value.indexOf(psis[2]) === -1});
            if (elt_details.length === 0){
                l_item.setAttribute("data-"+psis[1], "");
            }
            else{
                l_item.setAttribute("data-"+psis[1], elt_details.join("|"));
            }

                
        });
    }
}

function removeDetail(elt_details, elt_id){
    let target = "";
    for (item of elt_details){
        if (item.indexOf(elt_id) !== -1){
            target = item;
            break;
        }
    }
    if (target !== "") elt_details.remove
}

function setDetails(anchor_target){
    let name = anchor_target.innerText.split(" ");
    document.querySelector("#nameShow h1").setAttribute("data-id", anchor_target.id);
    switch (name.length){
        case 3: setNameFML(name)
        break;
        case 2: setNameFL(name)
        break;
        case 1: setNameF(name)
        break;
        case 0: setName()
        break;
        default: setNameMany(name)
    }
    /*remove current children*/
    document.getElementById("address-details").innerHTML = "";
    document.getElementById("phone-details").innerHTML = "";
    document.getElementById("date-details").innerHTML = "";

    if(undefined != anchor_target.dataset.address){
        let addresses = anchor_target.dataset.address.split("|");
        addDetail("Address", addresses);
    }
    if(undefined != anchor_target.dataset.date){
        let dates = anchor_target.dataset.date.split("|");
        addDetail("Date", dates);
    }
    if(undefined != anchor_target.dataset.phone){
        let phones = anchor_target.dataset.phone.split("|");
        addDetail("Phone", phones);
    }    
}

function addDetail(table, table_details_array){
    if (table_details_array[0].length > 0){
        for (item of table_details_array){
            parts = item.split("#");
            let l_item = document.createElement("li");
            l_item.classList.add("list-group-item", "l-item");
            let w_div = document.createElement("div");
            w_div.setAttribute("id", table.toLowerCase() + "Show-" + parts[0]);
            switch (table){
                case "Address": w_div.innerText = parts[1] + " | " + parts[2] + ", " + parts[3] + ", " + parts[4] + ", " + parts[5];
                                document.getElementById("address-details").append(l_item);
                                $(l_item).append('<div id="addressEdit-' + parts[0] + '" class="form-row detail-edit">' +
                                '<div class="col-md-7 mb-3 form-group">' +
                                    '<input type="text" class="form-control" id="addEdit-' + parts[0]+ '" placeholder="1 Infinite" value=""required></div>' + 
                                '<div class="col-md-5 mb-3 form-group">' +
                                    '<input type="text" class="form-control" id="cityEdit-' + parts[0]+ '" placeholder="Cupertino" value="" ></div>' +
                                '<div class="col-md-6 mb-3 form-group"><input type="text" class="form-control" id="stateEdit-' + parts[0]+ '" placeholder="California" value="" required></div>' + 
                                '<div class="col-md-3 mb-3 form-group"><input type="text" class="form-control" id="zipEdit-' + parts[0]+ '" placeholder="45321" value="" required></div>' +
                                '<div class="col-md-3 mb-3 form-group">' +
                                    '<select class="form-control" name="address_type" id="addTypeEdit-' + parts[0]+ '" >' + 
                                        '<option value="HOME">HOME</option>' + 
                                        '<option value="WORK">WORK</option>' +
                                        '<option value="OTHER">OTHER</option>' +
                                    '</select>' +
                                '</div>' +
                            '</div>');
                break;
                case "Date": w_div.innerText = parts[1] + " | " + parts[2];
                            document.getElementById("date-details").append(l_item);
                            $(l_item).append(
                                '<div id="dateEdit-' + parts[0] + '" class="form-row detail-edit">' +
                                '<div class="col-md-6 mb-3 form-group"><input type="text" class="form-control" id="calDateEdit-' + parts[0]+ '" placeholder="1999-09-09" value=""required></div>' +
                                '<div class="col-md-3 mb-3 form-group"><select name="date_type" class="form-control" id="dateTypeEdit-' + parts[0]+ '" ><option value="BDAY">BDAY</option><option value="ANNIV">ANNIV</option><option value="OTHER">OTHER</option></select></div></div>'
                            );
                            
                break;
                case "Phone": w_div.innerText = parts[1] + " | " + "(" + parts[2] + ")" + parts[3];
                            document.getElementById("phone-details").append(l_item);
                            $(l_item).append(
                                '<div id="phoneEdit-' + parts[0] + '" class="form-row detail-edit"><div class="col-md-3 mb-3 form-group">' +
                                    '<input type="text" class="form-control" id="areaCodeEdit-' + parts[0]+ '" placeholder="123" value=""required></div>' +
                                '<div class="col-md-6 mb-3 form-group"><input type="text" class="form-control" id="numberEdit-' + parts[0]+ '" placeholder="456789" value=""required></div>' +
                                '<div class="col-md-3 mb-3 form-group"><select name="phone_type" class="form-control" id="phoneTypeEdit-' + parts[0]+ '" >' +
                                        '<option value="HOME">HOME</option><option value="WORK">WORK</option><option value="CELL">CELL</option><option value="FAX">FAX</option><option value="OTHER">OTHER</option></select></div></div>'
                            );
                break;
            }
            l_item.append(w_div);
           
            let s_button = document.createElement("button");
            let e_button = document.createElement("button");
            let d_button = document.createElement("button");
            e_button.addEventListener("click", function(){
                editButtonPressed(this);
            })
            s_button.addEventListener("click", function(){
                saveButtonPressed(this);
            })
            d_button.addEventListener("click", function(){
                delButtonPressed(this);
            })
            s_button.classList.add("btn", "side-button", "save-button");
            e_button.classList.add("btn", "side-button", "edit-button");
            d_button.classList.add("btn", "side-button", "del-button");
            let s_span = document.createElement("span");
            let e_span = document.createElement("span");
            let d_span = document.createElement("span");
            s_span.classList.add("fa", "fa-save");
            e_span.classList.add("fa", "fa-edit");
            d_span.classList.add("fa", "fa-times-circle");
            s_button.append(s_span);
            e_button.append(e_span);
            d_button.append(d_span);
            s_button.setAttribute("id", "save-" + table.toLowerCase() + "-" + parts[0]);
            e_button.setAttribute("id", "edit-" + table.toLowerCase() + "-" + parts[0]);
            d_button.setAttribute("id", "del-" + table.toLowerCase() + "-" + parts[0]);
            w_div.append(e_button);
            document.getElementById(table.toLowerCase() + "Edit-" + parts[0]).append(s_button);
            document.getElementById(table.toLowerCase() + "Edit-" + parts[0]).append(d_button);
        } 
        
    }
    

}

function setNameFML(name){
    $("#Fname").text(name[0]);
    $("#Mname").text(name[1]);
    $("#Lname").text(name[2]);
}

function setNameFL(name){
    $("#Fname").text(name[0]);
    $("#Mname").text("");
    $("#Lname").text(name[1]);
}

function setNameF(name){
    $("#Fname").text(name[0]);
    $("#Mname").text("");
    $("#Lname").text("");
}

function setName(){
    $("#Fname").text("");
    $("#Mname").text("");
    $("#Lname").text("");
}

function setNameMany(name){
    $("#Fname").text(name[0]);
    var middle = "";
    for (var i= 1; i < name.length - 2; i++){
        middle = middle + name[i];
    }
    $("#Mname").text(middle);
    $("#Lname").text(name[name.length -2] + name[name.length -1]);
}

function capitalize(s){
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1)
}
