import express from "express";

const app = express();

app.get('/api/v1/Home',(req,res)=>{
    res.json({
        App_Name:" Second Brain App"
    })
})

app.listen(3000,()=>{
    console.log("Listening at port 3000....")
})