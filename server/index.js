import express from "express"

const app = express()

app.get("/", (_req, res) => {
    res.status(200).json({
        "message": "Hello World!!!"
    })
})

app.listen(3000, () => {
    console.log(`Server running: http://localhost:3000`);
})