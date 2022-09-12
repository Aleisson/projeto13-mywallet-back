import express from "express";
import { json } from "express";
import cors from "cors";
import dotnev from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import dayjs from "dayjs";
import Joi from 'joi';
import bcrypt from 'bcrypt';


dotnev.config();

//- express
const app = express();
app.use(cors());
app.use(json());


// - mongo 
const mongoClient = new MongoClient(process.env.MONGO_URI);
let database;
mongoClient.connect( async () =>{
    database = await mongoClient.db("MYWALLET");
})

// - validação

const userSchema = Joi.object({

    //name, email e password

    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().required(),
    password: Joi.string().required(),

})

const valorSchema = Joi.object({

    // valor e descricao
    value: Joi.number().less(10000).greater(0).required(),
    description:Joi.string().min(3).max(30).required(),

})

// sing-up

app.post("/sign-up", async (req, res) => {

    const {name, email, password } = req.body;

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        await database.collection('users').insertOne({name, email, password: passwordHash});
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }

    

    res.sendStatus(201);

})

app.post("/sign-in", async(req, res) =>{

    const {email, password} = req.body;
   
    try {
        
        const user = await database.collection('users').findOne({email});
        console.log(user);
        if(user && bcrypt.compareSync(password, user.password)){
            console.log("Deu certo!");
        }else{
            console.log("Não deu certo!");
            return res.sendStatus(401);
            
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }

    res.sendStatus(200);

})

app.listen(5000, () => console.log("Porta 5000"));