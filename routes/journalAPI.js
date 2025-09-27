const express = require('express')
const router = express.Router()
const pool = require('../db')





router.delete('/action',async (req,res) => {
    const {id} = req.body
    const user_id = req.session.user?.id
   
    try{
        await pool.query(`DELETE FROM journal_entry WHERE id = $1 AND user_id = $2`,[id,user_id])
        return res.status(201).send(`Successfully deleted entry with id : ${id}`)

    }catch (err){
        console.error(err)
    }
    
})


router.post('/action', async (req,res) => {
    const {text,title} = req.body
    
    const user_id = req.session.user?.id
   
    if (!text && !title){
        return res.status(400).send("Missing text content")
    }
    text.trim()
    title.trim()
    try{
    const result = await pool.query('INSERT INTO journal_entry (text,date,title,user_id) VALUES ($1,$2,$3,$4) RETURNING * ', [text,new Date().toISOString(),title,user_id])
    const returnId = result.rows[0].id
    console.log(returnId)
    return res.status(201).send(returnId)
    }catch(err){
        console.error(err)
    }
    
})

router.put('/action', async (req, res) => {
    const {id,title, text} = req.body
    const user_id = req.session.user?.id
    title?.trim()
    text?.trim()

    try{
       const result =  await pool.query("SELECT title,text FROM journal_entry WHERE user_id = $1 AND id = $2", [user_id,id])
       const entry = result.rows[0]
       
       if(!entry){
        return res.status(404).send("No entry found.")
       }

       if(entry.title === title && entry.text === text){
        return res.status(403).send("Nothing to update.")
       }

        
    

    await pool.query("UPDATE journal_entry SET date = $1, title = $2, text = $3 WHERE id = $4 AND user_id = $5", [new Date().toISOString(),title,text,id,user_id])
    res.status(201).send(`Successful Updated the entry with id: ${id} title : ${title} `)
    }
    catch (err){
        console.error(err)
        res.status(500).send(`Failed to update the entry with id: ${id} title : ${title} `)
    }
})

router.get('/action',async (req,res) => {
    console.log(req.session.user)
    if (req.session.user){
        const result = await pool.query("SELECT * FROM journal_entry WHERE user_id = $1", [req.session.user.id])
        return res.json(result.rows)
    }

    
})



module.exports = router