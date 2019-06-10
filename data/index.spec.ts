import RedisKeys from './RedisKeys'

import { createClient, DataClient } from '.'
import Bag from '../bag/Bag'

describe('the data layer', () => {
  let client: DataClient
  let redis: Record<string, jest.Mock<any, any>>

  beforeEach(() => {
    redis = {
      get: jest.fn(),
      set: jest.fn().mockImplementation((__, value) => Promise.resolve(value)),
    }

    client = createClient(redis as any)
  })

  describe('server start time', () => {
    it('saves', async () => {
      const startTime = new Date(12345)
      await client.startTime.set(startTime)
      expect(redis.set).toHaveBeenCalledWith(
        RedisKeys.serverStartTime,
        startTime.valueOf().toString()
      )
    })

    it('can be read', async () => {
      redis.get.mockResolvedValue('12345')
      const result = await client.startTime.get()
      expect(result).toEqual(new Date(12345))
    })
  })

  describe('bag with the given ID', () => {
    const bagId = 'id-here'

    it('saves', async () => {
      const bagObj = Bag.withContents(1, 2, 3).toJsonable()
      await client.bag(bagId).set(bagObj)
      expect(redis.set).toHaveBeenCalledWith(
        RedisKeys.bagPrefix + bagId,
        JSON.stringify(bagObj)
      )
    })

    it('can be read', async () => {
      const bagObj = Bag.withContents(1, 2, 3).toJsonable()
      redis.get.mockResolvedValue(JSON.stringify(bagObj))

      const result = await client.bag(bagId).get()

      expect(redis.get).toHaveBeenCalledWith(RedisKeys.bagPrefix + bagId)
      expect(result).toEqual(bagObj)
    })
  })
})
