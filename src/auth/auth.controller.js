import Usuario from '../user/user.model.js';  
import { generarJWT } from '../helpers/generate-jwt.js';  
import { hash, verify } from 'argon2';  

export const login = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await Usuario.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });

        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe en la base de datos' });
        }

        const passwordMatches = await verify(user.password, password);
        if (!passwordMatches) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        const token = await generarJWT(user.id);

        return res.json({
            msg: 'Login exitoso',
            user: user.username,
            token  
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};



export const register = async (req, res) => {
    try {
        const data = req.body;
        
        if (!data.role){
            data.role = "user";
        }
        
        const encryptedPassword = await hash (data.password);

        const user = await Usuario.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role,
        })

        return res.status(201).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        
        console.log(error);

        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        })

    }
}