import request from 'supertest'
import Koa from 'koa';
import { createClient, DataClient } from "./data";
import buildApp from './server/app'
import { Server } from 'http';

describe('the app API', () => {
  let mockStore: Record<string, string>
  let server: Server

  beforeEach(() => {
    mockStore = {}
    const redis = {
      get: jest.fn().mockImplementation((key) => mockStore[key]),
      set: jest.fn().mockImplementation((key, value) => { mockStore[key] = value; return 'OK' }),
    }

    const client = createClient(redis as any)
    const app = buildApp(client)
    server = app.listen()
  })

  describe('/bag', () => {
    test('creating a bag, adding to it and checking the contents', async () => {
      const createResponse = await request(server).post('/bag/create')
        .expect(200)
        .expect('Content-Type', /json/)

      const bagId = createResponse.body.bagId

      await request(server).post(`/bag/${bagId}/add`).send({ type: 'chip' })

      const getResponse = await request(server).get(`/bag/${bagId}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(getResponse.body.contents).toEqual([{ type: 'chip' }])
    })
  })
})