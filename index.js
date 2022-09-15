const express = require('express');
const app = express();
const formidableMiddleware = require('express-formidable');
const router = require('./routes/routes');
const cookieParser = require('cookie-parser');
const path = require('path');
const { routerAdmin, adminBro } = require('./utils/admin');

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(adminBro.options.rootPath, routerAdmin);
app.use(formidableMiddleware());

app.use(express.static(path.resolve(__dirname, 'scripts')));
app.use(express.static(path.resolve(__dirname, 'resources')));

const PORT = 3000;

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

//Return 404 if the page is not found
app.use((req, res) => {
    return res.sendStatus(404);
});