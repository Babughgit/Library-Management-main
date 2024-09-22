const mysql=require('mysql2');

const db = mysql.createPool({
    host: '127.0.0.1',        // Database Host (localhost for local MySQL)
    user: 'root',             // MySQL username (use 'root' if you're using root)
    password: 'Babusql@2024', // Your MySQL root password (replace with your actual password)
    database: 'LibraryDB',    // Name of your database
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection(err=>
{
    if(err) throw err;
    console.log("connected to db");
}
)
module.exports=db;