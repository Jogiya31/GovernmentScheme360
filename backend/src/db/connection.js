const sql = require("mssql");
const config = require("../config/dbConfig");

let pool;

const connectDB = async () => {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log("Database Connected");
        }
        return pool;
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    connectDB,
    sql
};