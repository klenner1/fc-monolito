import { SequelizeStorage, Umzug } from "umzug";
import { join } from "path";
import { Sequelize } from "sequelize";

/**
 * Migrator used only for tests
 * @param sequelize 
 * @returns 
 */
export const migrator = (
  sequelize: Sequelize
) => {
    console.log(join(__dirname));

  return new Umzug({
    migrations: {
      glob: ['../migrations/*.ts', { cwd: __dirname }],
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: null//console
  });
}