import Koa from 'koa'
import json from 'koa-json'
import removeTrailingSlashes from 'koa-remove-trailing-slashes'
import bodyParser from 'koa-bodyparser'
import { createHandyClient } from 'handy-redis'
import { createClient } from './data'
import buildRouter from './server/router'

const port = process.env.BAGGING_SWIFTLY_PORT || 3000
const app = new Koa()
const data = createClient(createHandyClient())
const router = buildRouter(data)

data.startTime.set(new Date())

app
  .use(removeTrailingSlashes())
  .use(bodyParser())
  .use(json({ pretty: false, param: 'pretty' }))
  .use(router.routes())
  .use(router.allowedMethods)

app.listen(port, async () => {
  console.log(`server up on port ${port} at ${await data.startTime.get()}`)
})
