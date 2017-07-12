process.env.NODE_ENV = 'test';
const environment = 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../Server/server');

const should = chai.should();

chai.use(chaiHttp);

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => done());
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => done());
  });

  describe('GET getOneResource api function', () => {
    it('should return all countries if user hits countries api endpoint', (done) => {
      chai.request(server)
      .get('/api/v1/countries')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(3);
        response.body[0].id.should.equal(1);
        response.body[0].name.should.equal('smeland');
        response.body[0].iso_code.should.equal('sme');
        response.body[0].region.should.equal('jungleland');
        response.body[0].income_group.should.equal('no-money');
        response.body[1].id.should.equal(2);
        response.body[1].name.should.equal('yuvaland');
        response.body[1].iso_code.should.equal('yuv');
        response.body[1].region.should.equal('coconut-trees');
        response.body[1].income_group.should.equal('rich');
        response.body[2].id.should.equal(3);
        response.body[2].name.should.equal('dexland');
        response.body[2].iso_code.should.equal('dex');
        response.body[2].region.should.equal('bushes');
        response.body[2].income_group.should.equal('bones');
        done();
      });
    });

    it('should return all malnutrition_data if user hits malnutrition data api endpoint', (done) => {
      chai.request(server)
      .get('/api/v1/malnutrition_data')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.length.should.equal(3);
        response.body[0].id.should.equal(1);
        response.body[0].country_name.should.equal('smeland');
        response.body[0].year.should.equal('1980');
        response.body[0].under_5_population.should.equal('3000');
        response.body[0].sample_size.should.equal('300');
        response.body[0].severe_wasting.should.equal('30');
        response.body[0].wasting.should.equal('3');
        response.body[0].overweight.should.equal('10');
        response.body[0].stunting.should.equal('20');
        response.body[0].underweight.should.equal('30');

        response.body[1].id.should.equal(2);
        response.body[1].country_name.should.equal('yuvaland');
        response.body[1].year.should.equal('1984');
        response.body[1].under_5_population.should.equal('9000');
        response.body[1].sample_size.should.equal('900');
        response.body[1].severe_wasting.should.equal('90');
        response.body[1].wasting.should.equal('9');
        response.body[1].overweight.should.equal('90');
        response.body[1].stunting.should.equal('90');
        response.body[1].underweight.should.equal('90');

        response.body[2].id.should.equal(3);
        response.body[2].country_name.should.equal('dexland');
        response.body[2].year.should.equal('2017');
        response.body[2].under_5_population.should.equal('6000');
        response.body[2].sample_size.should.equal('600');
        response.body[2].severe_wasting.should.equal('60');
        response.body[2].wasting.should.equal('6');
        response.body[2].overweight.should.equal('60');
        response.body[2].stunting.should.equal('60');
        response.body[2].underweight.should.equal('60');
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
});
