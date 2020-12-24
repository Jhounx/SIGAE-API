import Knex from 'knex'

export async function up(knex: Knex){
   return knex.schema.createTable('Atendimentos', table =>{
      table.string('id').primary()
      table.string('Nome').notNullable()
      table.string('descricao').notNullable()
      table.string('data').notNullable()
      table.string('inicio').notNullable()
      table.string('fim').notNullable()
      table.string('tipo').notNullable()
      table.string('docente').notNullable()
      table.string('materia').notNullable()
      table.string('sala').notNullable()
      table.string('campus').notNullable()
      table.integer('limite').notNullable()
      table.integer('numAtual').notNullable()
      table.string('dataAgendamento').notNullable()
      table.string('ultimaModificacao').notNullable()
      table.string('estado', 4)
   })
}

export async function down(knex: Knex){
   return knex.schema.dropTable('Atendimentos')
}