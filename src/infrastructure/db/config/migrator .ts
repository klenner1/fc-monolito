import { SequelizeStorage, Umzug } from "umzug";
import { Sequelize } from "sequelize";

export const migrator = (
  sequelize: Sequelize
) => {
  return new Umzug({
    migrations: {
      glob: ['../migrations/*.ts', { cwd: __dirname }],
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: null//console
  });
}