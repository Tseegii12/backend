exports.up = function (knex) {
  knex.schema.raw("SELECT 1 FROM field_work")
}

exports.down = function (knex) {}
