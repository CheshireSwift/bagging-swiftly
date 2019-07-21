import { AddResponse, CreateResponse, GetResponse } from '../../../contract'

const host = process.env.API_HOST || ''

const apiCall = <T>(...[path, ...otherArgs]: Parameters<typeof fetch>): Promise<T> => {
  console.log(host, path)
  return fetch(host + path, ...otherArgs).then((r) => r.json())
}

export const createAndReturnBag = <T>() =>
  apiCall<CreateResponse<T>>('/bag/create', { method: 'post' })

export const getBag = <T>(bagId: string) =>
  apiCall<GetResponse<T>>('/bag/' + bagId)

export const addItemToBag = <T>(bagId: string, item: T | T[]) =>
  apiCall<AddResponse<T>>('/bag/' + bagId + '/add', {
    method: 'post',
    body: JSON.stringify(item),
    headers: { 'Content-Type': 'application/json' },
  })
