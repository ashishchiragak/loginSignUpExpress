let UniversalFunctions = require('./UniversalFunctions'),
    Models = require('../Models')
    // DAO = require('../DAOManager')
;

Mongoose.connect(process.env.URL || 'mongodb://localhost:27017/test',{ useNewUrlParser: true, useCreateIndex: true });
Mongoose.connection.on('error',function(err){
    console.log(" mongo db connection terminate "+ err);
    process.exit();
});
Mongoose.connection.once('open',function(){
    console.log('Successfully connected to database');
});

function run(){
    createAdmin();
}

async function createAdmin() {
    try {

        let password = UniversalFunctions.hashString('qwerty');

        let adminData = [
            {
                name:'node',
                email:'node@cb.com',
                superAdmin: true,
                password:password
            }
        ];

        for (let i=0; i<adminData.length; i++){
            let get = await DAO.getDataOne(Models.Admins,{email:adminData[i].email},{},{});
            if(!get){
                DAO.saveData(Models.Admins,adminData[i]);
            }
        }
        console.log('admin Bootstrap Completed');
    }catch (e) {
        console.log(e,'eeeeeeeeeee');
        throw e;
    }
}



module.exports = {
    run:run
}