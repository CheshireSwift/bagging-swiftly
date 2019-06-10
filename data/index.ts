import { IHandyRedis } from 'handy-redis'
import RedisKeys from './RedisKeys'
import { SerializableBag } from '../bag/Bag'

type RedisField<T> = {
  get: () => Promise<T | null>
  set: (value: T) => Promise<string>
}

type Converter<T> = {
  in: (value: T) => string
  out: (str: string | null) => T | null
}

export interface DataClient {
  bag<T>(bagId: string): RedisField<SerializableBag<T>>
  startTime: RedisField<Date>
}

const converters = {
  date: {
    in: (date: Date) => date.valueOf().toString(),
    out: (str: string | null) => str && new Date(Number.parseInt(str)),
  } as Converter<Date>,
  bag: {
    in: (bagObj: SerializableBag<any>) => JSON.stringify(bagObj),
    out: (bagStr: string | null) => bagStr && JSON.parse(bagStr),
  } as Converter<SerializableBag<any>>,
}

const redisFieldAccessor = (redis: IHandyRedis) => <T>(
  key: string,
  converter: Converter<T>
): RedisField<T> => ({
  get: async () => converter.out(await redis.get(key)),
  set: async (value) => await redis.set(key, converter.in(value)),
})

export const createClient = (redis: IHandyRedis): DataClient => {
  const accessor = redisFieldAccessor(redis)
  return {
    startTime: accessor(RedisKeys.serverStartTime, converters.date),
    bag: (bagId) => accessor(RedisKeys.bagPrefix + bagId, converters.bag),
  }
}
