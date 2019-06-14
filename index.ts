import { createClient } from './data';
import { createHandyClient } from 'handy-redis';
import buildApp from './server/app';

const data = createClient(createHandyClient())

const port = process.env.BAGGING_SWIFTLY_PORT || 3000

buildApp(data).listen(port, async () => {
  console.log(`server up on port ${port} at ${await data.startTime.get()}`)
})
