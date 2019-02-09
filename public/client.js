//Create table at start
var table = buildTable(null);
var body = document.body;
table.id = "mainTable";
body.appendChild(table);

document.addEventListener("DOMContentLoaded", bindButtons);

function bindButtons(){
    initTable();

    document.getElementById("submitButton").addEventListener("click", function(event){
        
        if (document.getElementById("name").value == "") {
            console.log("Error, name field required!");
            return;
        }

        var req = new XMLHttpRequest();

        var insertURL = createQueryURL("/insert");

        req.open("GET", insertURL , true);

        req.addEventListener("load", function(){
            var response = JSON.parse(req.responseText);
            initTable();
        });

        req.send(null);
        event.preventDefault();
    })
}
/**
 * This function is meant to build a GET request query string for the data we need.
 * @param {base url to add onto} base 
 */
function createQueryURL (base) {
    var dataNames = ["name", "reps", "weight", "date", "lbs"];
    var url = base + "?";

    dataNames.forEach(function (element) {
        if (element === "lbs") {
            var item = document.getElementById(element).checked;
            if (item)
                item = 1;
            url += element + "=" + item + "&";
        } else {
            var item = document.getElementById(element).value;
            if (item != "") {
                url += element + "=" + item + "&";
            }
        }
        
    });

    return url;
}

function deleteRow() {
    //Get ID from last element in this input list
    var id = this.parentElement.lastElementChild.id;

    //Send id to server to remove
    var req = new XMLHttpRequest();
    req.open("GET", "/removeID?id=" + id, true);
    
    var item = this.parentElement.parentElement.parentElement;
    req.addEventListener("load", function(){
        //Remove it once it loads
        item.parentElement.removeChild(item);

        //Refresh Table
        initTable();
    });

    req.send(null);

    event.preventDefault();
    
}

function updateRow() {
    //Get ID from last element in this input list
    var id = this.parentElement.lastElementChild.id;

    //Send id and information to server to update
    var req = new XMLHttpRequest();
    var updateURL = createQueryURL("/update");
    updateURL += "id=" + id;

    req.open("GET", updateURL, true);
    var item = this.parentElement.parentElement.parentElement;
    req.addEventListener("load", function(){
        //Refresh Table
        initTable();
    });

    req.send(null);

    event.preventDefault();
}

function buildTable(queryData) {
    var table = document.createElement("table");
    table.appendChild(document.createElement("thead"));
    table.firstElementChild.appendChild(document.createElement("tr"));
    table = table.firstElementChild.firstElementChild;

    var dataNames = ["name", "reps", "weight", "date", "lbs"];
    dataNames.forEach( function (element) {

        var newItem = document.createElement("th");
        if (element === "lbs") {
            element = "unit";
        }
        newItem.textContent = element;
        newItem.id = "H" + element;
        table.appendChild(newItem);
    });
    table = table.parentElement.parentElement;

    table.appendChild(document.createElement("tbody"));
    table = table.children[1];

    if (queryData != null) {
        queryData.forEach(function(element) {
            var row = document.createElement("tr");

            //Insert data from query
            dataNames.forEach(function (typeName) {
                //Create an empty item to put stuff into
                var newItem = document.createElement("td");

                if (element[typeName] != null) {
                    if (typeName === "lbs") {
                        if (element[typeName]) {
                            newItem.textContent = "Pounds";
                        } else {
                            newItem.textContent = "Kilograms";
                        }
                    } else if (typeName === "date") {
                        newItem.textContent = element[typeName].substring(0, 10);
                    } else {
                        newItem.textContent = element[typeName];
                    }
                } 
                
                row.appendChild(newItem);
            });

            //Create delete/update buttons
            row.appendChild(document.createElement("form"));
            row.lastElementChild.appendChild(document.createElement("fieldset"));
            row = row.lastElementChild.lastElementChild;

            for (var i = 0; i < 3; i++) {
                row.appendChild(document.createElement("input"));
            }

            //First Button, DELETE
            //Always make hidden input last so we can find/delete this row easily!
            row.children[0].value = "DELETE";
            row.children[0].type = "button";
            row.children[0].addEventListener("click", deleteRow);

            row.children[1].value= "UPDATE";
            row.children[1].type = "button";
            row.children[1].addEventListener("click", updateRow);

            row.children[2].type = "hidden";
            row.children[2].id = element.id;
            

            row = row.parentElement.parentElement;

            table.appendChild(row);
        });
    }

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