const app = require("./app");

const dotenv=require("dotenv");


//Config : for knowing the server the PORT number define in config folder
dotenv.config({path:"backend/config/config.env"})

app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});