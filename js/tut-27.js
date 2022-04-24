//tut-22 and 28 are NOTES building exercise do it in free time.
//OBJECTS, LITERALS AND OOP

// this is an object literal
let car = {
  name: "first car",
  topSpeed: 190,
  run: () => {
    console.log(`this is my car.`);
  },
};

//create a constructor function
function createMyCar(givenName, givenSpeed) {
  console.log(this);
  this.name = givenName;
  this.topSpeed = givenSpeed;
  this.run = function () {
    console.log(`${this.name} is my car`);
  };
}

//we can create objects of this constructor nd in return we will get objects!
car1 = new createMyCar("Alto", 120);
console.log(car1);


//overriding object prototype
createMyCar.prototype.getName = function (){
  return this.name;
}

createMyCar.prototype.setName = function (newName){
this.name = newName;
}

let car2 = new createMyCar("Rohan Das");
console.log(car2);