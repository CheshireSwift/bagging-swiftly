import Router from 'koa-router'
import _ from 'lodash'
import uuid from 'uuid/v4'
import { DataClient } from '../data'
import Bag from '../bag/Bag'
import koa = require('koa')

type RouterFactory = (data: DataClient) => Router

function addIndex(router: Router) {
  return router.get('/', (ctx) => {
    ctx.body =
      '<html><body><ul>' +
      _(router.stack)
        .map('path')
        .map((path) => `<li><a href=".${path}">${path}</a></li>`)
        .join('') +
      '</ul></body></html>'
  })
}

const buildBagRouter: RouterFactory = (data) =>
  addIndex(
    new Router()
      .post('/create', async (ctx) => {
        const bagId = uuid()
        const bag = Bag.withContents()
        await data.bag(bagId).set(bag)
        ctx.body = { bagId, bag: bag.toJsonable() }
      })
      .get('/:id', async (ctx) => {
        const bagObj = await data.bag(ctx.params.id).get()
        if (!bagObj) {
          ctx.body = 404
          return
        }

        ctx.body = bagObj
      })
      .post('/:id/add', async (ctx) => {
        const bagObj = await data.bag(ctx.params.id).get()
        if (!bagObj) {
          ctx.body = 404
          return
        }

        const request = ctx.request as koa.Request & { body: any }
        const bag = Bag.fromJsonable(bagObj).add(request.body)
        data.bag(ctx.params.id).set(bag.toJsonable())
        ctx.redirect('../')
      })
  )

export function buildRouter(data: DataClient): Router {
  const bagRouter = buildBagRouter(data)

  return new Router().use(
    '/bag',
    bagRouter.routes(),
    bagRouter.allowedMethods()
  )
}

export default buildRouter
