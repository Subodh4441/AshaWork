import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

/**
 * Angular SSR engine
 */
const angularApp = new AngularNodeAppEngine();

/**
 * Trust proxy.
 *
 * VS Code Dev Tunnel works as a reverse proxy and sends
 * forwarded headers such as:
 *
 * x-forwarded-host
 * x-forwarded-proto
 */
app.set('trust proxy', true);

/**
 * Serve static files.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests with Angular SSR.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch(next);
});

/**
 * Start server when running directly.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(
      `Node Express server listening on http://localhost:${port}`,
    );
  });
}

/**
 * Angular CLI / server handler.
 */
export const reqHandler = createNodeRequestHandler(app);
