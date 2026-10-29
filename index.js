const express = require("express")
const mysql = require("mysql2/promise")
const app = express()

app.use(express.json())

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "centraljogos",
    waitForConnections: true
})


app.get("/generos", async (req,res) => {
    const [generos] = await db.execute("SELECT * FROM generos")
    return res.json(generos)
})

app.post("/generos", async (req,res) => {
    const {nome,descricao} = req.body

    if(!nome || !descricao){
        return res.status(400).json ({error: "Nome e descrição são obrigatórios!"})
    }

    const [resultado] = await db.execute(
        "INSERT INTO generos(nome,descricao) VALUES (?,?)",
        [nome,descricao]
    )

    return res.status(201).json({id: resultado.insertId, nome, descricao})
})

app.delete("/generos/:id", async (req,res) => {
    const id = req.params.id 

    const [resultado] = await db.execute(
        "DELETE FROM generos WHERE id = ?",
        [id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({error: "Jogo não encontrado!"})
    }

    return res.status(204).end()
})

//jogos

app.get("/jogos", async (req,res) => {
    const [jogos] = await db.execute("SELECT * FROM jogos")
    return res.json(jogos)
})

app.post("/jogos", async (req,res) => {
    const {id_genero,nome,desenvolvedora,sinopse} = req.body

    if(!nome || !desenvolvedora || !sinopse){
        return res.status(400).json ({error: "Nome, desenvolvedora e sinopse são obrigatórios!"})
    }

    const [resultado] = await db.execute(
        "INSERT INTO jogos(id_genero,nome,desenvolvedora,sinopse) VALUES (?,?,?,?)",
        [id_genero,nome,desenvolvedora,sinopse]
    )

    return res.status(201).json({id: resultado.insertId, id_genero, nome, desenvolvedora, sinopse})
})

app.delete("/jogos/:id", async (req,res) => {
    const id = req.params.id 

    const [resultado] = await db.execute(
        "DELETE FROM jogos WHERE id = ?",
        [id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({error: "Curso não encontrado!"})
    }

    return res.status(204).end()
})

app.put("/jogos/:id", async (req,res) => {
    const {nome,desenvolvedora,sinopse, id_genero} = req.body
    const id = req.params.id

    if(!nome|| !desenvolvedora || !sinopse || !id_genero){
        return res.status(400).json({error: "Nome, desenvolvedora, sinopse e id_genero são obrigatórios!"})
    }

    const [resultado] = await db.execute(
        "UPDATE jogos SET nome = ?, desenvolvedora = ?, sinopse = ?, id_genero = ? WHERE id = ?",
        [nome,desenvolvedora, sinopse, id_genero, id]
    )

    if(resultado.affectedRows === 0){
        return res.status(404).json({error: "Jogo não encontrado"})
    }

    return res.json({id, nome, desenvolvedora, sinopse, id_genero})

})

app.listen(3000, () => console.log("API no ar =D"))