import app from "./app.js";

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at ${process.env.PORT}`);
})