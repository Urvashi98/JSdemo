// Editable div example
let styleDiv =
  "border: 2px solid black; height: 200px; width: 500px; margin:20px; padding: 20px;";
let styleTextArea =
  "border: 2px solid black; height: 1 00px; width: 300px; margin:20px; padding: 20px;";

let divElem = document.createElement("div");
let textNode;
let localStorageValue = localStorage.getItem("text");
if (localStorageValue == null) {
  textNode = document.createTextNode(
    "This is a div. Click text area to edit text."
  ); // a simple text in div
} else {
  textNode = document.createTextNode(localStorageValue);
}
divElem.appendChild(textNode); // add text to the div
divElem.setAttribute("class", "divElem");
divElem.setAttribute("style", styleDiv); //style

let heading = document.getElementById("heading");
heading.appendChild(divElem);

divElem.addEventListener("click", function () {
  let textAreaList = document.getElementsByClassName("textarea").length;
  if (textAreaList == 0) {
    let html = divElem.innerHTML;
    divElem.innerHTML = `<textarea class="textarea" id="textarea1" rows="3" style='${styleTextArea}'>${html}</textarea>`;
  }
  let textarea = document.getElementById("textarea1");
  textarea.addEventListener("blur", function () {
    divElem.innerHTML = textarea.value;
    localStorage.setItem("text", textarea.value);
  });
});
