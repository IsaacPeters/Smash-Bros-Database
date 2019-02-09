
//Create table at start
var table = buildTable(null);
var body = document.body;
table.id = "mainTable";
body.appendChild(table);

document.addEventListener("DOMContentLoaded", bindButtons);

function bindButtons(){
    initTable();
}

function buildTable(queryData) {
    var table = document.createElement("table");
    table.appendChild(document.createElement("thead"));
    table.firstElementChild.appendChild(document.createElement("tr"));
    table = table.firstElementChild.firstElementChild;

    var dataNames = ["Name", "Year Released"];
    dataNames.forEach( function (element) {

        var newItem = document.createElement("th");
        newItem.textContent = element;
        newItem.id = "H" + element;
        table.appendChild(newItem);
    });
    table = table.parentElement.parentElement;

    table.appendChild(document.createElement("tbody"));
    table = table.children[1];

    table = table.parentElement;

    table.style.borderStyle = "solid";

    //Styling the Table
    var tableBlocks = table.getElementsByTagName("th");
    for (var i = 0; i < tableBlocks.length; i++) {
        tableBlocks[i].style.borderStyle = "solid";
        tableBlocks[i].style.backgroundColor = "lightgreen";
    }

    tableBlocks = table.getElementsByTagName("td");
    for (var i = 0; i < tableBlocks.length; i++) {
        tableBlocks[i].style.borderStyle = "solid";
    }

    return table;
}

function initTable() {
    var req = new XMLHttpRequest();
    req.open("GET", "/all", true);

    req.addEventListener("load", function(){
        var response = JSON.parse(req.responseText);
        var response = JSON.parse(response.results);
        var updatedTable = buildTable(response);
        body.removeChild(document.getElementById("mainTable"));
        updatedTable.id = "mainTable";
        body.appendChild(updatedTable);
    });

    req.send(null);
    event.preventDefault();
}