const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose(); 
const db = new sqlite3.Database("database.db");
const bcrypt = require('bcrypt'); // Para hash de senha
const jwt = require('jsonwebtoken'); // Para geração de token JWT


db.run("CREATE TABLE IF NOT EXISTS entrada (id INTEGER PRIMARY KEY AUTOINCREMENT, id_produto INTEGER, qtde REAL, data_entrada TEXT, valor_unitario REAL)", (createTableError) => {
    if (createTableError) {
        return res.status(500).send({
            error: createTableError.message
        });
    }

    // O restante do código, se necessário...
});


router.get("/",(req,res,next)=>{
    console.log("erro linha 39")
    db.all("SELECT * FROM entrada INNER JOIN produto ON entrada.id_produto = produto.id",(error,rows)=>{
        
        if(error){
            console.log(error)
            return res.status(500).send({
                error:error.message
            });
        }
        res.status(200).send({
            mensagem:"Aqui está a lista de entradas de produtos",
            entrada:rows
        })
    });
    
});
router.get("/:id",(req,res,next)=>{
    console.log("erro linha 56")
    const {id} = req.params
    db.all("SELECT * FROM entrada WHERE id=?",[id],(error,rows)=>{
        if(error){
            return res.status(500).send({
                error:error.message
            });
        }
        console.log(rows)
        res.status(200).send({
            mensagem:"Aqui está a entrada solicitada",
            entrada:rows
        })
    });
    

// router.get("/nomes",(req,res,next)=>{
//     let nomes = [];
//     produto.map((linha)=>{
//         nomes.push({
//             nome:linha.nome,
//             email:linha.email
//         });
//     })
//     res.json(nomes);
// })


router.post('/', (req, res, next) => {
    db.run("CREATE TABLE IF NOT EXISTS entrada (id INTEGER PRIMARY KEY AUTOINCREMENT, id_produto INTEGER, qtde REAL, data_entrada TEXT, valor_unitario REAL)", (createTableError) => {
        if (createTableError) {
            return res.status(500).send({
                error: createTableError.message
            });
        }
    
        // O restante do código, se necessário...
    });

    const { id_produto, qtde, data_entrada, valor_unitario } = req.body;
 

    //Validação dos campos
    let msg = [];
    var regex = /^[0-9]+$/
    if (!id_produto) {
        
        msg.push({ mensagem: "Status inválido! Não pode ser vazio." });
    }
    
    if (!qtde || qtde.length == 0) {
        msg.push({ mensagem: "descrição inválida!" });
     }
    // if (regex.test(estoque_minimo)){
    //     msg.push({ mensagem: "Este campo aceita somente números." });
    // }
    // if (regex.test(estoque_maximo)){
    //     msg.push({ mensagem: "Este campo aceita somente números." });
    // }
   
    if (msg.length > 0) {
        console.log("Falha ao cadastrar produto.")
        return res.status(400).send({
            mensagem: "Falha ao cadastrar produto.",
            erros: msg
        });
    }
    
    // Verifica se o email já está cadastrado
    // db.get(`SELECT * FROM produto WHERE descricao = ?`, [descricao], (error, produtoExistente) => {
    //     if (error) {
    //         console.log(error)
    //         return res.status(500).send({
    //             error: error.message,
    //             response: null
    //         });
    //     }

    //     if (produtoExistente) {
    //         console.log("Produto já cadastrado.")
    //         return res.status(400).send({
    //             mensagem: "Produto já cadastrado."
    //         });
    //     }
    //     console.log("141")

            // Insere o novo usuário no banco de dados
            db.run(`INSERT INTO entrada (id_produto, qtde, data_entrada, valor_unitario) VALUES (?, ?, ?, ?)`, [id_produto, qtde, data_entrada, valor_unitario ], function (insertError) {
            console.log(insertError)
                if (insertError) {
                    return res.status(500).send({
                        error: insertError.message,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: "Entrada cadastrada com sucesso!",
                    entrada: {
                        id: this.lastID,
                        qtde: qtde,
                        data_entrada : data_entrada,
                        valor_unitario : valor_unitario
                    }
                });
            });
        });
     });

router.put("/",(req,res,next)=>{
    const {id,id_produto, qtde, data_entrada, valor_unitario } = req.body;
    db.run("UPDATE produto SET id_produto=?,qtde=?,data_entrada=?,valor_unitario=? WHERE id=?",
    [id_produto, qtde, data_entrada, valor_unitario, id ],function(error){
        if(error){
            return res.status(500).send({
                error:error.message
            });
        }
        res.status(200).send({
            mensagem:"Produto alterado com sucesso!!",
            
        })
    });                                                      
   
})
router.delete("/:id",(req,res,next)=>{
    const {id} = req.params
   
    db.run("DELETE FROM entrada WHERE id= ?",id,(error)=>{
        if(error){
            return res.status(500).send({
                error:error.message
            });
        }
        res.status(200).send({
            mensagem:"Entrada deletada com sucesso!!"
        })
    })
    
})

module.exports = router;