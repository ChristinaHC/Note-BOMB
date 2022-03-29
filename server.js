const express = require("express");
const path = require("path");
const fs = require("fs");
const db_notes = require("./db/db.json");
const uniqid = require("uniqid");
const { resolveSoa } = require("dns");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post("/api/notes", (req, res) => {
    const data = {
        id: uniqid(),
        title: req.body.title,
        text: req.body.text
    };
    console.log(data);
    db_notes.push(data);
    fs.writeFile("./db/db.json", JSON.stringify(db_notes), () => {
        res.send("Success!");
    });
});

app.delete("/api/notes/:id", (req, res) => {
    const params = req.params.id;
    const deleteArr = db_notes.filter(arrayContesnts => arrayContesnts.id != params);
    console.log(deleteArr);
    fs.writeFile("./db/db.json", JSON.stringify(deleteArr), () => {
        res.send("Deleted successfully!");
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index/html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}!`);
});

