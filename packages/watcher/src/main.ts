import { BinaryValue, Gpio, Low } from "onoff";
import { BehaviorSubject, tap, debounceTime , distinctUntilChanged } from "rxjs";
const led = new Gpio(17, "out");
const doorStatus = new Gpio(23, "in");

const doorAreOpenSubject = new BehaviorSubject<BinaryValue>(0);

//TODO add observable do któgo bedzie przekazywany strumień z informacją o statusie
// następnie dodać pipa w którym będzie debouncer (spowoduje to zredukowanie szumów)
// wysyłanie komunikatów dopiero gdy brama bedzie otwarta przez 5 s

setInterval(() => {
  const status = doorStatus.readSync();
  doorAreOpenSubject.next(status);
  // led.writeSync(status);
}, 100);

doorAreOpenSubject
  .pipe(distinctUntilChanged(), debounceTime(1000),  tap((value) => {console.log('New value', value); led.writeSync(value)}))
  .subscribe((value) => console.warn(value));
process.on("SIGINT", (_) => {
  led.unexport();
  doorStatus.unexport();
});
