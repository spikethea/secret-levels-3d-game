import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
let app = express();
const PORT = 5000;


app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

const __dirname = dirname(fileURLToPath(import.meta.url));

//setting middleware
app.use(express.static(__dirname + '/public')); //Serves resources from public folder
app.use(express.static(__dirname + '/node_modules')); //Serves resources from public folder

app.use('/three', express.static(__dirname + '/node_modules/three'));// Roruting the express server to three.js 
