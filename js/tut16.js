// creating removing and replacing elements in js
//link - https://www.youtube.com/watch?v=MeCPwvMQZ9o&list=PLu0W_9lII9ajyk081To1Cbt2eI5913SsL&index=17

console.log("in tutu16");
let li = document.createElement('li')
li.className = 'childul';
li.setAttribute('style','color:red;');
li.innerText = "New li via js";

//capture ul to append li
let ul = document.querySelector('ul.this');
ul.appendChild(li)
console.log(ul);
console.log(li);

//replace eelement
let elem2 = document.createElement('h2');
elem2.innerText = "hii this is replacement element";

li.replaceWith(elem2);