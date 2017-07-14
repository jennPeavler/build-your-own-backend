process.env.NODE_ENV = 'test';
process.env.TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVU0VSTkFNRSI6InN2ZW4iLCJQQVNTV09SRCI6InBlYXZsZXJkZW4ifQ.SO-V6i8bwtVk5AdVgQmOo5gJ6UbdzoNynepKVFXuHRU';
const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../Server/server');

const should = chai.should();

chai.use(chaiHttp);

const arrayContains = ((response, key, value) => {
  const answerArray = [];
  response.body.forEach((dataPoint) => {
    answerArray.push(dataPoint[key] === value);
  });
  return answerArray;
});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => done());
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => done());
  });

  describe('GET getRequests.getOneResource api function', () => {
    it('should return all countries if user hits countries api endpoint', (done) => {
      chai.request(server)
      .get('/api/v1/countries')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(3);
        arrayContains(response, 'id', 1).should.include(true);
        arrayContains(response, 'name', 'SMELAND').should.include(true);
        arrayContains(response, 'iso_code', 'SME').should.include(true);
        arrayContains(response, 'region', 'jungleland').should.include(true);
        arrayContains(response, 'income_group', 'no-money').should.include(true);
        arrayContains(response, 'id', 2).should.include(true);
        arrayContains(response, 'name', 'YUVALAND').should.include(true);
        arrayContains(response, 'iso_code', 'YUV').should.include(true);
        arrayContains(response, 'region', 'coconut-trees').should.include(true);
        arrayContains(response, 'income_group', 'rich').should.include(true);
        arrayContains(response, 'id', 3).should.include(true);
        arrayContains(response, 'name', 'DEXLAND').should.include(true);
        arrayContains(response, 'iso_code', 'DEX').should.include(true);
        arrayContains(response, 'region', 'bushes').should.include(true);
        arrayContains(response, 'income_group', 'bones').should.include(true);
        done();
      });
    });

    it('should return all malnutrition_data if user hits malnutrition data api endpoint', (done) => {
      chai.request(server)
      .get('/api/v1/malnutrition_data')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(3);
        arrayContains(response, 'id', 1).should.include(true);
        arrayContains(response, 'country_name', 'SMELAND').should.include(true);
        arrayContains(response, 'year', '1980').should.include(true);
        arrayContains(response, 'under_5_population', '3000').should.include(true);
        arrayContains(response, 'sample_size', '300').should.include(true);
        arrayContains(response, 'severe_wasting', '30').should.include(true);
        arrayContains(response, 'wasting', '3').should.include(true);
        arrayContains(response, 'overweight', '10').should.include(true);
        arrayContains(response, 'stunting', '20').should.include(true);
        arrayContains(response, 'underweight', '30').should.include(true);
        arrayContains(response, 'id', 2).should.include(true);
        arrayContains(response, 'country_name', 'YUVALAND').should.include(true);
        arrayContains(response, 'year', '1984').should.include(true);
        arrayContains(response, 'under_5_population', '9000').should.include(true);
        arrayContains(response, 'sample_size', '900').should.include(true);
        arrayContains(response, 'severe_wasting', '90').should.include(true);
        arrayContains(response, 'wasting', '9').should.include(true);
        arrayContains(response, 'overweight', '90').should.include(true);
        arrayContains(response, 'stunting', '90').should.include(true);
        arrayContains(response, 'underweight', '90').should.include(true);
        arrayContains(response, 'id', 3).should.include(true);
        arrayContains(response, 'country_name', 'DEXLAND').should.include(true);
        arrayContains(response, 'year', '2017').should.include(true);
        arrayContains(response, 'under_5_population', '6000').should.include(true);
        arrayContains(response, 'sample_size', '600').should.include(true);
        arrayContains(response, 'severe_wasting', '60').should.include(true);
        arrayContains(response, 'wasting', '6').should.include(true);
        arrayContains(response, 'overweight', '60').should.include(true);
        arrayContains(response, 'stunting', '60').should.include(true);
        arrayContains(response, 'underweight', '60').should.include(true);
        done();
      });
    });

    it('should be able to filter countries by iso_code', (done) => {
      chai.request(server)
      .get('/api/v1/countries?iso_code=SME')
      .end((err, response) => {
        arrayContains(response, 'id', 1).should.include(true);
        arrayContains(response, 'name', 'SMELAND').should.include(true);
        arrayContains(response, 'iso_code', 'SME').should.include(true);
        arrayContains(response, 'region', 'jungleland').should.include(true);
        arrayContains(response, 'income_group', 'no-money').should.include(true);
        done();
      });
    });

    it('should be able to filter countries by iso_code case insensitively', (done) => {
      chai.request(server)
      .get('/api/v1/countries?iso_code=SmE')
      .end((err, response) => {
        arrayContains(response, 'id', 1).should.include(true);
        arrayContains(response, 'name', 'SMELAND').should.include(true);
        arrayContains(response, 'iso_code', 'SME').should.include(true);
        arrayContains(response, 'region', 'jungleland').should.include(true);
        arrayContains(response, 'income_group', 'no-money').should.include(true);
        done();
      });
    });

    it('should return a 404 and helpful error message if no countries are found', (done) => {
      database.migrate.rollback()
      .then(() => database.migrate.latest())
      .then(() => {
        chai.request(server)
        .get('/api/v1/countries')
        .end((err, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('No data exists in this table');
          done();
        });
      });
    });

    it('should return a 404 and helpful error message if no malnutrition data is found', (done) => {
      database.migrate.rollback()
      .then(() => database.migrate.latest())
      .then(() => {
        chai.request(server)
        .get('/api/v1/malnutrition_data')
        .end((err, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('No data exists in this table');
          done();
        });
      });
    });
  });

  describe('GET getRequests.getCountryMalnutritionData api function', () => {
    it('should return the malnutrition_data for a specified country', (done) => {
      chai.request(server)
      .get('/api/v1/countries/malnutrition_data/smeland')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(1);
        response.body[0].id.should.equal(1);
        response.body[0].country_name.should.equal('SMELAND');
        response.body[0].year.should.equal('1980');
        response.body[0].under_5_population.should.equal('3000');
        response.body[0].sample_size.should.equal('300');
        response.body[0].severe_wasting.should.equal('30');
        response.body[0].wasting.should.equal('3');
        response.body[0].overweight.should.equal('10');
        response.body[0].stunting.should.equal('20');
        response.body[0].underweight.should.equal('30');
        done();
      });
    });

    it('should be case insensitive', (done) => {
      chai.request(server)
      .get('/api/v1/countries/malnutrition_data/sMELand')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(1);
        response.body[0].id.should.equal(1);
        response.body[0].country_name.should.equal('SMELAND');
        response.body[0].year.should.equal('1980');
        response.body[0].under_5_population.should.equal('3000');
        response.body[0].sample_size.should.equal('300');
        response.body[0].severe_wasting.should.equal('30');
        response.body[0].wasting.should.equal('3');
        response.body[0].overweight.should.equal('10');
        response.body[0].stunting.should.equal('20');
        response.body[0].underweight.should.equal('30');
        done();
      });
    });

    it('should return a 404 and helpful error message if no malnutrition data for that country is found', (done) => {
      database.migrate.rollback()
      .then(() => database.migrate.latest())
      .then(() => {
        chai.request(server)
        .get('/api/v1/countries/malnutrition_data/zzzzzzzzzzz')
        .end((err, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('No malnutrition data found for that country');
          done();
        });
      });
    });
  });

  describe('GET getRequests.getYearlyMalnutritionData api function', () => {
    it('should return the malnutrition_data for a specified year', (done) => {
      chai.request(server)
      .get('/api/v1/yearly/malnutrition_data/1980')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(1);
        response.body[0].id.should.equal(1);
        response.body[0].country_name.should.equal('SMELAND');
        response.body[0].year.should.equal('1980');
        response.body[0].under_5_population.should.equal('3000');
        response.body[0].sample_size.should.equal('300');
        response.body[0].severe_wasting.should.equal('30');
        response.body[0].wasting.should.equal('3');
        response.body[0].overweight.should.equal('10');
        response.body[0].stunting.should.equal('20');
        response.body[0].underweight.should.equal('30');
        done();
      });
    });

    it('should return a 404 and helpful error message if no malnutrition data for that year is found', (done) => {
      database.migrate.rollback()
      .then(() => database.migrate.latest())
      .then(() => {
        chai.request(server)
        .get('/api/v1/yearly/malnutrition_data/1742')
        .end((err, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('No malnutrition data found for that year');
          done();
        });
      });
    });
  });

  describe('POST postRequests.postNewCountry api function', () => {
    it('should insert new country into database if user has authorization and hits enpoint', (done) => {
      chai.request(server)
      .post('/api/v1/countries')
      .set('Authorization', process.env.TOKEN)
      .send({ id: 4,
        name: 'PINLANDIA',
        iso_code: 'PIN',
        region: 'bartown',
        income_group: 'quarterly',
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.text.should.equal('Country recorded in table');
        response.request._data.should.have.property('id');
        response.request._data.id.should.equal(4);
        response.request._data.should.have.property('name');
        response.request._data.name.should.equal('PINLANDIA');
        response.request._data.should.have.property('iso_code');
        response.request._data.iso_code.should.equal('PIN');
        response.request._data.should.have.property('region');
        response.request._data.region.should.equal('bartown');
        response.request._data.should.have.property('income_group');
        response.request._data.income_group.should.equal('quarterly');
        done();
      });
    });

    it('should return a 404 and a helpful message if user does not have authorization to post country', (done) => {
      chai.request(server)
      .post('/api/v1/countries')
      .send({ id: 5,
        name: 'fee',
        iso_code: 'fi',
        region: 'fo',
        income_group: 'fum',
      })
      .end((err, response) => {
        response.should.have.status(403);
        const failureResponse = JSON.parse(response.text);
        failureResponse.message.should.equal('You must be authorized to hit this end point');
        done();
      });
    });
  });

  describe('POST postRequests.postNewMalnutritionData api function', () => {
    it('should insert new malnutritional data point into database if user has authorization and hits enpoint', (done) => {
      chai.request(server)
      .post('/api/v1/malnutrition_data')
      .set('Authorization', process.env.TOKEN)
      .send({ id: 4,
        country_name: 'SMELAND',
        year: '1998',
        under_5_population: '9999',
        sample_size: '999',
        severe_wasting: '99',
        wasting: '9',
        overweight: '99',
        stunting: '99',
        underweight: '99' })
      .end((err, response) => {
        response.should.have.status(201);
        response.text.should.equal('Malnutrition data recorded in database');
        response.request._data.should.have.property('id');
        response.request._data.id.should.equal(4);
        response.request._data.should.have.property('country_name');
        response.request._data.country_name.should.equal('SMELAND');
        response.request._data.should.have.property('year');
        response.request._data.year.should.equal('1998');
        response.request._data.should.have.property('under_5_population');
        response.request._data.under_5_population.should.equal('9999');
        response.request._data.should.have.property('sample_size');
        response.request._data.sample_size.should.equal('999');
        response.request._data.should.have.property('severe_wasting');
        response.request._data.severe_wasting.should.equal('99');
        response.request._data.should.have.property('wasting');
        response.request._data.wasting.should.equal('9');
        response.request._data.should.have.property('overweight');
        response.request._data.overweight.should.equal('99');
        response.request._data.should.have.property('stunting');
        response.request._data.stunting.should.equal('99');
        response.request._data.should.have.property('underweight');
        response.request._data.underweight.should.equal('99');
        done();
      });
    });

    it('should return a 404 and a helpful message if user does not have authorization to post malnutrition data', (done) => {
      chai.request(server)
      .post('/api/v1/malnutrition_data')
      .send({ id: 4,
        country_name: 'fee',
        year: 'fi',
        under_5_population: 'fo',
        sample_size: 'fum',
        severe_wasting: 'being',
        wasting: 'mean',
        overweight: 'is',
        stunting: 'hum',
        underweight: 'dumb' })
      .end((err, response) => {
        response.should.have.status(403);
        const failureResponse = JSON.parse(response.text);
        failureResponse.message.should.equal('You must be authorized to hit this end point');
        done();
      });
    });
  });

  describe('PATCH patchRequests.patchCountry api function', () => {
    it('should update country data point if user has authorization and hits enpoint', (done) => {
      chai.request(server)
      .patch('/api/v1/countries/SMELAND')
      .set('Authorization', process.env.TOKEN)
      .send({ region: 'pinland' })
      .end((err, response) => {
        response.should.have.status(201);
        response.text.should.equal('Data updated');
        response.request._data.should.have.property('region');
        response.request._data.region.should.equal('pinland');
        chai.request(server)
        .get('/api/v1/countries')
        .end((err, response) => {
          arrayContains(response, 'id', 1).should.include(true);
          arrayContains(response, 'name', 'SMELAND').should.include(true);
          arrayContains(response, 'region', 'jungleland').should.not.include(true);
          arrayContains(response, 'region', 'pinland').should.include(true);
          done();
        });
      });
    });

    it('should be case insesnsitive', (done) => {
      chai.request(server)
      .patch('/api/v1/countries/SmElaNd')
      .set('Authorization', process.env.TOKEN)
      .send({ region: 'pinland' })
      .end((err, response) => {
        response.should.have.status(201);
        response.text.should.equal('Data updated');
        response.request._data.should.have.property('region');
        response.request._data.region.should.equal('pinland');
        chai.request(server)
        .get('/api/v1/countries')
        .end((err, response) => {
          arrayContains(response, 'id', 1).should.include(true);
          arrayContains(response, 'name', 'SMELAND').should.include(true);
          arrayContains(response, 'region', 'jungleland').should.not.include(true);
          arrayContains(response, 'region', 'pinland').should.include(true);
          done();
        });
      });
    });

    it('should return a 404 and a helpful message if user does not have authorization to update country data', (done) => {
      chai.request(server)
      .patch('/api/v1/countries/SMELAND')
      .send({ region: 'pinland' })
      .end((err, response) => {
        response.should.have.status(403);
        const failureResponse = JSON.parse(response.text);
        failureResponse.message.should.equal('You must be authorized to hit this end point');
        done();
      });
    });
  });

  describe('PATCH patchRequests.patchMalnutritionData api function', () => {
    it('should update malnutrition data point if user has authorization and hits enpoint', (done) => {
      chai.request(server)
      .patch('/api/v1/malnutrition_data/SMELAND/1980')
      .set('Authorization', process.env.TOKEN)
      .send({ under_5_population: '3333' })
      .end((err, response) => {
        response.should.have.status(201);
        response.text.should.equal('Data updated');
        response.request._data.should.have.property('under_5_population');
        response.request._data.under_5_population.should.equal('3333');
        chai.request(server)
        .get('/api/v1/countries/malnutrition_data/SMELAND')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.length.should.equal(1);
          response.body[0].id.should.equal(1);
          response.body[0].country_name.should.equal('SMELAND');
          response.body[0].under_5_population.should.not.equal('3000');
          response.body[0].under_5_population.should.equal('3333');
          done();
        });
      });
    });

    it('should be case insensitive', (done) => {
      chai.request(server)
      .patch('/api/v1/malnutrition_data/SmElAnD/1980')
      .set('Authorization', process.env.TOKEN)
      .send({ under_5_population: '3333' })
      .end((err, response) => {
        response.should.have.status(201);
        response.text.should.equal('Data updated');
        response.request._data.should.have.property('under_5_population');
        response.request._data.under_5_population.should.equal('3333');
        chai.request(server)
        .get('/api/v1/countries/malnutrition_data/SMELAND')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.length.should.equal(1);
          response.body[0].id.should.equal(1);
          response.body[0].country_name.should.equal('SMELAND');
          response.body[0].under_5_population.should.not.equal('3000');
          response.body[0].under_5_population.should.equal('3333');
          done();
        });
      });
    });

    it('should return a 404 and a helpful message if user does not have authorization to update malnutrition data', (done) => {
      chai.request(server)
      .patch('/api/v1/malnutrition_data/SMELAND/1980')
      .send({ under_5_population: '9999' })
      .end((err, response) => {
        response.should.have.status(403);
        const failureResponse = JSON.parse(response.text);
        failureResponse.message.should.equal('You must be authorized to hit this end point');
        done();
      });
    });
  });

  describe('DELETE deleteRequests.deleteCountry api function', () => {
    it('should delete a country if user has authorization and hits endpoint', (done) => {
      chai.request(server)
      .get('/api/v1/countries')
      .end((error, response) => {
        response.body.length.should.equal(3);
        chai.request(server)
        .delete('/api/v1/countries/DEXLAND')
        .set('Authorization', process.env.TOKEN)
        .end((err, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/countries')
          .end((error, response) => {
            response.body.length.should.equal(2);
            done();
          });
        });
      });
    });

    it('should be case insesnsitive', (done) => {
      chai.request(server)
      .get('/api/v1/countries')
      .end((error, response) => {
        response.body.length.should.equal(3);
        chai.request(server)
        .delete('/api/v1/countries/DeXlaNd')
        .set('Authorization', process.env.TOKEN)
        .end((err, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/countries')
          .end((error, response) => {
            response.body.length.should.equal(2);
            done();
          });
        });
      });
    });

    it('should return a 404 and a helpful message if user does not have authorization to delete country data', (done) => {
      chai.request(server)
      .delete('/api/v1/countries/DEXLAND')
      .end((err, response) => {
        response.should.have.status(403);
        const failureResponse = JSON.parse(response.text);
        failureResponse.message.should.equal('You must be authorized to hit this end point');
        done();
      });
    });
  });

  describe('DELETE deleteRequests.deleteMalnutritionData api function', () => {
    it('should delete malnutrition data if user has authorization and hits endpoint', (done) => {
      chai.request(server)
      .get('/api/v1/malnutrition_data')
      .end((error, response) => {
        response.body.length.should.equal(3);
        chai.request(server)
        .delete('/api/v1/malnutrition_data/DEXLAND/2017')
        .set('Authorization', process.env.TOKEN)
        .end((err, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/malnutrition_data')
          .end((error, response) => {
            response.body.length.should.equal(2);
            done();
          });
        });
      });
    });

    it('should be case insesnsitive', (done) => {
      chai.request(server)
      .get('/api/v1/malnutrition_data')
      .end((error, response) => {
        response.body.length.should.equal(3);
        chai.request(server)
        .delete('/api/v1/malnutrition_data/DeXlAnD/2017')
        .set('Authorization', process.env.TOKEN)
        .end((err, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/malnutrition_data')
          .end((error, response) => {
            response.body.length.should.equal(2);
            done();
          });
        });
      });
    });

    it('should return a 404 and a helpful message if user does not have authorization to delete malnutrition_data data', (done) => {
      chai.request(server)
      .delete('/api/v1/malnutrition_data/DEXLAND/2017')
      .end((err, response) => {
        response.should.have.status(403);
        const failureResponse = JSON.parse(response.text);
        failureResponse.message.should.equal('You must be authorized to hit this end point');
        done();
      });
    });
  });
});
