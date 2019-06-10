import * as _ from 'lodash'
import Koa from 'koa'
import Router from 'koa-router'
import { createHandyClient } from 'handy-redis'

const redisKey = {
  serverStart: 'server-start',
}

const db = createHandyClient()

const app = new Koa()
const router = new Router()

db.set(redisKey.serverStart, new Date().valueOf().toString())

router.get('/', (ctx) => (ctx.body = 'Hello world'))

app.use(router.routes()).use(router.allowedMethods)

app.listen(3000, async () => {
  const startMillis = await db.get(redisKey.serverStart)
  console.log(
    'server up',
    startMillis && new Date(Number.parseInt(startMillis))
  )
})
