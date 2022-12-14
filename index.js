const express=require("express")
const app=express()
const cors=require("cors")
const path=require("path")
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.KEY,
});
const openai = new OpenAIApi(configuration);


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get("/",(req,res)=>{
 res.send("server working....")
    // res.sendFile( path.resolve(__dirname,"./Aiwebsite/dist/index.html") )
})
app.get("/image/:url", async(req,res)=>{
    const url = req.params.url;
    console.log(url)
    try { 
   
      let iUrl = await getImage(url);
      res.json(iUrl);
    } catch (e) {
      console.log(e.message);
      res.status(500).json("Internal Server Error");
    } 
   
})
app.get("/text/:text", async(req,res)=>{
    const text = req.params.text;
   try{
    let iUrl = await getChat(text);


    res.json(iUrl)  
   }
   catch(e){
    console.log(e.message);
      res.status(500).json("Internal Server Error");
   } 
      
})



async function getImage(text){   
const response = await openai.createImage({
  prompt: text,
  n: 1,
  size: "512x512",
});
image_url = response.data.data[0].url;

return image_url
}
async function getChat(text){
  
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt:text,
  temperature: 0.5,
  max_tokens: 60,
  top_p: 1.0,
  frequency_penalty: 0.5,
  presence_penalty: 0.0,
  stop: ["You:"],
});
 let data=response.data.choices[0].text
return data
}




app.listen(3000,()=>{
    console.log("running....");   
})