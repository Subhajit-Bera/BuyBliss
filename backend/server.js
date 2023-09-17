const app = require("./app");

const dotenv=require("dotenv");
const connectDatabase=require("./config/database");


//Config : for knowing the server the PORT number define in config folder
dotenv.config({path:"backend/config/config.env"})


//Connecting to database (Always connect it after config otherwise it would not find process.env)
connectDatabase();


app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});