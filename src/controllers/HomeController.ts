import { IConfig } from 'config';
import { inject, injectable, named } from 'inversify';
import { Controller, Get } from 'inversify-restify-utils';
import { Request, Response } from 'restify';

@injectable()
@Controller('/welcome')
export class HomeController {
    constructor(
        @inject('config') protected config: IConfig
    ) {
    }

    /**
     * Welcome
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    @Get('/')
    async welcome(req: Request, res: Response, next: Function) {
        try {
            res.setHeader('content-type', 'text/plain');
            res.send(
                "When the seagulls follow the trawler, it's because they think sardines will be thrown into the sea.",
            );
            return next();
        } catch (err) {
            return next(err);
        }
    }
}
