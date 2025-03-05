import { Schema, model } from 'mongoose';

const UserSchema = Schema({
    name: {
        type: String,
        required: true,
        maxLenght: 50
    },
    username: {
        type: String,
        required: true,
        unique: true,
        maxLenght: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLenght: 8
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE'],
        default: 'ADMIN_ROLE'
    },
    status: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionKey: false
}
);

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('User', UserSchema);
