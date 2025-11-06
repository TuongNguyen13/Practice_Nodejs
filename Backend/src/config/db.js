import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('../.env') });

const sequelize = new Sequelize(
  process.env.MYSQL_DB,      
  process.env.MYSQL_USER,    
  process.env.MYSQL_PASS,    
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully!');
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
