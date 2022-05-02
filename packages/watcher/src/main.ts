import { BinaryValue, Gpio } from "onoff";
import { distinctUntilChanged, tap, interval, map } from "rxjs";
import { NotificationService } from "./app/notification/notification.service";

const led = new Gpio(17, "out");
const doorStatus = new Gpio(23, "in");

const CHECK_TIME_INTERVAL = 1000;
const intervalSource = interval(CHECK_TIME_INTERVAL);
let doorCurrentStatus: BinaryValue;
const notificationService = NotificationService.getInstance();

const doorStream = intervalSource
  .pipe(
    map<number, BinaryValue>((_) => {
      return doorStatus.readSync();
    }),
    distinctUntilChanged(),
    tap((value) => {
      doorCurrentStatus = value;
    }),
    tap((value) => {
      led.writeSync(value);
    })
  )
  .subscribe(async (value) => {
    const msg = `Door is ${value ? "open" : "closed"}`;
    console.log(msg);
    notificationService.sendNotification(msg);
  });

process.on("SIGINT", (_) => {
  led.unexport();
  doorStatus.unexport();
  doorStream?.unsubscribe();
});
