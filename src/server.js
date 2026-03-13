import express from 'express'; 
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/routes/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

//Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url); // (import.meta.url) gives URL of current file, then fileTOURL makes it normal path

//Get the directory name from the file path
const __dirname = dirname(__filename); // gives the folder name of the file

const rootDir = path.join(__dirname, '..');
const publicPath = path.join(rootDir, 'public');

//Middleware 
app.use(express.json());

//Serves the HTML file from /public library
//tells express to serve all the files from the public folder as static assets
app.use(express.static(publicPath));
//Serving up the HTML file from the /public director
app.get('/', (req,res)=>{
    res.sendFile(path.join(publicPath, 'index.html'))// constructs the full path to index.html (chapter_3/public/index.html)
})


//Route 
app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

app.listen(PORT, ()=>{
    console.log(`Server has started on port ${PORT}`)
})

