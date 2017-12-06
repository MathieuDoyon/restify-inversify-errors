import { AccessLogger, Logger } from '@ssense/framework';
import { IConfig } from 'config';
import { InversifyRestifyServer } from 'inversify-restify-utils';
import * as config from 'config';
import * as restify from 'restify';

interface DocumentationOptions {
    enabled: string;
    endpoint: string;
    version: string;
}

export class App {
    private server: restify.Server;

    public init(): restify.Server {
        try {
            this.server = restify.createServer();
            this.server.use(restify.plugins.queryParser({ mapParams: false }));

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
