import Knex from 'knex'

export async function up(knex: Knex){
   return knex.schema.createTable('monitores', table => {
      table.string('userID').notNullable()
      table.string('departamento').notNullable()
   })
}

export async function down(knex: Knex){
   return knex.schema.dropTable('monitores')
}