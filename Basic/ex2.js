//1. Write a JavaScript program to display the current day and time in the following format
const currentTime = new Date();
const day =['Sunday','Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday'];
console.log("Today is:", day[currentTime.getDay()]);
console.log("Current time is: ", currentTime.getHours() > 12 ? currentTime.getHours()%12 +' PM' : currentTime.getHours() +'AM :', currentTime.getMinutes() +':'+ currentTime.getSeconds());