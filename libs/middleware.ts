import os from 'os';
import {NextFunction, Request, Response} from 'express';

export const Middleware = {
  isOriginAllowed: function (origin: string) {
    // TODO use environment variable to determine if development.
    let development = true;
    if (development) {
      // Allow local hostnames/IP addresses so you can make CORS requests from localhost and from
      // other hosts on the LAN (e.g. from visiting the SEAT on your phone).
      const allowedHostnames = ['localhost', '127.0.0.1', os.hostname()];
      if (allowedHostnames.some((hostname) => origin.startsWith(`http://${hostname}:`))) {
        return true;
      }
    }
    // TODO check if non development origin is allowed.
    // return allowedOrigins.has(origin);
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
