import * as koa from 'koa'
import router, { Router } from 'koa-joi-router'
import uuid from 'uuid/v4'
import Bag from '../bag/Bag'
import {
  AddResponse,
  CreateResponse,
  GetResponse,
  ItemResponse,
} from '../contract'
import { DataClient } from '../data'

type RouterFactory = (data: DataClient) => Router

const addToBag = (data: DataClient) => async (ctx: koa.Context) =>
  data.withLockOnBag(ctx.params.id, async bagAccessor => {
    const bagObj = await bagAccessor.get()
    if (!bagObj) {
      return
    }

    const request = ctx.request as koa.Request & {
      body: any
    }
    const bag = Bag.fromJsonable(bagObj)
    const newBag = (Array.isArray(request.body) ? bag.addMultiple : bag.add)(request.body)
    const newBagObj = newBag.toJsonable()
    await bagAccessor.set(newBagObj)
    ctx.body = newBagObj as AddResponse<any>
  })

const getBag = (data: DataClient) => async (ctx: koa.Context) =>
  data.withLockOnBag(ctx.params.id, async bagAccessor => {
    const bagObj = await bagAccessor.get()
    if (!bagObj) {
      return
    }

    ctx.body = bagObj as GetResponse<any>
  })

const createBag = (data: DataClient) => async (ctx: koa.Context) => {
  const bagId = uuid()
  const bag = Bag.withContents()
  await data.withLockOnBag(bagId, async bagAccessor => {
    await bagAccessor.set(bag)
  })
  ctx.body = { bagId, bag: bag.toJsonable() } as CreateResponse<any>
}

const drawFromBag = (data: DataClient) => async (ctx: koa.Context) =>
  data.withLockOnBag(ctx.params.id, async bagAccessor => {
    const bagObj = await bagAccessor.get()
    if (!bagObj) {
      return
    }

    const [bag, item] = Bag.fromJsonable(bagObj).pull()
    bagAccessor.set(bag.toJsonable())
    ctx.body = { item, bag } as ItemResponse<typeof item>
  })

const buildBagRouter: RouterFactory = (data) =>
  router()
    .post('/create', createBag(data))
    .get('/:id', getBag(data))
    .post('/:id/add', addToBag(data))
    .post('/:id/draw', drawFromBag(data))

export function buildRouter(data: DataClient) {
  const bagRouter = buildBagRouter(data)

  return router().use('/bag', bagRouter.middleware())
}

export default buildRouter
