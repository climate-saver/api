import os from 'os';
import {NextFunction, Request, Response} from 'express';

// Allow cross-origin requests from the admin, provider, et al.
// In development, also allow requests from the local hostname, e.g. mycomputer.local.
const allowedHosts = [process.env.WEB_URL];
const allowedOrigins = new Set(
  allowedHosts.map((hostname) => process.env.API_PROTOCOL! + hostname)
);

export const Middleware = {
  isOriginAllowed: function (origin: string) {
    if (process.env.ENVIRONMENT === 'Development') {
      // Allow local hostnames/IP addresses so you can make CORS requests from localhost and from
      // other hosts on the LAN (e.g. from visiting the SEAT on your phone).
      const allowedHostnames = ['localhost', '127.0.0.1', os.hostname()];
      return allowedHostnames.some((hostname) => origin.startsWith(`http://${hostname}:`));
    }
    // Only allow the configured hosts.
    return allowedOrigins.has(origin);
  },

  /** Add CORS headers to responses. */
  addAllowCrossDomainHeaders: function (req: Request, res: Response, next: NextFunction) {
    if (req.headers.origin && Middleware.isOriginAllowed(req.headers.origin)) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // Allow remembering the success of a preflight request for 10 minutes.
    res.header('Access-Control-Max-Age', '600');
    next();
  },
};
