import Knex from "knex";

export default async (
  querys: (Knex.QueryBuilder<any, number> | Knex.QueryBuilder<any, number[]>)[]
) => {
  let error = true;
  for (let query of querys) {
    const databaseResponse = await query;
    if (!databaseResponse) error = false;
  }

  return error
};
