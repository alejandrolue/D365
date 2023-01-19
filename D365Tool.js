// ==UserScript==
// @name        D365 Script Merkle
// @namespace   Violentmonkey Scripts
// @match       https://dand365prod.operations.dynamics.com/*
// @grant       none
// @version     1.3
// @author      Alejandro Lüthi
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @require http://userscripts-mirror.org/scripts/source/107941.user.js
// @grant GM_setValue
// @grant GM_getValue
// @description 14/09/2022, 14:34:12
// ==/UserScript==

$(document).ready(function () {
    waitForElm(".multilineInput-textArea").then((elm) => {
        const state = localStorage.getItem('storedData');
        let data = [];
        if (state) {
            data = [...JSON.parse(state)];
        } else {
            console.log("empty")
        }

        console.log("test");

        elementsCreation(data);

        document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.onchange = function () {
            getValue();
        }

        document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.onchange = function () {
            validateValue(data)
        }

        document.getElementById("selectDropdown").onchange = function () {
            onSelect(data);
            $("#selectDropdown").on('blur', (e) => (e.target.value = 'Select'));
            $("#deleteDropdown").on('blur', (e) => (e.target.value = 'Delete'));
        }

        document.getElementById("deleteDropdown").onchange = function () {
            onDelete(data);
            $("#deleteDropdown").on('blur', (e) => (e.target.value = 'Delete'));
            $("#selectDropdown").on('blur', (e) => (e.target.value = 'Select'));
        }

        document.getElementById("deleteAll").onclick = function () {
            deleteAll(data)
        }
    })

    waitForElm(".toggle-box").then((elm) => {
        const id = document.getElementsByClassName("toggle-box")[0].id;
        document.getElementById(id).click();
    })
})

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

function elementsCreation(data) {
    document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.after(createSelectDropdown(data));
    document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.after(createDeleteDropdown(data));
    document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.after(createDeleteAllButton())
}

function createSelectDropdown(data) {
    var select = document.createElement("select");
    select.id = "selectDropdown";

    var favGroup = document.createElement("optgroup");
    favGroup.setAttribute("label", "favorites")
    favGroup.textContent = "favorites";
    favGroup.id = "favSelect"
    select.appendChild(favGroup);

    data.sort(function (a, b) {
        return b[1] - a[1]
    })
    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",");
        dataSplit.sort(function (a, b) {
            return a - b
        })
        console.log(dataSplit);
        let value = parseInt(dataSplit[1]);
        if (value > 5) {
            let dataSplit = data[i].toString().split(",")
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "Select"
            favGroup.appendChild(option);
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
        dataSplit.sort(function (a, b) {
            return a[1] - b[1]
        })
        let value = parseInt(dataSplit[1]);
        if (value <= 5) {
            let dataSplit = data[i].toString().split(",")
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "Select"
            select.appendChild(option);
        }
    }
    return select
}

function createDeleteDropdown(data) {
    var deleteSelect = document.createElement("select");
    deleteSelect.id = "deleteDropdown";

    var favGroup = document.createElement("optgroup");
    favGroup.setAttribute("label", "favorites")
    favGroup.textContent = "favorites";
    favGroup.id = "favDelete"
    deleteSelect.appendChild(favGroup);
    data.sort(function (a, b) {
        return b[1] - a[1]
    })

    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",")
        dataSplit.sort(function (a, b) {
            return a[1] - b[1]
        })
        let value = parseInt(dataSplit[1]);
        if (value > 5) {
            let dataSplit = data[i].toString().split(",")
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "Delete"
            favGroup.appendChild(option);
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
        dataSplit.sort(function (a, b) {
            return a[1] - b[1]
        })
        let value = parseInt(dataSplit[1]);
        if (value <= 5) {
            let dataSplit = data[i].toString().split(",")
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "Delete"
            deleteSelect.appendChild(option);
        }
    }
    return deleteSelect;
}

function createDeleteAllButton() {
    var button = document.createElement("button");
    button.innerHTML = "Delete all";
    button.name = "delete";
    button.id = "deleteAll";

    return button
}

function getValue() {
    return document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.value
}

function onSelect(data) {
    document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.value = document.getElementById("selectDropdown").value;
    const trigger = (el, etype, custom) => {
        const evt = custom ?? new Event(etype, {bubbles: true})
        el.dispatchEvent(evt);
    }
    trigger(document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments, 'change');
    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",")
        if (dataSplit[0] === getValue()) {
            let levelUp = parseInt(dataSplit[1]) + 1;
            data[i] = [dataSplit[0], levelUp];
            localStorage.setItem('storedData', JSON.stringify(data));
        }
    }
}

function onDelete(data) {
    let value = document.getElementById("deleteDropdown").value;
    console.log(value);
    console.log(data[0])
    for (var i = 0; i < data.length; i++) {
        if (data[i][0] === value) {
            data.splice(i, 1);
            console.log(data)
            localStorage.setItem('storedData', JSON.stringify(data));
            console.log(data);
        }
    }
    renderOptions(data)
    return data;
}

function renderOptions(data) {
    let value = document.getElementById("deleteDropdown").value;
    for (var i = 0; data.length >= i; i++) {
        console.log(i + "select")
        if(document.getElementById("Select") !== null) {
            document.getElementById("Select").remove();
        }
    }
    for (var i = 0; data.length >= i; i++) {
        console.log(i + "delete")
        if(document.getElementById("Delete") !== null) {
            document.getElementById("Delete").remove();
        }
    }

    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",")
        if (dataSplit[0] === value) {
            data.splice(i, 1);
            localStorage.setItem('storedData', JSON.stringify(data));

        }
    }

    let deleted = document.getElementById("deleteDropdown")
    let selected = document.getElementById("selectDropdown")
    let defaultDelete = "Delete"
    let defaultSelect = "Select"
    data.sort(function (a, b) {
        return b[1] - a[1]
    })
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
    //TODO: If there are only numbers in the string it also shown in the favorites tab. Needs fix
    for (var i = 0; i < data.length; i++) {
        let dataSplit = data[i].toString().split(",")
        let value = parseInt(dataSplit[1]);
        if (value <= 5) {
            let dataSplit = data[i].toString().split(",")
            dataSplit.sort(function (a, b) {
                return a[1] - b[1]
            })
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "Select"
            optSSelect.appendChild(option)
        }
        if (value > 5) {
            let dataSplit = data[i].toString().split(",")
            dataSplit.sort(function (a, b) {
                return a[1] - b[1]
            })
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "Select"
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
            dataSplit.sort(function (a, b) {
                return a[1] - b[1]
            })
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "Delete"
            optDSelect.appendChild(option)
        }
        if (value > 5) {
            let dataSplit = data[i].toString().split(",")
            dataSplit.sort(function (a, b) {
                return a[1] - b[1]
            })
            option = document.createElement("option");
            option.value = dataSplit[0];
            option.text = dataSplit[0];
            option.id = "Delete"
            optDFav.appendChild(option)
        }
    }
}

function deleteAll(data) {
    if (data.length !== 0) {
        console.log("empty")
    } else {
        for (var i = 0; data.length > i; i++) {
            document.getElementById("Select").remove();
            document.getElementById("Delete").remove();
        }
    }

    for (var i = 0; i < data.length; i++) {
        data.splice(i, 1);
        i--;
    }
    localStorage.setItem('storedData', JSON.stringify(data));
    let deleted = document.getElementById("deleteDropdown")
    let selected = document.getElementById("selectDropdown")
    let defaultDelete = "Delete"
    let defaultSelect = "Select"
    for (var i, j = 0; i = deleted.options[j] - 1; j++) {
        if (i.value == defaultDelete) {
            deleted.selectedIndex = j;
            break;
        }
    }

    for (var i, j = 0; i = selected.options[j] - 1; j++) {
        if (i.value == defaultSelect) {
            selected.selectedIndex = j;
            break;
        }
    }
    return data;
}

function validateValue(data) {
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
            data.sort(function (a, b) {
                return a[1] - b[1]
            })
            if (data.length > 11) {
                for (var i = 0; i < data.length; i++) {
                    let dataSplit = data[i].toString().split(",")
                    dataSplit.sort(function (a, b) {
                        return b[1] - a[1]
                    })
                    if (dataSplit[1] < 5) {
                        data.splice(i, 1);
                        break;
                    }
                }
                localStorage.setItem('storedData', JSON.stringify(data));
                //renderSelectFields(data);
                renderOptions(data);
            } else {
                localStorage.setItem('storedData', JSON.stringify(data));
                //renderSelectFields(data);
                renderOptions(data);
            }
        }
        matches = false;
    }
}


