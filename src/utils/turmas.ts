import turmas from '../json/turmas.json'

export default function allTurmas(){
   const values = Object.values(turmas)
   return Array().concat(...values)
}
