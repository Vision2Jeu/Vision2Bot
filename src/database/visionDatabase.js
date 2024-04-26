const sqlite3 = require('sqlite3').verbose();

// todo: Maybe the folder do not exist, I'm still on it...
const databasePath = './var/file.db';

// The class is called that to avoid confusion with another sqlite3.Database
class VisionDatabase {

    static #db = null;

    static getInstance() {
        if (VisionDatabase.#db !== null) {
            return VisionDatabase.#db;
        }

        VisionDatabase.#db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {	if (err) {
            console.error('Error opening database', err.message);
          } else {
            console.log('Database created successfully');
          }
        });

        return VisionDatabase.#db;
    }

    close() {
        if (VisionDatabase.#db === null) {
            console.warn("The database was not opened");
            return;
        }

        VisionDatabase.#db.close();

        Database.#db = null;
    }

    static query(sql, params = []) {
        return new Promise((resolve, reject) => {
            Database.getInstance().all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Error executing SQL query', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

}

module.exports = VisionDatabase;

/*
db.serialize(() => {
    //VisionDatabase.#db.close();VisionDatabase.#db.close();VisionDatabase.#db.close();
    db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
        console.log(row.id + ": " + row.info);
    });
});

db.close();
*/
