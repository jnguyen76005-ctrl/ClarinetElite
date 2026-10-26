// means:

// Start with the default button style.
// If pressed, add the pressed style.
// Finally, apply any styles the user passed in.
// If two styles set the same property, the later one wins. 


// style={...}
// The {} mean:
// "Everything insde here is JavaScript"

// So React will evaluate whatever is inside 

// inside those braces you have
// ({ pressed }) => { 
//          ...
//     }
//This is an arrow function

// Think of it like writong:
// function something(parameter) {
    //              ...
//        }
//
// {pressed}
// "Take the pressed property from the object and create a variable named pressed."
// Object destructuring 
// "Give me just this property from the object."

//{
    //first: "apple",
    //second: "banana",
    //third: "orange"
//}

//[
    //"apple",
    //"banana",
    //"orange"
//]

// what is a callback function?
// Answer: A function you give to someone else so THEY can call it later
// Whenever someone gives us a tabBarIcon callback, we'll call it with an object that contains focused, color, size. That's part of the component's (Application Proframming Interface)

// Objects store key-value pairs
// like this:
// const myObject = {
//     first: "apple",
//     second: "banana",
//     third: "orange"
// }
// condition ? valueIfTrue : valueIfFalse

// constructor(){
// automatically gives back the new object}

// someMethod(){
// does NOT automatically return the object so it needs a return statement

//    constructor(horsepower){
 //       this.horsepower = horsepower
 //   }

 //    constructor(500){
//        this.horsepower = 500
 //   }
//once the constructor is called with new Car(500), the new object will have a horsepower property with a value of 500 meaning the horsepower was just a variable and now that x variable is now just 500 meaning when you try to extract horsepower later in the code whether 
// whether you call a method or create a method in the class you use this.horsepower to get the value of 500. The this keyword is a reference to the object that is being created.

// {} = make an object
// [] = can make an array OR access something by a key/index
