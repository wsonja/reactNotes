import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
app.use(express.json())
app.use(cors())
app.get("/api/notes", async(req,res) =>{
    const notes = await prisma.notes.findMany();
    res.json(notes);
});
app.post("/api/notes", async(req, res) =>{
    const {title, content} = req.body;
    if(!title || !content){
        return res.status(400).send("title & content fields required");
    }
    try {
        const note = await prisma.notes.create({
            data: {title, content}
        });
        res.json(note);
    } catch (error) {
        res.status(500).send("oops smth went wrong");
    } 
});
app.put("/api/notes/:id", async(req, res)=>{
    const {title, content} = req.body;
    const id = parseInt(req.params.id);
    console.log({id});
    if(!title || !content){
        return res.status(400).send("title & content fields required");
    }
    if(!id || isNaN(id)){
        return res.status(400).send({ message: `id error` });
    }

    try{
        const updatedNote = await prisma.notes.update({where:{id}, data: {title, content},});
        res.json(updatedNote);
    }catch (error) {
        res.status(500).send({ message: `Internal Server Error.\n\n${error}` });
    }
});

app.delete("/api/notes/:id", async (req,res) =>{
    const id = parseInt(req.params.id);
    if(!id||isNaN(id)){
        return res.status(400).send("invalid ID");
    }
    try {
        await prisma.notes.delete({
            where: {id}
        })
        res.status(204).send();
    } catch (error) {
        res.status(500).send("oops smth went wrong");
    }
});

app.listen(3002, () =>{
    console.log("server running on localhost:3002");
});
