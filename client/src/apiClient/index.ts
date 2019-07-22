import { AddResponse, CreateResponse, GetResponse, ItemResponse } from '../../../contract'
import { Chip } from '../../chips';

const host = process.env.API_HOST || ''

const apiCall = <T>(...[path, ...otherArgs]: Parameters<typeof fetch>): Promise<T> => {
  return fetch(host + path, ...otherArgs).then((r) => r.json())
}

export const createAndReturnBag = <T>() =>
  apiCall<CreateResponse<T>>('/bag/create', { method: 'post' })

export const getBag = (bagId: string) =>
  apiCall<GetResponse<Chip>>('/bag/' + bagId)

export const addItemToBag = (bagId: string, item: Chip | Chip[]) =>
  apiCall<AddResponse<Chip>>('/bag/' + bagId + '/add', {
    method: 'post',
    body: JSON.stringify(item),
    headers: { 'Content-Type': 'application/json' },
  })

export const drawItemFromBag = (bagId: string) =>
  apiCall<ItemResponse<Chip>>('/bag/' + bagId + '/draw', { method: 'POST' })