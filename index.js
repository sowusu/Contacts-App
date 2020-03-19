$(document).ready(function(){
    initDetailPane();
})

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


function filterElts(elt, val){
    if (!(elt.innerText.indexOf(val) !== -1 || elt.dataset.address.indexOf(val) !== -1 || elt.dataset.phone.indexOf(val) !== -1 || elt.dataset.date.indexOf(val) !== -1)){
        elt.style.display = "none";
    }
}

function initDetailPane() {
    /*set detail pane to be first item on list*/
    setDetails(document.querySelector("#contact-list-component a:first-child"));
}

$("#contact-list-component a").click(function(e){setDetails(e.target); } );

function setDetails(anchor_target){
    let name = anchor_target.innerText.split(" ");
    switch (name.length){
        case 3: setNameFML(name)
        break;
        case 2: setNameFL(name)
        break;
        case 1: setNameF(name)
        break;
        default: setName(name)
    }
    addresses = anchor_target.dataset.address.split("|");
    dates = anchor_target.dataset.date.split("|");
    phones = anchor_target.dataset.phone.split("|");

    
    /*remove current children*/
    document.getElementById("apd-details").innerHTML = "";
    addDetail("Address", addresses);
    addDetail("Date", dates);
    addDetail("Phone", phones);

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
                case "Address": l_item.innerText = parts[1] + ", " + parts[2] + ", " + parts[3] + ", " + parts[4];
                break;
                case "Date": l_item.innerText = parts[1];
                break;
                case "Phone": l_item.innerText = "(" + parts[1] + ")" + parts[2];
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
