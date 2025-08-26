
require('ts-node/register');

require('./src/infrastructure/db/config/umzug').migrator.runAsCLI();