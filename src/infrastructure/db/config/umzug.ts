
import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: ':memory:',
});

console.log(__dirname);

export const migrator = new Umzug({
	migrations: {
		glob: ['../migrations/*.ts', { cwd: __dirname }],
	},
	context: sequelize.getQueryInterface(),
	storage: new SequelizeStorage({
		sequelize,
	}),
	logger: console,
	create: {
		folder: `src/infrastructure/db/migrations`
	},
});

export type Migration = typeof migrator._types.migration;