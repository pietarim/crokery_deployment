import config from '../config/config';
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

console.log('anything');

const sequelize = new Sequelize(config.development.databaseUrl);

console.log('another one');

const migrationConf = {
  migrations: {
    glob: 'migrations/*.ts',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

rollbackMigration();