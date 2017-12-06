import { AccessLogger, Logger } from '@ssense/framework';
import { IConfig } from 'config';
import { InversifyRestifyServer } from 'inversify-restify-utils';
import * as config from 'config';
import * as restify from 'restify';
// import { Next, Request, Response, Server } from 'restify'; // tslint:disable-line no-duplicate-imports
// import * as restifySwaggerJsdoc from 'restify-swagger-jsdoc';
import { kernel } from './Kernel';
// import knex from './storage/knex';

interface DocumentationOptions {
    enabled: string;
    endpoint: string;
    version: string;
}

export class App {
    private server: restify.Server;
    private controllers: {};
    private logger: Logger;
    private accessLogger: AccessLogger;

    constructor() {
        this.logger = kernel.get<Logger>('logger');
    }

    public init(): restify.Server {
        try {
            // initialize the server
            const config = kernel.get<IConfig>('config');
            const serverBuilder = new InversifyRestifyServer(kernel);
            const startRequestId = this.logger.generateRequestId();

            serverBuilder.setConfig((server: restify.Server) => {
                server.use((req: restify.Request, res: restify.Response, next: restify.Next) => {
                    // Add middleware to generate request id
                    req.xRequestId =
                        (req.headers['x-request-id'] as string) ||
                        this.logger.generateRequestId();

                    req.logger = this.logger.getRequestLogger(req.xRequestId);

                    next();
                });

                // Load middlewares
                server.pre(restify.pre.sanitizePath()); // Clean trailing slashes on routes
                // ... other pre and middleware here
            });

            this.server = serverBuilder.build();

            this.server.get(
                '/health',
                (
                    req: restify.Request,
                    res: restify.Response,
                    next: restify.Next
                ) => {
                    const memoryUsage: any = process.memoryUsage();
                    memoryUsage.heap_total = memoryUsage.heapTotal;
                    delete memoryUsage.heapTotal;
                    memoryUsage.heap_used = memoryUsage.heapUsed;
                    delete memoryUsage.heapUsed;

                    res.send(200, {
                        app_id: process.env.npm_package_name,
                        app_version: `v${process.env.npm_package_version}`,
                        cpu_usage: process.cpuUsage(),
                        environment: process.env.NODE_ENV,
                        memory_usage: memoryUsage,
                        node_version: process.version,
                        platform: process.platform,
                        uptime: process.uptime()
                    });
                    next();
                }
            );

            this.server.get(
                '/api',
                (
                    req: restify.Request,
                    res: restify.Response,
                    next: restify.Next
                ) => {
                    res.json({ routes: this.server.router.mounts });
                    next();
                }
            );

            return this.server;
        } catch (err) {
            throw err;
        }
    }

    public getServer(): restify.Server {
        return this.server;
    }
}
