const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const horseRaceRoutes = require('../routes/horserace');
const Session = require('../models/session');
const db = require('../database.js');
jest.mock('../database.js');

const Horserace = require('../controllers/horserace');


const app = express();
app.use(bodyParser.json());
app.use('/horserace', horseRaceRoutes);

jest.mock('../database.js', () => {
    return {
        query: jest.fn()
    };
});


describe('POST /horserace/startHorseRace/:lobbyid', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        db.query.mockResolvedValue({ rows: [{ balance: 400 }] });
    });


  it('should return 400 if betValue is missing', async () => {
      const invalidRequestBody = {
          userId: 'user1',
          pickedHorse: 1
      };

      const res = await request(app)
          .post('/horserace/startHorseRace/123')
          .send(invalidRequestBody);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
  });

  it('should return 400 if pickedHorse is missing', async () => {
          const invalidRequestBody = {
              userId: 'user1',
              betValue: 100
          };

          const res = await request(app)
              .post('/horserace/startHorseRace/123')
              .send(invalidRequestBody);

          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('errors');
      });

      it('should return 400 if userId is missing', async () => {
              const invalidRequestBody = {
                  betValue: 100,
                  pickedHorse: 1
              };

              const res = await request(app)
                  .post('/horserace/startHorseRace/123')
                  .send(invalidRequestBody);

              expect(res.status).toBe(400);
              expect(res.body).toHaveProperty('errors');
          });


    it('should update balance correctly when the horse wins (1st place)', async () => {
        await testHorseRace(1, 3, 400, 100, 700);
    });

    it('should update balance correctly when the horse comes in 2nd place', async () => {
        await testHorseRace(2, 2, 400, 100, 600);
    });

    it('should update balance correctly when the horse comes in 3rd place', async () => {
        await testHorseRace(3, 0, 400, 100, 400);
    });

    it('should update balance correctly when the horse comes in 4th place', async () => {
        await testHorseRace(4, -1, 400, 100, 300);
    });
});

async function testHorseRace(pickedHorse, multiplier, initialBalance, betValue, expectedNewBalance) {
    const userId = 'user1';
    const lobbyid = '123';

    //Mocking Session methods
       jest.spyOn(Session, 'getBalance').mockImplementation(async (session) => {
           if (session.userid === 'user1' && session.lobbyid === '123') {
               return initialBalance;
           }
           return null;
       });

       jest.spyOn(Session, 'updateBalance').mockImplementation(async (session, newBalance) => {
           return { rows: [] };
       });

    //Mocking Math.random to control horsePlaces
    jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.2)
        .mockReturnValueOnce(0.3)
        .mockReturnValueOnce(0.4);

    const res = await request(app)
        .post(`/horserace/startHorseRace/${lobbyid}`)
        .send({ userId, betValue, pickedHorse });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('horsePlaces');

    const horsePlaces = res.body.horsePlaces;
    console.log('horsePlaces:', horsePlaces);

    expect(Session.getBalance).toHaveBeenCalledWith({ userid: userId, lobbyid });

    const i = horsePlaces.indexOf(pickedHorse);
    const multipliers = [3, 2, 0, -1];
    const calculatedMultiplier = multipliers[i];
    const newBalance = initialBalance + (betValue * calculatedMultiplier);

    expect(Session.updateBalance).toHaveBeenCalledWith({ userid: userId, lobbyid }, newBalance);
    expect(newBalance).toBe(expectedNewBalance);
}
