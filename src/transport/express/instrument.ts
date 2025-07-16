import * as Sentry from "@sentry/node";

import { envVariables } from "@src/config";

Sentry.init({
    dsn: envVariables.SENTRY_DSN,
    tracesSampleRate: 1.0,
    sendDefaultPii: true,
});
