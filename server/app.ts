import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import removeTrailingSlashes from 'koa-remove-trailing-slashes';
import serve from 'koa-static';
import cors from 'koa2-cors';
import { DataClient } from '../data';
import buildRouter from './router';

export function buildApp(data: DataClient): Koa {
  const app = new Koa()
  const router = buildRouter(data)

  app
    .use(cors({
      origin: process.env.NODE_ENV === 'development'
        ? '*'
        : (ctx => ctx.origin)
    }))
    .use(removeTrailingSlashes())
    .use(bodyParser())
    .use(json({ pretty: false, param: 'pretty' }))
    .use(serve('dist'))
    .use(router.middleware())

  return app
}

export default buildApp
