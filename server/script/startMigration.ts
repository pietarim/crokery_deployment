import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import config from '../src/config/config';

const sequelize = new Sequelize(config.databaseUrl, {});

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const migrateDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('connected to the database');
    await runMigrations();
  } catch (err) {
    console.log(err);
    return process.exit(1);
  }

  return null;
};

const main = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();

const connectAndinit = async () => {
  try {
    await migrateDatabase();
  } catch (error) {
    console.log(error);
  }
};
connectAndinit();