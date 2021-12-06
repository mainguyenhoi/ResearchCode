//Create a function that takes an array of numbers and return "Boom!" if the digit 7 appears in the array.
// Otherwise, return "there is no 7 in the array".
const sevenBoom = (...arg) => {
    let boom = false;
    arg.forEach(element => {
        element
        if (element === 7) {
            boom = true;
            throw new Exception("Time to end the loop");
        }
        let temp = String(element);
        if (temp.search('7') > 0)
            boom = true;
    });
    return boom;

}
const boom = sevenBoom(1, 2, 3, 4, 5, 6, 55575555, 8, 9, 9, 9, 98, 8, 8);
console.log(boom === true ? 'Boom!!!' : 'array do not have number 7');