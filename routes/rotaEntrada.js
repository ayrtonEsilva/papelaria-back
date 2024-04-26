const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require('bcrypt'); // Para hash de senha
const jwt = require('jsonwebtoken'); // Para geração de token JWT
const { res } = require("express");


mysql.query("CREATE TABLE IF NOT EXISTS entrada (id INT PRIMARY KEY AUTO_INCREMENT, id_produto INT, qtde REAL, data_entrada TEXT, valor_unitario REAL)", (createTableError) => {
    if (createTableError) {
        console.error(createTableError);
    }

    // O restante do código, se necessário...
});


router.get("/",(req,res,next)=>{
    console.log("erro linha 39")
    mysql.query(`SELECT 
    entrada.id as id,
    entrada.qtde as qtde,
    entrada.data_entrada as data_entrada,
    produto.id as id_produto,
    produto.descricao as descricao
    
    FROM entrada 
    
    INNER JOIN produto 
    ON entrada.id_produto = produto.id`,(error,rows)=>{
        
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
    mysql.query("SELECT * FROM entrada WHERE id=?",[id],(error,rows)=>{
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
    });
    



function atualizarestoque(id_produto,qtde,valor_unitario){
    mysql.query('SELECT * FROM estoque WHERE id_produto=?',[id_produto], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            })
        }
        if(rows.length>0){
            let quantidade = rows[0].quantidade;
            quantidade = parseFloat(quantidade)+parseFloat(qtde)
            mysql.query("UPDATE estoque SET quantidade=?, valor_unitario=? WHERE id_produto=?",
            [quantidade, valor_unitario, id_produto])
            
        }else{
            mysql.query(`INSERT INTO estoque (id_produto, quantidade, valor_unitario) VALUES (?, ?, ?)`, [id_produto, qtde, valor_unitario], function (insertError) {

                if (insertError) {
                    return res.status(500).send({
                        error: insertError.message
                    });
                }
            
                // O restante do código, se necessário...
            });
        }
    });
    return true;
}
router.post('/', (req, res, next) => {
  
    mysql.query("CREATE TABLE IF NOT EXISTS entrada (id INT PRIMARY KEY AUTO_INCREMENT, id_produto INT, qtde REAL, data_entrada TEXT, valor_unitario REAL)", (createTableError) => {
        if (createTableError) {
            return res.status(500).send({
                error: createTableError.message
            });
        }
    });

    const { id_produto, qtde, data_entrada, valor_unitario } = req.body;
    
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
    
            // Insere o novo usuário no banco de dados
            mysql.query(`INSERT INTO entrada (id_produto, qtde, data_entrada, valor_unitario) VALUES (?, ?, ?, ?)`, [id_produto, qtde, data_entrada, valor_unitario ], function (insertError) {
            console.log(insertError)
                if (insertError) {
                    return res.status(500).send({
                        error: insertError.message,
                        response: null
                    });
                }
                atualizarestoque(id_produto,qtde,valor_unitario)
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
  

router.put("/",(req,res,next)=>{
    const {id,id_produto, qtde, data_entrada, valor_unitario } = req.body;
    mysql.query("UPDATE produto SET id_produto=?,qtde=?,data_entrada=?,valor_unitario=? WHERE id=?",
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
   
    mysql.query("DELETE FROM entrada WHERE id= ?",id,(error)=>{
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