import { AddResponse, CreateResponse, GetResponse } from '../../../contract'

const apiCall = <T>(...fetchArgs: Parameters<typeof fetch>): Promise<T> =>
  fetch(...fetchArgs).then((r) => r.json())

export const createAndReturnBag = <T>() =>
  apiCall<CreateResponse<T>>('/bag/create', { method: 'post' })

export const getBag = <T>(bagId: string) =>
  apiCall<GetResponse<T>>('/bag/' + bagId)

export const addItemToBag = <T>(bagId: string, item: T) =>
  apiCall<AddResponse<T>>('/bag/' + bagId + '/add', {
    method: 'post',
    body: JSON.stringify(item),
    headers: { 'Content-Type': 'application/json' },
  })
