import Knex from 'knex'

export async function up(knex: Knex){
   return knex.schema.createTable('materias_docentes', table =>{
      table.string('userID').notNullable()
      table.string('materia').notNullable()
   })
}

export async function down(knex: Knex){
   return knex.schema.dropTable('materias_docentes')
}