import { BinaryValue, Gpio } from "onoff";
import { BehaviorSubject, distinctUntilChanged, tap } from "rxjs";
const led = new Gpio(17, "out");
const doorStatus = new Gpio(23, "in");

const CHECK_TIME_INTERVAL = 1000;

const doorOpenedStatusSubject = new BehaviorSubject<BinaryValue>(0);

const iv = setInterval(() => {
  const status = doorStatus.readSync();
  doorOpenedStatusSubject.next(status);
}, CHECK_TIME_INTERVAL);

const doorStream = doorOpenedStatusSubject
  .pipe(
    distinctUntilChanged(),
    tap((value) => {
      led.writeSync(value);
    })
  )
  .subscribe((value) => console.log(`Door is ${value ? "open" : "closed"}`));

process.on("SIGINT", (_) => {
  led.unexport();
  doorStatus.unexport();
  doorStream?.unsubscribe();
  clearInterval(iv);
});
