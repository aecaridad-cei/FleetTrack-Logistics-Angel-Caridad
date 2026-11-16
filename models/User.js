import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        usuario: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: [5, 'El nombre de usuario debe contener como minimo 5 caracteres']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        }
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User