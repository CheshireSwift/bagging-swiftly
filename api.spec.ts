import { Server } from 'http';
import request from 'supertest';
import { createClient } from "./data";
import buildApp from './server/app';

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
    const item = { type: 'chip' }

    class BagClient {
      bagId: string = '';

      create = async () => {
        const createResponse = await request(server).post('/bag/create')
          .expect(200)
          .expect('Content-Type', /json/)

        this.bagId = createResponse.body.bagId
      }

      addItem = async () => {
        await request(server).post(`/bag/${this.bagId}/add`).send(item)
          .expect(302)
          .expect('Location', '../')
      }

      get = async () => (await request(server).get(`/bag/${this.bagId}`)
        .expect(200)
        .expect('Content-Type', /json/))
        .body

      contents = async () => (await this.get()).contents
      removed = async () => (await this.get()).removed

      drawItem = async () => (await request(server).post(`/bag/${this.bagId}/draw`)
        .expect(200)
        .expect('Content-Type', /json/))
        .body
    }

    test('creating a bag, adding to it and checking the contents', async () => {
      const bag = new BagClient()
      await bag.create()
      await bag.addItem()

      const { contents, removed } = await bag.get()

      expect(contents).toEqual([item])
      expect(removed).toEqual([])
    })

    test('creating a bag, adding to it and pulling the item back out', async () => {
      const bag = new BagClient()
      await bag.create()
      await bag.addItem()

      expect(await bag.drawItem()).toEqual(item)

      const { contents, removed } = await bag.get()

      expect(contents).toEqual([])
      expect(removed).toEqual([item])
    })
  })
})
