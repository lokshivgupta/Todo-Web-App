import express from 'express'
import db from '../db.js'

const router = express.Router();


//Get all the todos of the user
router.get('/', (req,res)=>{

    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?');
    const todos = getTodos.all(req.userId);

    res.json(todos)


});

//Create a new todo
router.post('/', (req,res)=>{
    

});

//Update a todo task
router.put('/:id', (req,res)=>{

})

//Delete a todo
router.delete('/:id' , (req,res)=>{

})

export default  router;