//Create a function that takes a number as an argument. Add up all the numbers from 1 to the number you passed to the function.
// For example, if the input is 4 then your function should return 10 because 1 + 2 + 3 + 4 = 10.
const addUp = (arg) =>{
    let i;
    let sum = 0;
    for(i=1; i<= arg ; i++){
        sum = sum + i;
    }
    return sum;
}
console.log('sum is: ', addUp(600));