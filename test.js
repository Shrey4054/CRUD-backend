const { Pool} = require('pg')

const pool = new Pool({
  user: 'dbuser',
  host: 'localhost',
  database: 'university',
  password: 'my@PSWD123',
  port: 5432:5432,
});


try{
    pool.connect();
    console.log("connected")
}catch (err){
    console.error(err)
}




