import bcrypt from "bcrypt";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document<string> {
    name: string;
    email: string;
    password: string;
    comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password; // omit password in JSON responses
                delete ret.__v;
            },
        },
    },
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
