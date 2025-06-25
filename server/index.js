const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose");
require("dotenv").config();

const app=express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("MONGODB CONNECTED")).catch(err=>console.error(err));

app.get("/",(req,res)=>{
    res.send("API IS RUNNING");
});

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server is running on PORT ${PORT}`));