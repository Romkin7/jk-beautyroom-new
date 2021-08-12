const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            trim: true,
        },
        email: { type: String, unique: true, required: true, trim: true },
        password: { type: String, required: true, trim: true },
        role: { type: String, required: true, default: 'basic' },
    },
    {
        timestamps: true,
        usePushEach: true,
    },
);

// Hash the password before saving it to the database
userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

//compare password in the database and the one that the user types in
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

//Admin premissions
userSchema.methods.confirmAdminLevel = () => {
    if (
        (this.admin.isAdmin && this.admin.premissions.name === 'basic') ||
        (this.admin.isAdmin &&
            this.admin.premissions.name === 'ultimate' &&
            this.admin.premissions.premit)
    ) {
        return true;
    } else {
        return false;
    }
};

module.exports = model('User', userSchema);
