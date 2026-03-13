import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router();


//Register a new user endpoint /auth/register
router.post('/register' , (req,res) =>{
    const { username,password } = req.body

    //encrypt the password 
    const hashedPass = bcrypt.hashSync(password,8);

    //save the new user and hash the password
    try{
        const insertUser = db.prepare(`INSERT INTO users(username,password)
        VALUES (?,?)`
        )
        const result = insertUser.run(username,hashedPass);

        //Default Todo

        const defaultTodo = `Hello! Add your first Todo!`;
        const insertTodo = db.prepare(`INSERT INTO todos(user_id,task)
        VALUES(?,?)
        `)
        insertTodo.run(result.lastInsertRowid,defaultTodo);

        //create a token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn : '24h'});
        res.json({ token });
    }catch(err){
        console.log(err.message);
        res.sendStatus(503); 
    }
})
 

router.post('/login', (req,res)=>{
    // We get their email, and we look up the password associated with that email
    // but we get it back as it is encrypted, which we cannot compare it with to the one user just trying to login
    // so to solve this we one way encrypt the password

    const {username, password}  = req.body;

    try{

        const getUser = db.prepare('SELECT *  FROM  users WHERE username = ?')
        const user = getUser.get(username);

        if(!user){
            return res.status(404).send({ message: "User not found" })
        }

        // if user is found
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        // if password is not valid
        if(!passwordIsValid){
            return res.status(401).send({ message: "Wrong Password" })
        }

        // if password is valid
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn : '24h'})
        res.json({ token })

    }catch(err){
        console.log(err.message);
        res.sendStatus(503);
    }
    
})
export default router

