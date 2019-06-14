import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import removeTrailingSlashes from 'koa-remove-trailing-slashes';
import buildRouter from './router';
import { DataClient } from '../data';

export function buildApp(data: DataClient): Koa {
  const app = new Koa()
  const router = buildRouter(data)

  app
    .use(removeTrailingSlashes())
    .use(bodyParser())
    .use(json({ pretty: false, param: 'pretty' }))
    .use(router.middleware())

  return app
}

export default buildApp