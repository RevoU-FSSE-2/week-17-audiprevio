
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoose_delete = require('mongoose-delete');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml')
const fs = require('fs')
const OpenApiValidator = require('express-openapi-validator');
const securityMiddleware = require('./middleware/securityMiddleware');
const helmet = require('helmet');
const functions = require('firebase-functions');
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");


require('dotenv').config();
const express = require('express');
const app = express()


const openApiPath = './openapi.yaml'
const file = fs.readFileSync(openApiPath, 'utf8')
const swaggerDocument = yaml.parse(file)

app.use(cors());

app.use(helmet.frameguard({ action: 'deny' }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());
app.use(OpenApiValidator.middleware({
    apiSpec: openApiPath,
    validateRequests: true
}))

app.use((req, res, next) => {
    console.log("<========= sending request =====")
    next()
})

mongoose.connect(process.env.MONGO_URI);

const authMiddleware = require('./middleware/authMiddleware');
const penguinController = require('./controllers/penguinController');
const adminController = require('./controllers/adminController');
const performanceDataController = require("./controllers/performanceDataController");
const roleCheck = require('./middleware/roleCheck');

app.post('/admin/createadmin', securityMiddleware, adminController.createAdmin); // ✅   // ---> need auth as superadmin //authMiddleware, roleCheck(['superadmin'])
app.get('/admin/getadmin',  securityMiddleware, authMiddleware, roleCheck(['superadmin']), adminController.getAdmin); // ✅  // --> need auth as superadmin
app.delete('/admin/softdeleteadmin/:id', securityMiddleware, authMiddleware, roleCheck(['superadmin']), adminController.softDeleteAdmin); // ✅  // ---> need auth as superadmin
app.put('/admin/updateadminpassword/:id', securityMiddleware, adminController.updateAdminPassword);
app.post('/admin/login', securityMiddleware, adminController.loginAdmin); // ✅

app.get('/admin/penguins', securityMiddleware, penguinController.getAllPenguinData); // ✅
app.post('/admin/penguins/addpenguin', securityMiddleware, penguinController.addPenguinData); 
app.put('/admin/penguins/edit/:id', authMiddleware, penguinController.updatePenguinData);// ✅
app.delete('/admin/penguins/softdeletepenguin/:id', authMiddleware, penguinController.softDeletePenguin);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        erros: err.errors
    })
})

console.log('Successfully saved all changes.');

// app.listen(3000, '0.0.0.0', function (){
//     console.log('Connection Established. Server is Running on Port 3000.');
// });

exports.week_17_audi = functions.https.onRequest(app);
//0.0.0.0:3000