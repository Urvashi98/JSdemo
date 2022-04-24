let string = 'mailto:%7B[C-EMAIL]%7D?subject=madhuri @gmail. com';

//extract mailto email text

let email;
if(string.includes('?')){
 email = string.substring(0, string.indexOf('?'));
}else {
    email = string;
}

let emailElement = document.getElementById('email');
emailElement.value = decodeURI(email)
console.log('email extracted', email);
console.log('decoded email', decodeURIComponent(email));

//extract subject if present
let subjectElement = document.getElementById('subject');
if(string.includes('?subject')){
    let subject = string.substring(string.indexOf('=')+1);   

    subjectElement.value = decodeURI(subject)
    console.log('subject line', subject);
    console.log('decoded subject', decodeURI(subject));
}else {

}

