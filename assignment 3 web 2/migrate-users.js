// Migration: Mark all existing users as verified
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function migrateUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find unverified users
    const usersToUpdate = await User.find({
      $or: [
        { isVerified: { $exists: false } },
        { isVerified: false }
      ]
    });
    
    if (usersToUpdate.length === 0) {
      console.log('No users need to be updated. All users are already verified.');
      return;
    }
    
    console.log(`\nFound ${usersToUpdate.length} users to update:`);
    usersToUpdate.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.role})`);
    });
    
    // Update all to verified
    const result = await User.updateMany(
      {
        $or: [
          { isVerified: { $exists: false } },
          { isVerified: false }
        ]
      },
      {
        $set: { 
          isVerified: true 
        },
        $unset: { 
          verificationCode: "",
          verificationCodeExpires: ""
        }
      }
    );
    
    console.log(`\nSuccessfully updated ${result.modifiedCount} users to verified status`);
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

console.log('='.repeat(60));
console.log('USER VERIFICATION MIGRATION SCRIPT');
console.log('='.repeat(60));
console.log('This will mark all existing users as verified.');
console.log('New users will still need to verify their email.\n');

migrateUsers();
