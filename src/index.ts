if (
    process.env.NEW_RELIC_ENABLED !== undefined &&
    process.env.NODE_ENV !== undefined &&
    process.env.NODE_ENV.match(/test/) === null
) {
    // tslint:disable-next-line:no-var-requires
    require('newrelic');
}

import * as config from 'config';
import { App } from './App';

const app = new App();

process.on('uncaughtException', (err: Error) => {
    console.log('uncaughtException', err);
    process.exit(1);
});

function uncaughtException(err: Error): void {
    console.log(err.message, null, ['uncaught', 'exception'], {stack: err.stack});
        process.exit(1);
}

process.on('uncaughtException', uncaughtException);

process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
    console.log(`Unhandled Rejection at: Promise', ${p}, reason: ${reason}`, null, ['unhandled', 'rejection']);
});

process.on('SIGTERM', () => {
    console.log('Received sigterm, gracefully shutting down the server', ['shutdown']);
});

try {
    const server = app.init();

    server.listen(config.get('app.port'), () => {
        console.log('OK');
        console.log(
            `Planning microservice server listening at ${server.url}`,
            ['start']
        );
    });
} catch (err) {
    console.log(
        `[FAILED] to start Planning microservice`,
        ['start', 'failed'],
        { stack: err.stack }
    );
}
