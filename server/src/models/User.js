const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      default: 'My Enterprise MSME',
      trim: true
    },
    role: {
      type: String,
      enum: ['BUSINESS_OWNER', 'IT_SECURITY_LEAD', 'AUDITOR', 'ANALYST'],
      default: 'BUSINESS_OWNER'
    },
    avatar: {
      type: String,
      default: 'US'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Helper method to compare password
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
