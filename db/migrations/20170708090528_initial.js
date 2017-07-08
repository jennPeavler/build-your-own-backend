exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('countries', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('iso_code');
      table.string('region');
      table.string('income_group');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('yearly_malnutrition_data', (table) => {
      table.increments('id').primary();
      table.integer('country_id').unsigned();
      table.foreign('country_id')
      .references('countries.id');
      table.integer('year').unsigned();
      table.integer('under_5_population').unsigned();
      table.integer('sample_size').unsigned();
      table.integer('severe_wasting').unsigned();
      table.integer('wasting').unsigned();
      table.integer('overweight').unsigned();
      table.integer('stunting').unsigned();
      table.integer('underweight').unsigned();
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
