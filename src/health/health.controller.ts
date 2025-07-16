import { DateTime, Duration } from 'luxon';
import { controller, httpGet, interfaces } from 'inversify-express-utils';

@controller('/health')
export class HealthController implements interfaces.Controller {
  @httpGet('/')
  public healthCheck() {
    const {
      days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0
    } = Duration.fromObject({ seconds: process.uptime() })
      .shiftTo('days', 'hours', 'minutes', 'seconds')
      .toObject();

    return {
      status: 'OK',
      uptime: `${days}d ${hours}h ${minutes}m ${Math.floor(seconds)}s`,
      timestamp: DateTime.now().toFormat('dd/MM/yyyy HH:mm:ss')
    };
  }
}