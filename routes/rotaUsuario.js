const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose(); 
const db = new sqlite3.Database("database.db");
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
    db.all("SELECT * FROM usuario",(error,rows)=>{
        if(error){
            return res.status(500).send({
                error:error.message
            });
        }
        res.status(200).send({
            mensagem:"Aqui está a lista de usuários",
            usuarios:rows
        })
    });
    
});
router.get("/:id",(req,res,next)=>{
    const {id} = req.params
    db.all("SELECT * FROM usuario WHERE id=?",[id],(error,rows)=>{
        if(error){
            return res.status(500).send({
                error:error.message
            });
        }
        console.log(rows)
        res.status(200).send({
            mensagem:"Aqui está a lista de usuários",
            usuario:rows
        })
    });
    
});
router.get("/nomes",(req,res,next)=>{
    let nomes = [];
    usuario.map((linha)=>{
        nomes.push({
            nome:linha.nome,
            email:linha.email
        });
    })
    res.json(nomes);
})
router.post("/login", (req, res, next) => {
    const { email, senha } = req.body;

    db.all(`SELECT id, nome, email FROM usuario WHERE email = ? and senha = ?`, [email, senha], (error, rows) => {
        if (error) {
            console.error(error.message);
            return res.status(500).send({
                error: error.message
            });
        }
        console.log(rows);
        if (rows.length > 0) {
            res.status(200).send({
                mensagem: "Dados de login estão corretos",
                usuario: rows[0]
            });
        } else {
            res.status(401).send({
                mensagem: "Credenciais inválidas"
            });
        }
    });
});

router.post("/",(req,res,next)=>{
    
    const {nome, email, senha} = req.body;
    db.serialize(()=>{
        db.run("CREATE TABLE IF NOT EXISTS usuario(id INTEGER PRIMARY KEY AUTOINCREMENT,nome TEXT, email TEXT UNIQUE, senha TEXT)");
        const insertUsuario = db.prepare("INSERT INTO usuario(nome,email,senha) VALUES(?,?,?)");
        insertUsuario.run(nome,email,senha);
        insertUsuario.finalize();
    })

    process.on("SIGINT",()=>{
        db.close((err)=>{
            if(err){
                returnres.status(304).send(err.message);
            }
        })
    })
    console.log(nome);   


   
    res.status(200).send({mensagem:"Salvo com sucesso"});
})
router.put("/",(req,res,next)=>{
    const {id,nome,email,senha} = req.body;
    db.run("UPDATE usuario SET nome=?,email=?,senha=? WHERE id=?",
    [nome,email,senha,id],function(error){
        if(error){
            return res.status(500).send({
                error:error.message
            });
        }
        res.status(200).send({
            mensagem:"Cadastro alterado com sucesso!!",
            
        })
    });                                                      
   
})
router.delete("/:id",(req,res,next)=>{
    const {id} = req.params
   
    db.run("DELETE FROM usuario WHERE id= ?",id,(error)=>{
        if(error){
            return res.status(500).send({
                error:error.message
            });
        }
        res.status(200).send({
            mensagem:"Cadastro deletado com sucesso!!"
        })
    })
    
})

module.exports = router;