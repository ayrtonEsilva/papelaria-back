const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose(); 
const usuario = [
    {
    id:1,
    nome: "ayrton",
    email: "ayrton@gmail.com",
    senha: "123"
    },
    {    
    id:2,
    nome: "Bleno",
    email: "Bleno@gmail.com",
    senha: "123"
    },
    {
    id:3,
    nome: "Carlinhos",
    email: "carlinhos@gmail.com",
    senha: "123"
    },
    {
    id:4,
    nome: "Nero",
    email: "Nero@gmail.com",
    senha: "123"
    }

]
router.get("/",(req,res,next)=>{
    res.json(usuario)
});
router.get("/nomes",(req,res,next)=>{
    let nomes = [];
    usuario.map((linha)=>{
        nomes.push({
            nome:linha.nome,
            email:linha.email
        })
    })
    res.json(nomes)
})
router.post("/",(req,res,next)=>{
    const db = new sqlite3.Database("database.db")
    const {nome, email, senha} = req.body;
    db.serialize(()=>{
        db.run("CREATE TABLE IF NOT EXISTS usuario(id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT  UNIQUE, senha TEXT)");
        const insertusuario = db.prepare("INSERT INTO usuario(nome,email,senha) VALUES(?,?,?)") ;
        insertusuario.run(nome,email,senha);
        insertusuario.finalize();
    })
    console.log(nome);   
   
    res.status(200).send({mensagem:"Salvo com sucesso"})
})
router.put("/",(req,res,next)=>{
    const id = req.body.id;
                                                                          
   
    res.status(404).send({id:id});
})
router.delete("/:id",(req,res,next)=>{
    const id = req.body.id;
  
   
    res.send({id:id});
})

module.exports = router;