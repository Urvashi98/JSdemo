// 17 & 18th tut

//17
document.getElementById("heading").addEventListener("click", function (e) {
  let vare;
  vare = e.target;
  vare = e.target.className;
  vare = e.target.classList; //returns DOM toekn list which can be converted to array
  vare = Array.from(vare);
  console.log(vare);
});

//18
var btn = document.getElementById("submit");
//btn.addEventListener("click");

const myclick = document.querySelector(".aside");
myclick.addEventListener("dblclick", function (e) {
  console.log("double clicked");
});

//mouse enter and leave - called one time for entering a section
var Nocomponent = document.getElementsByClassName('this');
console.log(Nocomponent); //className returns HTML element collectionof all tag with classname given
//added event to first component only
Nocomponent[0].addEventListener(
    'mouseenter', function(e) {
        console.log("mouse entered NO");
    }
)

//mouse over - called when enter a section or its child emelemtn
var form = document.querySelector('.form');
form.addEventListener("mouseover", function(e) {
    console.log("In the form element");
   // e.target.style.backgroundColor ="red";
})

//Exercise 1
var tags = document.getElementsByTagName('a');
Array.from(tags).forEach(element => {
    if(element.href.includes('text')){
        console.log("yes", element.text);
    }
});

