// const Gpio = require('onoff').Gpio;
import { Gpio } from "onoff";
const led = new Gpio(17, "out");
const doorStatus = new Gpio(23, "in");

// setInterval(() => {
//   // doorStatus.readSync((err, value) => {
//   //     led.writeSync(value);
//   //     console.log(value)
//   // })

//   const status = doorStatus.readSync();
//   led.writeSync(status);
// }, 100);

doorStatus.watch((error, value) => {
  console.table({ error, value });

  led.writeSync(value);
});

process.on("SIGINT", (_) => {
  led.unexport();
  doorStatus.unexport();
});
