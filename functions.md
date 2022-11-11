# Functions

## document.getElementsByClassName("multilineInput-textArea").TSTimesheetLineWeek_ExternalComments.onchange
This function is activated when something changed in the Textbox. Then the value is checked if its empty. If not then its checked if it has spaces in front and at the end of the value and gets removed. Then it gets checked if the value is already existing in the Array if not it gets saved in the localstorage and the dropdowns will be re-rendered.

## document.getElementById("bigRedButton").onclick
When clicked on this button all the data in the localstorge will be deleted. And the dropdowns re-rendered.

## onDelete()
Deletes the selected value.

## waitForElm(selector)
Waits until the element appears. So that the script knows when to execute.

## creteDropdown(data)
Creates the select dropdown with the data from the localstorage. The values which got clicked more than five times. Will appear in the favorites section of the dropdown.

## bigRedButton()
creates the delete all button.

## deleteValue(data)
Creates the dropdown for the data that should be deleted.

## getValue()
Gets the value from the Textbox.

## onDeleteSelect()
Gets the value that should be deleted.
