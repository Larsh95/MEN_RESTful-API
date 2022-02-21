const router = require("express").Router();
const product = require("../models/product");


// CRUD

// Create specific product -- post
router.post("/", (req, res) => {
    data = req.body;
    product.insertMany(data) 
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send({ message: err.message }); })
});

// /api/products/
// Read all products -- get
router.get("/", (req, res) => {
    product.find()
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send({ message: err.message }); })
});

// Read all products in stock -- get
router.get("/instock", (req, res) => {
    product.find({ inStock: true })
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send({ message: err.message }); })
});


// Read specific product -- get
router.get("/:id", (req, res) => {
    product.findById(req.params.id)
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send({ message: err.message }); })
});


// Update specific product -- put
router.put("/:id", (req, res) => {
    const id = req.params.id;

    product.findByIdAndUpdate(id, req.body)
    .then(data => { 
        if(!data) 
        {
            res.status(404).send({ message: "Cannot update Product with ID:" + id + ". Maybe product was not found!"})
        }
        else
        {
            res.send({ message: "Product was successfully updated."})
        }
    })
    .catch(err => { res.status(500).send({ message: "Error updating product with ID:" + id }); })
});

// Delete specific product -- delete
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    product.findByIdAndDelete(id)
    .then(data => { 
        if(!data) 
        {
            res.status(404).send({ message: "Cannot delete Product with ID:" + id + ". Maybe product was not found!"})
        }
        else
        {
            res.send({ message: "Product was successfully deleted."})
        }
    })
    .catch(err => { res.status(500).send({ message: "Error deleting product with ID:" + id }); })
});

module.exports = router;