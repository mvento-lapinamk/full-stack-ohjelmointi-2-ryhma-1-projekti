
import {Router} from "express"

const articles = Router()

articles.use((req, res, next) => {
    console.log(req.baseUrl)

    next()
})

// Hae kaikki artikkelit
articles.get("/", (req, res) => { // Hae kaikki artikkelit
    res.send({
        title: "Otsikko",
        content: "Artikkelin sisältö",
        kirjoittaja: "Kirjuri"
    })

}).get("/{:id}", (req, res) => { // Hae yhden artikkelin tiedot
    res.send("Yhden artikkelin tiedot", req.params.id)
    
}).post("/", (req, res) => { // Luo artikkelit
    res.send("Artikkelin luonti")

}).put("/{:id}", (req, res) => { // Artikkelin muokkaus
    res.send("Muokkaa artikkelia")

}).patch("/{:id}", (req, res) => { // Artikkelin muokkaus
    res.send("Muokkaa artikkelia")

}).delete("/{:id}", (req, res) => {
    res.send({
        id: req.params.id,
        deleted: true
    })
})

export default articles
