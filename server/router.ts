import router, { Router } from 'koa-joi-router'
import _ from 'lodash'
import uuid from 'uuid/v4'
import { DataClient } from '../data'
import Bag from '../bag/Bag'
import * as koa from 'koa'

type RouterFactory = (data: DataClient) => Router

const addToBag = (data: DataClient) => async (ctx: koa.Context) => {
  const bagObj = await data.bag(ctx.params.id).get();
  if (!bagObj) {
    ctx.body = 404;
    return;
  }
  const request = ctx.request as koa.Request & {
    body: any;
  };
  const bag = Bag.fromJsonable(bagObj).add(request.body);
  data.bag(ctx.params.id).set(bag.toJsonable());
  ctx.redirect('../');
}

const getBag = (data: DataClient) => async (ctx: koa.Context) => {
  const bagObj = await data.bag(ctx.params.id).get();
  if (!bagObj) {
    ctx.body = 404;
    return;
  }
  ctx.body = bagObj;
}

const createBag = (data: DataClient) => async (ctx: koa.Context) => {
  const bagId = uuid();
  const bag = Bag.withContents();
  await data.bag(bagId).set(bag);
  ctx.body = { bagId, bag: bag.toJsonable() };
}

const drawFromBag = (data: DataClient) => async (ctx: koa.Context) => {
  const bagObj = await data.bag(ctx.params.id).get();
  if (!bagObj) {
    ctx.body = 404;
    return;
  }
  const [bag, item] = Bag.fromJsonable(bagObj).pull()
  data.bag(ctx.params.id).set(bag.toJsonable());
  ctx.body = item
}

const buildBagRouter: RouterFactory = (data) =>
  router()
    .post('/create', createBag(data))
    .get('/:id', getBag(data))
    .post('/:id/add', addToBag(data))
    .post('/:id/draw', drawFromBag(data))


export function buildRouter(data: DataClient) {
  const bagRouter = buildBagRouter(data)

  return router().use(
    '/bag',
    bagRouter.middleware(),
  )
}

export default buildRouter
