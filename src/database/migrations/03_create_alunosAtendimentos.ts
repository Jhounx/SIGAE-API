import Knex from 'knex'

export async function up(knex: Knex){
   return knex.schema.createTable('AtendimentosAlunos', table =>{
      table.string('atendimentoID').notNullable()
      table.string('alunoID').notNullable()
      table.string('confirm').notNullable()
      table.string('presente').notNullable()
   })
}

export async function down(knex: Knex){
   return knex.schema.dropTable('AtendimentosAlunos')
}