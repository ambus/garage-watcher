import { SMSAPI } from "smsapi";
import { environment } from "../../environments/environment";

export class NotificationService {
  private static instance: NotificationService;
  private smsapi: SMSAPI;

  private constructor() {
    this.smsapi = new SMSAPI(environment.oAuthToken);
  }

  static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async sendNotification(msg: string) {
    try {
      const result = await this.smsapi.sms.sendSms(
        environment.phoneNumber,
        msg
      );
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
