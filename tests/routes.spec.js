process.env.NODE_ENV = 'test';
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
        arrayContains(response, 'iso_code', 'sme').should.include(true);
        arrayContains(response, 'region', 'jungleland').should.include(true);
        arrayContains(response, 'income_group', 'no-money').should.include(true);
        arrayContains(response, 'id', 2).should.include(true);
        arrayContains(response, 'name', 'YUVALAND').should.include(true);
        arrayContains(response, 'iso_code', 'yuv').should.include(true);
        arrayContains(response, 'region', 'coconut-trees').should.include(true);
        arrayContains(response, 'income_group', 'rich').should.include(true);
        arrayContains(response, 'id', 3).should.include(true);
        arrayContains(response, 'name', 'DEXLAND').should.include(true);
        arrayContains(response, 'iso_code', 'dex').should.include(true);
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
});
