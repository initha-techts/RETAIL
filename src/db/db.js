
import mongoose from 'mongoose';

let db1 = null;
let db2 = null;

const connectDatabases = async () => {
  try {
    db1 = await mongoose.createConnection('mongodb://localhost:27017/retail_DB');
    db2 = await mongoose.createConnection('mongodb://localhost:27017/MASTER_DB');
    console.log('✅ Connected to both MongoDB databases');
  } catch (error) {
    console.error('❌ DB connection error:', error);
  }
};

const getDb1 = () => db1;
const getDb2 = () => db2;

export default {
  connectDatabases,
  getDb1,
  getDb2,
};
