// CALLBACK FUNC N JS

let students = [
    { name: "xyz", sub: "ML" },
    { name: "pqr", sub: "AI" },
];

function enrollStudent(student) {
    setTimeout(function () {
        students.push(student);
    }, 5000);
}

function getStudents() {
    let str = "";
    setTimeout(function () {
        students.forEach(function (student) {
            str += `<li>Namen:${student.name} Subject: ${student.sub}</li>`;
        });
    document.getElementById('students').innerHTML = str;
    }, 1000);
}
let newStudent = {
    name:"urvashi",
    sub: "JS"
}
enrollStudent(newStudent);
getStudents();
