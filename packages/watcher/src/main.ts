import { BinaryValue, Gpio } from "onoff";
import { BehaviorSubject, distinctUntilChanged, tap } from "rxjs";
const led = new Gpio(17, "out");
const doorStatus = new Gpio(23, "in");

const CHECK_TIME_INTERVAL = 1000;

const doorOpenedStatusSubject = new BehaviorSubject<BinaryValue>(0);

setInterval(() => {
  const status = doorStatus.readSync();
  doorOpenedStatusSubject.next(status);
}, CHECK_TIME_INTERVAL);

doorOpenedStatusSubject
  .pipe(
    distinctUntilChanged(),
    tap((value) => {
      console.log("New value", value);
      led.writeSync(value);
    })
  )
  .subscribe((value) => console.warn(value));

process.on("SIGINT", (_) => {
  led.unexport();
  doorStatus.unexport();
});
