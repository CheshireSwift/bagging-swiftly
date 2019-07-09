import { SerializableBag } from '../bag/Bag'

export type GetResponse<T> = SerializableBag<T>
export type CreateResponse<T> = { bagId: string; bag: SerializableBag<T> }
export type ItemResponse<T> = T
export type AddResponse<T> = SerializableBag<T>
