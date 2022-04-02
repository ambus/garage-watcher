const Gpio = require('onoff').Gpio;
const led = new Gpio(17, 'out');
const doorStatus = new Gpio(23, 'in');

setInterval(() => {
    // doorStatus.readSync((err, value) => {
    //     led.writeSync(value);
    //     console.log(value)
    // })

    const status = doorStatus.readSync();
    led.writeSync(status);
}, 100);

process.on('SIGINT', _ => {
    led.unexport();
    doorStatus.unexport();
})