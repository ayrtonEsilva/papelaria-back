const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose(); 
const db = new sqlite3.Database("database.db");


// Criação da tabela de estoque no banco de dados, caso não exista
db.run("CREATE TABLE IF NOT EXISTS estoque (id INTEGER PRIMARY KEY AUTOINCREMENT, id_produto INTEGER, quantidade REAL, valor_unitario REAL)", (createTableError) => {
    if (createTableError) {
        return res.status(500).send({
            error: createTableError.message
        });
    }
});


router.get("/",(req,res,next)=>{
    console.log("erro linha 39")
    db.all("SELECT * FROM produto",(error,rows)=>{
        
        if(error){
            console.log(error)
            return res.status(500).send({
                error:error.message
            });
        }
        res.status(200).send({
            mensagem:"Aqui está a lista de produto",
            produto:rows
        })
    });
    
});
router.get("/:id",(req,res,next)=>{
    console.log("erro linha 56")
    const {id} = req.params
    db.all("SELECT * FROM produto WHERE id=?",[id],(error,rows)=>{
        if(error){
            return res.status(500).send({
                error:error.message
            });
        }
        console.log(rows)
        res.status(200).send({
            mensagem:"Aqui está a lista de produto",
            produto:rows
        })
    });
    
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
    db.run("CREATE TABLE IF NOT EXISTS produto (id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT, descricao TEXT, estoque_minimo REAL, estoque_maximo REAL)", (createTableError) => {
        if (createTableError) {
            return res.status(500).send({
                error: createTableError.message
            });
        }
    
        // O restante do código, se necessário...
    });

    const { status, descricao, estoque_minimo, estoque_maximo } = req.body;
 

    // Validação dos campos
    let msg = [];
    var regex = /^[0-9]+$/
    if (!status) {
        console.log("status deu merda")
        msg.push({ mensagem: "Status inválido! Não pode ser vazio." });
    }
    console.log("erro linha 95")
    if (!descricao || descricao.length < 3) {
        console.log("descrição deu merda")
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
    console.log("erro linha 113")
    // Verifica se o email já está cadastrado
    db.get(`SELECT * FROM produto WHERE descricao = ?`, [descricao], (error, produtoExistente) => {
        if (error) {
            console.log(error)
            return res.status(500).send({
                error: error.message,
                response: null
            });
        }

        if (produtoExistente) {
            console.log("Produto já cadastrado.")
            return res.status(400).send({
                mensagem: "Produto já cadastrado."
            });
        }
        console.log("141")

            // Insere o novo usuário no banco de dados
            db.run(`INSERT INTO produto (status, descricao, estoque_minimo, estoque_maximo) VALUES (?, ?, ?, ?)`, [status, descricao, estoque_minimo, estoque_maximo ], function (insertError) {
            console.log(insertError)
                if (insertError) {
                    return res.status(500).send({
                        error: insertError.message,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: "Produto cadastrado com sucesso!",
                    produto: {
                        id: this.lastID,
                        status: status,
                        descricao: descricao,
                        estoque_minimo : estoque_minimo,
                        estoque_maximo : estoque_maximo
                    }
                });
            });
        });
    });

router.put("/",(req,res,next)=>{
    const {status,descricao,estoque_minimo,estoque_maximo} = req.body;
    db.run("UPDATE produto SET status=?,descricao=?,estoque_minimo=?,estoque_maximo=? WHERE id=?",
    [status,descricao,estoque_minimo,estoque_maximo],function(error){
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
   
    db.run("DELETE FROM produto WHERE id= ?",id,(error)=>{
        if(error){
            return res.status(500).send({
                error:error.message
            });
        }
        res.status(200).send({
            mensagem:"Produto deletado com sucesso!!"
        })
    })
    
})

module.exports = router;