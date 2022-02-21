const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { verifyToken } = require("./validation");

//swagger dependencies
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

//setup swagger 
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));


//import product routes
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const { verify } = require("jsonwebtoken");


require("dotenv-flow").config();

// parse request as json
app.use(express.json());



mongoose.connect
(
    process.env.DBHOST, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log("Error connecting to MongoDB: " + error));

mongoose.connection.once("open", () => 
console.log("Connected successfully to MongoDB"));

const PORT = process.env.PORT || 4000;

// route (get, post, put, delete (CRUD))
app.use("/api/products", verifyToken, productRoutes);
app.use("/api/user", authRoutes);



app.get("/api/welcome", (req, res) => {
    res.status(200).send({message: "Welcome Traveller, to the MEN RESTful API"});
})

//start up the server
app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT);
})

module.exports = app;