import httpStatus from 'http-status';
import supertest from 'supertest';
import app from '../src/index';
import fruitsRepository, { Fruit } from 'repositories/fruits-repository';
import { FruitInput } from 'services/fruits-service';

const server = supertest(app);

describe('GET /fruits', () => {
  it('should return all fruits with status 200', async () => {

    const fruitArr: FruitInput[] = [
    {
      name: "Kiwi",
      price: 3
    },
    {
      name: "Perá",
      price: 2
    },
    {
      name: "Laranja",
      price: 5
    },
  ]

    fruitArr.map((fruit: FruitInput) => {fruitsRepository.insertFruit(fruit)})

    const response = await server.get('/fruits');

    expect(response.status).toBe(httpStatus.OK);

    const fruitArrExpected: Fruit[] = [
      {
        id : 1,
        name: "Kiwi",
        price: 3
      },
      {
        id : 2,
        name: "Perá",
        price: 2
      },
      {
        id : 3,
        name: "Laranja",
        price: 5
      },
    ]

    expect(response.body).toEqual(expect.arrayContaining(fruitArrExpected));
  })
});


describe('GET /fruits/:id', () => {
  it('should return a fruit body with id and send status 200', async () => {
    const id = '1';

    const bodySend = {
      name: 'Maçã',
      price: 5
    }

    await server.post('/fruits').send(bodySend);

    const response = await server.get(`/fruits/${id}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(expect.objectContaining({
      name: expect.any(String),
      price: expect.any(Number)
    }));
  })

  it('should return status 404 when fruit id does not exist', async () => {
    const id = '123';

    const response = await server.get(`/fruits/${id}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  })
});

describe('POST /fruits', () => {
  it('should create fruit and send status 201', async () => {

    const bodySend = {
      name: 'Banana',
      price: 6
    }

    const response = await server.post('/fruits').send(bodySend);

    expect(response.status).toBe(httpStatus.CREATED);
  })

  it('should return status 422 when body is invalid', async () => {

    const bodySend = {
      axd: 'Banana',
      pit: 6
    }

    const response = await server.post('/fruits').send(bodySend);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  })

  it('should return status 409 when already fruit exist', async () => {

    const bodySend = {
      name: 'Banana',
      price: 6
    }

    await server.post('/fruits').send(bodySend);

    const response = await server.post('/fruits').send(bodySend);

    expect(response.status).toBe(httpStatus.CONFLICT);
  })
});