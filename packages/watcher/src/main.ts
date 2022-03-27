const Gpio = require('onoff').Gpio;
const led = new Gpio(17, 'out');

console.log('Hello World!');

let myStatus = false;

setInterval(() => {
 led.writeSync(myStatus ? 1 : 0);
 myStatus = !myStatus;
}, 500)
