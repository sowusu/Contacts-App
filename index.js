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
    $.post(
        "update_insert_contacts.php",
        {
            contact_id: document.querySelector("[data-id]").getAttribute("data-id"),
            first_name: document.getElementById("nameEditFirstName").value,
            middle_name: document.getElementById("nameEditMiddleName").value,
            last_name: document.getElementById("nameEditLastName").value,
            update: "true"
        }
    ).done(function(data){
        //console.log(data);
        //console.log(JSON.parse(data));
        loadListWrapper();
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
    document.getElementById("apd-details").innerHTML = "";

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
    let header = document.createElement("h6");
    let ulist = document.createElement("ul");
    ulist.classList.add("list-group", "list-group-flush");
    if (table_details_array[0].length > 0){
        for (item of table_details_array){
            parts = item.split("#");
            let l_item = document.createElement("li");
            l_item.classList.add("list-group-item", "l-item");
            switch (table){
                case "Address": l_item.innerText = parts[1] + " | " + parts[2] + ", " + parts[3] + ", " + parts[4] + ", " + parts[5];
                break;
                case "Date": l_item.innerText = parts[1] + " | " + parts[2];
                break;
                case "Phone": l_item.innerText = parts[1] + " | " + "(" + parts[2] + ")" + parts[3];
                break;
            }
            ulist.append(l_item);
        } 
    
        switch (table){
            case "Address": header.innerHTML = table;
            break;
            case "Date": header.innerHTML = table;
            break;
            case "Phone": header.innerHTML = table;
            break;
        }
        
        document.getElementById("apd-details").appendChild(header);
        document.getElementById("apd-details").appendChild(ulist);
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
