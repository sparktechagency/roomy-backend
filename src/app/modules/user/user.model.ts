import bcrypt from 'bcrypt';
import mongoose, { Types } from 'mongoose';
import validator from 'validator';
import { ENUM_USER_ROLE, ENUM_USER_STATUS } from '../../../enums/enum';
import IUser from './user.interface';

export const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required!'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: (props: { value: string }) => `${props.value} is not a valid email!`,
      },
    },
    phone: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (v) {
          return /^\+61[ ]?4\d{2}[ ]?\d{3}[ ]?\d{3}$/.test(v) || /^\+614\d{8}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid Australian mobile phone number!`,
      },
    },

    password: {
      type: String,
      trim: true,
      minlength: [8, 'Password must be at least 8 characters'],
      required: [true, 'Password is required!'],
    },

    profile: {
      id: {
        type: Types.ObjectId,
        ref: 'Profile',
        default: null,
      },
      role: {
        type: String,
        enum: [ENUM_USER_ROLE.GUEST, ENUM_USER_ROLE.HOST],
        required: false,
      },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: {
        values: [ENUM_USER_STATUS.ACTIVE, ENUM_USER_STATUS.BLOCKED],
        message: '{VALUE} is not accepted as a status value. Use active | blocked.',
      },
      default: 'active',
    },
    verification: {
      code: {
        type: String,
        default: null,
      },
      expireDate: {
        type: Date,
        default: null,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function (next) {
  const saltRounds = 10;
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }

  if (this.isModified('verification.code') && this.verification?.code) {
    this.verification.code = bcrypt.hashSync(this.verification.code, saltRounds);
  }

  next();
});

userSchema.methods.comparePassword = function (userPlanePassword: string) {
  return bcrypt.compareSync(userPlanePassword, this.password);
};

userSchema.methods.compareVerificationCode = function (userPlaneCode: string) {
  return bcrypt.compareSync(userPlaneCode, this.verification.code);
};

userSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

userSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phone: 'text',
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
