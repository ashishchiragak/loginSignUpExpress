const express             =   require('express'),
    bodyParse           =   require('body-parser'),
    app                 =   express(),
    multipart           =   require('connect-multiparty'),
    server              =   require('http').Server(app),
    swaggerUi           =   require('swagger-ui-express'),
    swagger             =   require('./Config/swagger'),
    cors                =   require('cors');
global.Joi                =   require('joi');
global.DAO                =   require('./DAOManager').queries;
global.path                =   require('path');
global.Mongoose            =   require('mongoose');
global.ObjectId = Mongoose.Types.ObjectId;
global.Config = require('./Config');
global.ERROR = Config.responseMessages.ERROR;
global.SUCCESS = Config.responseMessages.SUCCESS;
let bootstrap= require('./Libs/bootstrap');
// global.path = __dirname;
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 400 // limit each IP to 400 requests per windowMs
});

app.use(cors({credentials: true, origin: true}));
app.use(bodyParse.json({limit:'100mb'}));
app.use(bodyParse.urlencoded({limit:'100mb',extended:true}));
// app.post('/common/uploadFile', tokenVerification, commonController.uploadFile);
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swagger));
require('./Routes/userRoutes')(app);
app.set('port',process.env.PORT || 3000);
app.use(limiter);
app.use('/', express.static(path.join(__dirname, 'public')));
app.use((err, req, res, next) => {
    // Do logging and user-friendly error message display
    console.log(err, "********** ERROR GLOBALLY ***************");
    res.status(500).json();
});

Mongoose.Promise = global.Promise;

bootstrap.run();
server.listen(app.get('port'),function() {
    console.log('Node app is running on port', app.get('port'));
});