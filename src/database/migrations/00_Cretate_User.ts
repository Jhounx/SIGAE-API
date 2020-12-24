import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users", (table) => {
    table.string("userID").notNullable().primary();
    table.string("matricula").notNullable().unique();
    table.string("password").notNullable();
    table.string("nome").notNullable();
    table.string("email").unique();
    table.string("nomePreferencia");
    table.string("tipo").notNullable();
    table.string("key").notNullable().unique();
    table.integer("complete").defaultTo(0);
    table.string("campus").notNullable()
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
