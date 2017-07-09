exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('countries', (table) => {
      table.increments('id').primary();
      table.string('name').unique();
      table.string('iso_code');
      table.string('region');
      table.string('income_group');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('yearly_malnutrition_data', (table) => {
      table.increments('id').primary();
      table.string('country_name');
      table.foreign('country_name');
      table.string('year');
      table.string('under_5_population');
      table.string('sample_size');
      table.string('severe_wasting');
      table.string('wasting');
      table.string('overweight');
      table.string('stunting');
      table.string('underweight');
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('yearly_malnutrition_data'),
    knex.schema.dropTable('countries'),
  ]);
};
