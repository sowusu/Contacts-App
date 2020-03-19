$(document).ready(function(){
    initDetailPane();
})


function initDetailPane() {
    /*set detail pane to be first item on list*/
    setDetails(document.querySelector("#contact-list-component a:first-child"));
}

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
    console.log(addresses);
    console.log(dates);
    console.log(phones);
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
