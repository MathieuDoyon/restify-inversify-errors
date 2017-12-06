import { AppLogger, Logger, LogLevel } from '@ssense/framework';
import { IConfig } from 'config';
import * as config from 'config'; // tslint:disable-line no-duplicate-imports
import { Container } from 'inversify';
import { TYPE } from 'inversify-restify-utils';
import 'reflect-metadata';
import { HomeController } from './controllers/HomeController';

const kernel = new Container();

// Bind utils
kernel.bind<IConfig>('config').toConstantValue(config);

const logger = new AppLogger(process.env.npm_package_name, config.get(
    'logger.level'
) as LogLevel);
logger.setPretty(process.env.NODE_ENV === 'development');
kernel.bind<Logger>('logger').toConstantValue(logger);

// Bind controllers
kernel
    .bind<HomeController>(TYPE.Controller)
    .to(HomeController)
    .whenTargetNamed('HomeController');

export { kernel };
