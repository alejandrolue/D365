// ==UserScript==
// @name        D365 Script Merkle
// @namespace   Violentmonkey Scripts
// @match       https://dand365prod.operations.dynamics.com/?cmp=CH09&mi=TSTimesheetEntryGridViewMyTimesheets
// @grant       none
// @version     1.2
// @author      Alejandro Lüthi
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @require http://userscripts-mirror.org/scripts/source/107941.user.js
// @grant GM_setValue
// @grant GM_getValue
// @description 14/09/2022, 14:34:12
// ==/UserScript==

$(document).ready(function () {
    $(document).on("click", "#TSTimesheetTable_TimesheetNbr_GridView_3_0_0_input", function () {
        waitForElm(".multilineInput-textArea").then((elm) => {

            var state = localStorage.getItem('storedData');
            let data = [];
            if (state) {
                data = [...JSON.parse(state)];
            } else {
                console.log("");
            }

            document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.after(createDropdown(data));

            document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.after(deleteValue(data));

            document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.after(bigRedButton(data));

            document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.onchange = function () {
                getValue()
            };

            document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.onchange = function () {
                if (getValue() === "") {
                    console.log("is empty");
                } else {
                    let value = getValue();
                    let res = value.replace(/^[ ]+/g, "");
                    let short = res.replace(/[ ]+$/g, "");
                    console.log(short)
                    let matches = false;
                    data.forEach(store => {
                        if (store === short) {
                            matches = true;
                        }
                    })

                    if (matches != true) {
                        data.push([short, 0]);
                        if (data.length > 11) {
                            data.splice(0, 1);
                            localStorage.setItem('storedData', JSON.stringify(data));
                            createSelectFields();
                            createDeleteFields();
                        } else {
                            localStorage.setItem('storedData', JSON.stringify(data));
                            createSelectFields();
                            createDeleteFields();
                        }
                    }
                    matches = false;
                }

                document.getElementById("You're_welcome_Boris").onchange = function () {
                    onSelect()
                };
            };

            document.getElementById("You're_welcome_Boris").onchange = function () {
                onSelect()
            };
            document.getElementById("You're_welcome_Janes").onchange = function () {
                onDeleteSelect()
            };

            document.getElementById("bigRedButton").onclick = function () {
                console.log("data" + data.length)
                for (var i = 0; data.length > i; i++) {
                    document.getElementById("select").remove();
                    document.getElementById("delete").remove();
                }

                for (var i = 0; i < data.length; i++) {
                    data.splice(i, 1);
                    i--;
                }
                localStorage.setItem('storedData', JSON.stringify(data));
                let deleted = document.getElementById("You're_welcome_Janes")
                let selected = document.getElementById("You're_welcome_Boris")
                console.log(deleted);
                let defaultDelete = "Delete Value"
                let defaultSelect = "Select"
                for (var i, j = 0; i = deleted.options[j]; j++) {
                    if (i.value == defaultDelete) {
                        deleted.selectedIndex = j;
                        break;
                    }
                }

                for (var i, j = 0; i = selected.options[j]; j++) {
                    if (i.value == defaultSelect) {
                        selected.selectedIndex = j;
                        break;
                    }
                }
                console.log(data + "test")
                console.log(data);
            }

            document.getElementById("You're_welcome_Janes").onchange = function () {
                onDelete();
            }

            function onDelete() {
                let value = document.getElementById("You're_welcome_Janes").value;
                for (var i = 0; data.length > i; i++) {
                    document.getElementById("select").remove();
                }
                for (var i = 0; data.length > i; i++) {
                    document.getElementById("delete").remove();
                }

                console.log(value + "value");
                for (var i = 0; i < data.length; i++) {
                    if (data[i] === value) {
                        console.log(data[i] + "data test")
                        data.splice(i, 1);
                        console.log(data)
                        localStorage.setItem('storedData', JSON.stringify(data));

                    }
                }

                let deleted = document.getElementById("You're_welcome_Janes")
                let selected = document.getElementById("You're_welcome_Boris")
                console.log(deleted);
                let defaultDelete = "Delete Value"
                let defaultSelect = "Select"
                for (var i, j = 0; i = deleted.options[j]; j++) {
                    if (i.value == defaultDelete) {
                        deleted.selectedIndex = j;
                        break;
                    }
                }

                for (var i, j = 0; i = selected.options[j]; j++) {
                    if (i.value == defaultSelect) {
                        selected.selectedIndex = j;
                        break;
                    }
                }
                console.log(data.length + " hello")
                for (var i = 0; i < data.length; i++) {
                    option = document.createElement("option");
                    option.value = data[i];
                    option.text = data[i];
                    option.id = "delete"
                    document.getElementById("You're_welcome_Janes").appendChild(option);
                }
                for (var i = 0; i < data.length; i++) {
                    option = document.createElement("option");
                    option.value = data[i];
                    option.text = data[i];
                    option.id = "select"
                    document.getElementById("You're_welcome_Boris").appendChild(option);
                }
                console.log(data);


            }

            function createSelectFields() {
                for (var i = 0; data.length - 1 > i; i++) {
                    document.getElementById("select").remove();
                }

                for (var i = 0; i < data.length; i++) {
                    let dataSplit = data[i].toString().split(",")
                    console.log(dataSplit)
                    option = document.createElement("option");
                    option.value = dataSplit[0];
                    option.text = dataSplit[0];
                    option.id = "select"
                    document.getElementById("You're_welcome_Boris").appendChild(option);
                }
            }

            function createDeleteFields() {
                console.log("delete");

                for (var i = 0; data.length - 1 > i; i++) {
                    document.getElementById("delete").remove();
                }

                console.log(data)

                for (var i = 0; i < data.length; i++) {
                    let dataSplit = data[i].toString().split(",")
                    option = document.createElement("option");
                    option.value = dataSplit[0];
                    option.text = dataSplit[0];
                    option.id = "delete";
                    console.log(i)
                    document.getElementById("You're_welcome_Janes").appendChild(option);
                }
                //document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.after(deleteValue(data));
            }
        })
    });
});

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true, subtree: true
        });
    });
}

function createDropdown(data) {
    var select = document.createElement("select");
    select.id = "You're_welcome_Boris";

    var option = document.createElement("option");
    option.setAttribute("selected", "");
    option.setAttribute("disabled", "");
    option.text = "Select";

    select.appendChild(option);

    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",")
        option = document.createElement("option");
        option.value = dataSplit[0];
        option.text = dataSplit[0];
        option.id = "select"
        select.appendChild(option);
    }
    return select
}

function bigRedButton(data) {
    var button = document.createElement("button");
    button.innerHTML = "Delete all";
    button.name = "delete";
    button.id = "bigRedButton";

    button.onclick = function () {
        alert("Data has been deleted")
    }
    return button
}

function deleteValue(data) {
    var deleteSelect = document.createElement("select");
    deleteSelect.id = "You're_welcome_Janes";

    var option = document.createElement("option");
    option.setAttribute("selected", "");
    option.setAttribute("disabled", "");
    option.id = "test";
    option.text = "Delete Value";
    deleteSelect.appendChild(option);
    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",")
        option = document.createElement("option");
        option.value = dataSplit[0];
        option.text = dataSplit[0];
        option.id = "delete"
        deleteSelect.appendChild(option);
    }
    return deleteSelect;
}

function getValue() {
    var value = document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.value;
    console.log(value)
    return value;
}

function onSelect() {
    let value = document.getElementById("You're_welcome_Boris").value
    document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.value = value;
}

function onDeleteSelect() {
    let value = document.getElementById("You're_welcome_Janes").value
    console.log(value + " from se");
    //document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.value = value;
}
