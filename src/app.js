import express from "express";
import { json } from "express";
import cors from "cors";
import dotnev from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import dayjs from "dayjs";
import Joi from 'joi';

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
    email: Joi.string().required,
    password: Joi.string().required,

})

const valorSchema = Joi.object({

    // valor e descricao
    value: Joi.number().less(10000).greater(0).required(),
    description:Joi.string().min(3).max(30).required(),

})

// sing-up

app.post("/sign")