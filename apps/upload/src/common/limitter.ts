/*
 * Rate Limiter: Sliding Window
 *
 * if the previous_req_ts + T > current_req: check _instance in time_period
 * if the previous_req_ts + T < current_req: accept request & set previous_req_ts = current_req
 *
 * ref: https://github.com/AmanMulani/rate-limiter-node-typescript
 */

/*
 * => enforce granular access control:
 *       - user agent
 *       - ip addr
 *       - referrer
 *       - host
 *       - country
 *       - world region
 * => protect against credential stuffing & account takeover attacks
 * => limit the number of operation perfomed by individual clients
 * => protect REST APIs from resource exhaustion (DDoS attacks) or abuse
 * => protect GraphQL APIs
 *
 *   */

let _rateLimiter: unknown = { value: 0, timestamp: 0 };

export class RateLimiter {
   public value: number; // allowed req value
   public timestamp: number; // time in ms
   private _previousTimestamp: number;
   private _initialTimestamp: number;
   private _currentReq: number;

   protected constructor(config: Required<RateLimiterConfig>) {
      this.value = config.value;
      this.timestamp = config.timestamp;
      this._initialTimestamp = new Date().getTime();
      this._previousTimestamp = this._initialTimestamp;
      this._currentReq = config.value;
   }

   public getValue(): number {
      return this.value;
   }

   public static getInstance() {
      if (!_rateLimiter)
         throw new Error("Token Rate Limiter not initialized before");

      return _rateLimiter;
   }

   public decreaseLimitValue(): number {
      const time = new Date().getTime();
      if (time < this._previousTimestamp + this.timestamp) {
         if (this._currentReq >= 0) {
            console.log(this._currentReq);
            this._currentReq -= 1;
         }
      } else {
         const calculated =
            Math.floor(time - this._initialTimestamp) / this.timestamp;
         this._previousTimestamp =
            this._initialTimestamp + calculated * this.timestamp;
         console.log({
            previousRequestTimeStamp: this._previousTimestamp,
         });
         this._currentReq = this.value - 1;
      }

      return this._currentReq;
   }

   public static init({ value, timestamp }: RateLimiterConfig): RateLimiter {
      if (!_rateLimiter) {
         _rateLimiter = new RateLimiter({ value, timestamp });
      }

      return _rateLimiter as RateLimiter;
   }
}

export type RateLimiterConfig = {
   value: number; //number of requests allowed per unit time
   timestamp: number; //unit of time in milliseconds
};
