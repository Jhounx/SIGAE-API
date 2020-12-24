import Knex from 'knex'

export async function up(knex: Knex){
   return knex.schema.createTable('alunos', table =>{
      table.string('userID').notNullable().primary()
      table.string('turma')
      table.string("curso").notNullable()
   })
}

export async function down(knex: Knex){
   return knex.schema.dropTable('alunos')
}