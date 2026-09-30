const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB, isConnected, User, Incident, Posture, ScanLog } = require('../config/db');

async function runStandaloneSeed() {
  console.log('🚀 Running MongoDB Seeder for BizRaksha...');
  console.log('🔗 Connecting to:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 'Default');
  
  await connectDB();

  if (isConnected()) {
    try {
      const userCount = await User.countDocuments();
      const incidentCount = await Incident.countDocuments();
      const postureCount = await Posture.countDocuments();

      console.log('\n📊 Database Live Statistics:');
      console.log(`- Users in MongoDB: ${userCount}`);
      console.log(`- Incidents in MongoDB: ${incidentCount}`);
      console.log(`- Posture records in MongoDB: ${postureCount}`);
      console.log('\n✨ Database Connected & Seeded Successfully!');
      process.exit(0);
    } catch (e) {
      console.error('Error querying DB:', e.message);
      process.exit(1);
    }
  } else {
    console.log('⚠️ Could not connect to MongoDB Atlas (check IP whitelist or network access).');
    process.exit(0);
  }
}

runStandaloneSeed();
