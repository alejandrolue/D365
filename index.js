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
                        let splitStore = store.toString().split(",")
                        if (splitStore[0] === short) {
                            matches = true;
                        }
                    })

                    if (matches != true) {
                        data.push([short, 0]);
                        data.sort(function (a, b) {return a[1] - b[1]})
                        if (data.length > 11) {
                            for (var i = 0; i < data.length; i++) {
                                let dataSplit = data[i].toString().split(",")
                                dataSplit.sort(function (a, b) {return b[1] - a[1]})
                                if (dataSplit[1] < 5) {
                                    data.splice(i, 1);
                                    break;
                                }
                            }
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
                    for (var i = 0; i < data.length; i++) {
                        let dataSplit = data[i].toString().split(",")
                        if (dataSplit[0] === getValue()) {
                            let levelUp = parseInt(dataSplit[1]) + 1;
                            data[i] = [dataSplit[0], levelUp];
                            localStorage.setItem('storedData', JSON.stringify(data));
                        }
                    }
                };
            };

            document.getElementById("You're_welcome_Boris").onchange = function () {
                onSelect();
                for (var i = 0; i < data.length; i++) {
                    let dataSplit = data[i].toString().split(",")
                    if (dataSplit[0] === getValue()) {
                        let levelUp = parseInt(dataSplit[1]) + 1;
                        data[i] = [dataSplit[0], levelUp];
                        localStorage.setItem('storedData', JSON.stringify(data));
                    }
                }
            }

            document.getElementById("You're_welcome_Janes").onchange = function () {
                onDeleteSelect()
            };

            document.getElementById("bigRedButton").onclick = function () {
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
                let defaultDelete = "Delete"
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

                for (var i = 0; i < data.length; i++) {
                    let dataSplit = data[i].toString().split(",")
                    if (dataSplit[0] === value) {
                        data.splice(i, 1);
                        localStorage.setItem('storedData', JSON.stringify(data));

                    }
                }

                let deleted = document.getElementById("You're_welcome_Janes")
                let selected = document.getElementById("You're_welcome_Boris")
                let defaultDelete = "Delete"
                let defaultSelect = "Select"
                data.sort(function (a, b) {return b[1] - a[1]})
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
                const optSSelect = document.querySelector("#resentsSelect");
                const optSFav = document.querySelector("#favSelect")
                for (var i = 0; i < data.length; i++) {
                    let dataSplit = data[i].toString().split(",")
                    let value = parseInt(dataSplit[1]);
                    if (value <= 5) {
                        let dataSplit = data[i].toString().split(",")
                        dataSplit.sort(function (a, b) {return a[1] - b[1]})
                        option = document.createElement("option");
                        option.value = dataSplit[0];
                        option.text = dataSplit[0];
                        option.id = "select"
                        optSSelect.appendChild(option)
                    }
                    if (value > 5) {
                        let dataSplit = data[i].toString().split(",")
                        dataSplit.sort(function (a, b) {return a[1] - b[1]})
                        option = document.createElement("option");
                        option.value = dataSplit[0];
                        option.text = dataSplit[0];
                        option.id = "select"
                        optSFav.appendChild(option)
                    }
                }

                const optDSelect = document.querySelector("#resentsDelete");
                const optDFav = document.querySelector("#favDelete")
                for (var i = 0; i < data.length; i++) {
                    let dataSplit = data[i].toString().split(",")
                    let value = parseInt(dataSplit[1]);
                    if (value <= 5) {
                        let dataSplit = data[i].toString().split(",")
                        dataSplit.sort(function (a, b) {return a[1] - b[1]})
                        option = document.createElement("option");
                        option.value = dataSplit[0];
                        option.text = dataSplit[0];
                        option.id = "delete"
                        optDSelect.appendChild(option)
                    }
                    if (value > 5) {
                        let dataSplit = data[i].toString().split(",")
                        dataSplit.sort(function (a, b) {return a[1] - b[1]})
                        option = document.createElement("option");
                        option.value = dataSplit[0];
                        option.text = dataSplit[0];
                        option.id = "delete"
                        optDFav.appendChild(option)
                    }
                }
            }

            function createSelectFields() {
                for (var i = 0; data.length - 1 > i; i++) {
                    document.getElementById("select").remove();
                }
                const optSelect = document.querySelector("#resentsSelect");
                const optFav = document.querySelector("#favSelect")
                data.sort(function (a, b) {return b[1] - a[1]})
                for (var i = 0; i < data.length; i++) {
                    let dataSplit = data[i].toString().split(",")
                    dataSplit.sort(function (a, b) {return a[1] - b[1]})
                    let value = parseInt(dataSplit[1]);
                    if (value <= 5) {
                        let dataSplit = data[i].toString().split(",")
                        option = document.createElement("option");
                        option.value = dataSplit[0];
                        option.text = dataSplit[0];
                        option.id = "select"
                        optSelect.appendChild(option)
                    }
                    if (value > 5) {
                        let dataSplit = data[i].toString().split(",")
                        option = document.createElement("option");
                        option.value = dataSplit[0];
                        option.text = dataSplit[0];
                        option.id = "select"
                        optFav.appendChild(option)
                    }
                }
            }

            function createDeleteFields() {
                for (var i = 0; data.length - 1 > i; i++) {
                    document.getElementById("delete").remove();
                }
                data.sort(function (a, b) {return b[1] - a[1]})
                const optSelect = document.querySelector("#resentsDelete");
                const optFav = document.querySelector("#favDelete")
                for (var i = 0; i < data.length; i++) {
                    let dataSplit = data[i].toString().split(",")
                    dataSplit.sort(function (a, b) {return a[1] - b[1]})
                    let value = parseInt(dataSplit[1]);
                    if (value <= 5) {
                        let dataSplit = data[i].toString().split(",")
                        option = document.createElement("option");
                        option.value = dataSplit[0];
                        option.text = dataSplit[0];
                        option.id = "delete"
                        optSelect.appendChild(option)
                    }
                    if (value > 5) {
                        let dataSplit = data[i].toString().split(",")
                        option = document.createElement("option");
                        option.value = dataSplit[0];
                        option.text = dataSplit[0];
                        option.id = "delete"
                        optFav.appendChild(option)
                    }
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

    var favGroup = document.createElement("optgroup");
    favGroup.setAttribute("label", "favorites")
    favGroup.textContent = "favorites";
    favGroup.id = "favSelect"
    select.appendChild(favGroup);

    data.sort(function (a, b) {return b[1] - a[1]})
    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",");
        dataSplit.sort(function (a, b) {return a - b})
        console.log(dataSplit);
        let value = parseInt(dataSplit[1]);
        if (value > 5) {
            let dataSplit = data[i].toString().split(",")
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "select"
            favGroup.appendChild(option) ;
        }
    }

    var recentGroup = document.createElement("optgroup");
    recentGroup.setAttribute("label", "resents")
    recentGroup.textContent = "resents";
    recentGroup.id = "resentsSelect"
    select.appendChild(recentGroup);


    var option = document.createElement("option");
    option.setAttribute("selected", "");
    option.setAttribute("disabled", "");
    option.text = "Select";

    recentGroup.appendChild(option);

    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",")
        dataSplit.sort(function (a, b) {return a[1] - b[1]})
        let value = parseInt(dataSplit[1]);
        if (value <= 5) {
            let dataSplit = data[i].toString().split(",")
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "select"
            select.appendChild(option);
        }
    }
    return select
}

function bigRedButton() {
    var button = document.createElement("button");
    button.innerHTML = "Delete all";
    button.name = "delete";
    button.id = "bigRedButton";

    return button
}

function deleteValue(data) {
    var deleteSelect = document.createElement("select");
    deleteSelect.id = "You're_welcome_Janes";

    var favGroup = document.createElement("optgroup");
    favGroup.setAttribute("label", "favorites")
    favGroup.textContent = "favorites";
    favGroup.id = "favDelete"
    deleteSelect.appendChild(favGroup);
    data.sort(function (a, b) {return b[1] - a[1]})

    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",")
        dataSplit.sort(function (a, b) {return a[1] - b[1]})
        let value = parseInt(dataSplit[1]);
        if (value > 5) {
            let dataSplit = data[i].toString().split(",")
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "delete"
            favGroup.appendChild(option) ;
        }
    }

    var recentGroup = document.createElement("optgroup");
    recentGroup.setAttribute("label", "resents")
    recentGroup.textContent = "resents";
    recentGroup.id = "resentsDelete"
    deleteSelect.appendChild(recentGroup);


    var option = document.createElement("option");
    option.setAttribute("selected", "");
    option.setAttribute("disabled", "");
    option.text = "Delete";

    recentGroup.appendChild(option);

    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",")
        dataSplit.sort(function (a, b) {return a[1] - b[1]})
        let value = parseInt(dataSplit[1]);
        if (value <= 5) {
            let dataSplit = data[i].toString().split(",")
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "delete"
            deleteSelect.appendChild(option);
        }
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
