import express from "express";
import pg from "pg";
const app = express();
const port = 3000;
const { Pool } = pg;

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true, 
    })
    
)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'towinnadzul09122005',
    port: 5432,
})

// GET all data
app.get('/', (req, res) => {
    console.log("TEST DATA :");
    
        pool.query('SELECT * FROM biodata ORDER BY id') 
            .then(results => {
                res.send(results.rows);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Internal Server Error');
            });
});

//POST data
app.post('/biodata', (req, res) => {
    const {id, nama, nim, kelas } = req.body;

    pool.query(
        'INSERT INTO biodata(id, nama, nim, kelas) VALUES($1, $2, $3, $4)', 
        [id, nama, nim, kelas]
    )
        .then(results => res.json(results.rows[0]))
        .catch(err => console.error(err));
});

// PUT (update data)
app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;

    pool.query(
        'UPDATE biodata SET nama=$1, nim=$2, kelas=$3 WHERE id=$4 RETURNING *',
        [nama, nim, kelas, id]
    )
        .then(results => {
            if (results.rowCount === 0) {
                return res.status(404).json({ 
                    message: 'Data tidak ditemukan' 
                });
            }
        
            res.json({
                    message: 'Data berhasil diupdate',
                    data: results.rows[0]
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('internal server ERROR');
        });
});

// DELETE data (hapus data)
app.delete('/biodata/:id', (req, res) => {
    const { id } = req.params;

    pool.query(
        'DELETE FROM biodata WHERE id=$1 RETURNING *',
        [id]
    )
        .then(results => {
            if (results.rowCount === 0) {
                return res.status(404).json({
                    message: 'Data tidak ditemukan'
                });
            }
            res.json({
                message: 'Data berhasil dihapus',
                data: results.rows[0]
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});