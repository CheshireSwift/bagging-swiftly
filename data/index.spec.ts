import { createClient, DataClient } from '.';
import Bag from '../bag/Bag';
import RedisKeys from './RedisKeys';

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
      await client.withLockOnBag(bagId, async bagAccessor => {
        const bagObj = Bag.withContents(1, 2, 3).toJsonable()
        await bagAccessor.set(bagObj)
        expect(redis.set).toHaveBeenCalledWith(
          RedisKeys.bagPrefix + bagId,
          JSON.stringify(bagObj)
        )
      })
    })

    it('can be read', async () => {
      await client.withLockOnBag(bagId, async bagAccessor => {
        const bagObj = Bag.withContents(1, 2, 3).toJsonable()
        redis.get.mockResolvedValue(JSON.stringify(bagObj))

        const result = await bagAccessor.get()

        expect(redis.get).toHaveBeenCalledWith(RedisKeys.bagPrefix + bagId)
        expect(result).toEqual(bagObj)
      })
    })
  })

  describe('bag lock', () => {
    const bagId = 'id-here'
    it('executes the lock block, passing the locked bag in', async () => {
      const bag = Bag.withContents(1, 2, 3).toJsonable()
      redis.get.mockResolvedValue(JSON.stringify(bag))

      await client.withLockOnBag(bagId, async (bagAccessor) => {
        expect(await bagAccessor.get()).toEqual(bag)
      })
    })

    // Not worrying about multiple server instances rn
    // it.skip('creates a lock key for the lifetime of the lock block', async () => {
    //   await client.withLockOnBag(bagId, () => {
    //     expect(redis.setnx).toHaveBeenCalledWith(RedisKeys.lockPrefix + bagId)
    //   })
    //   expect(redis.del).toHaveBeenCalledWith(RedisKeys.lockPrefix + bagId)
    // })

    const eventLoopRun = () => new Promise<void>((r) => { setImmediate(r) })

    it('prevents one block from executing until another is finished', async () => {
      let release: () => void = jest.fn()

      let secondHandlerRun = false

      const firstRun = client.withLockOnBag(bagId, () => {
        expect(secondHandlerRun).toBe(false)
        return new Promise<void>((resolve) => {
          release = resolve
        })
      })

      const secondRun = client.withLockOnBag(bagId, () => {
        secondHandlerRun = true
      })

      await eventLoopRun()

      expect(secondHandlerRun).toBe(false)

      release()
      await firstRun
      await secondRun

      expect(secondHandlerRun).toBe(true)
    })
  })
})
