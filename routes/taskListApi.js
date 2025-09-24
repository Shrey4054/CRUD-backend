const express = require('express')
const router = express.Router()
const pool = require('../db')



function checkUserId(req,res){
    const user_id = req.session.user?.id
    if (!user_id) return;
    if (!user_id) {
        res.status(403).json({ success: false, message: "Failed to save, invalid user id" });
        return null;
    }
    return user_id;
}

router.patch("/actions/update/status", async(req,res) => {
    const user_id = checkUserId(req,res)
    if (!user_id) return;
    try{
        const task = req.body.content
        const result = await pool.query(
            "UPDATE tasks SET status = $1 WHERE user_id = $2 AND id = $3", [task.status,user_id,task.id]
        )
        if (result.rowCount === 0){
            return res.status(404).json({success : false, message:"Task not found or not owned by the user"})
        }
        return res.status(200).json({success: true, message: "Status updated successfully."})
    }catch(err){
        console.error("Failed to update the status: ", err)
        return res.status(500).json({success: false, message: "Internal server error"})
    }
})

router.patch("/actions/update/dueDate", async(req,res) => {
    const user_id = checkUserId(req,res)
    if (!user_id) return;
    try{
        const task = req.body.content
        if(!task.dueDate){
            return res.status(403).json({success:false, message: "Date value cannot be null."})
        }
        const result = await pool.query(
            "UPDATE tasks SET date_due = $1 WHERE user_id = $2 AND id = $3", [task.dueDate,user_id,task.id]
        )
        if (result.rowCount === 0){
            return res.status(404).json({success : false, message:"Task not found or not owned by the user"})
        }
        return res.status(200).json({success: true, message: "Due date updated successfully."})
        
    }catch(err){
        console.error("Failed to update the due date: ", err)
        return res.status(500).json({success: false, message: "Internal server error"})
    }
})


router.patch("/actions/update/description", async(req,res) => {
    const user_id = checkUserId(req,res)
    if (!user_id) return;
    try{
        const task = req.body.content
        if(!task.description){
            return res.status(403).json({success: false, message: "Description cannot be null"})
        }
        const result = await pool.query(
            "UPDATE tasks SET description = $1 WHERE user_id = $2 AND id = $3", [task.description,user_id,task.id]
        )
        if (result.rowCount === 0){
            return res.status(404).json({success : false, message:"Task not found or not owned by the user"})
        }
        return res.status(200).json({success: true, message: "Description updated successfully."})
    }catch(err){
        console.error("Failed to update the description: ", err)
        return res.status(500).json({success: false, message: "Internal server error"})
    }
})

router.post('/actions/delete', async(req,res) => {
    const user_id = checkUserId(req,res)
    if (!user_id) return;
   
    try{
        const task = req.body.content
        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 AND user_id = $2",[task.id, user_id]
        )
        if (result.rowCount === 0){
            return res.status(404).json({success : false, message:"Task not found or not owned by the user"})
        }
        return res.status(200).json({success: true, message: "Task deleted successfully."})

    }catch (err){
        console.error("Error removing the task from database: ",err)
        return res.status(500).json({success: false, message: "Internal server error"})
    }
})

router.get('/retrieve', async(req,res) => {
    const user_id = checkUserId(req,res)
    if (!user_id) return;

    try{
        const result = await pool.query(
            "SELECT id,description, date_due AS date, status FROM tasks WHERE user_id = $1 ORDER BY creation_date DESC", [user_id]
        )

        return res.json(result.rows)
    }catch (err){
        console.error("Error retrieving tasks", err);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
   

})

router.post('/save',async (req, res) => {
    const user_id = checkUserId(req,res)
    console.log(`user_id from the /save ::${user_id}`)
    if (!user_id) return;
    
    try{
    const data = req.body.content
    
    if (!Array.isArray(data)){
        return res.status(400).send("Bad request, expected an Array object")
    }
 

   
    
    const cleanedData =  data.filter(task => (
        task.description.trim() !== 'your task') && task.description.trim() !== "" && task.date !== '').map(task => ({
        description: task.description? task.description.trim() : "",
        date: task.date,
        status: task.status === true || task.status === "true"
    }))
    const creationDate = new Date()


   const saved =  await Promise.all(cleanedData.map(Data => {
        return pool.query("INSERT INTO tasks (description, date_due ,status,user_id, creation_date) VALUES ($1,$2,$3,$4,$5) ON CONFLICT ON CONSTRAINT unique_tasks DO NOTHING RETURNING * ", [Data.description,Data.date,Data.status,user_id,creationDate ])
    }))
    const insertedTasks = saved.flatMap(r => r.rows)
    if (insertedTasks.length === 0){
        return res.status(204).json(
            {
                success:true,
                message: "Duplicate items, nothing saved."
            }
        )
    }


    return res.status(200).json({success: true, message: `successful save the following tasks: ${insertedTasks}`})

    }catch (err){
        console.error("Error saving the task data",err)
        return res.status(500).json({success: false, message: "Internal server error"})
    }
})



module.exports = router