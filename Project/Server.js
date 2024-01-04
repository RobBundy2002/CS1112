const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3002

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./grading_commitments.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the database');

        db.run('CREATE TABLE IF NOT EXISTS commitments (user TEXT, subject TEXT)');
    }
});

app.post('/add_commitment', (req, res) => {
    const { user, subject } = req.body;

    db.get("SELECT * FROM commitments WHERE user = ? AND subject = ?", [user, subject], (err, existingCommitment) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (existingCommitment) {
            return res.status(400).json({ message: `${user} already has a grading commitment for ${subject}.` });
        } else {
            db.run("INSERT INTO commitments (user, subject) VALUES (?, ?)", [user, subject], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                res.status(200).json({ message: `${user} has added a grading commitment for ${subject}.` });
            });
        }
    });
});

app.post('/take_over_commitment', (req, res) => {
    const { user, taker, subject } = req.body;

    db.get("SELECT * FROM commitments WHERE user = ? AND subject = ?", [user, subject], (err, existingCommitment) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (existingCommitment) {
            db.run("DELETE FROM commitments WHERE user = ? AND subject = ?", [user, subject], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                db.run("INSERT INTO commitments (user, subject) VALUES (?, ?)", [taker, subject], (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }

                    res.status(200).json({ message: `${taker} has taken over ${user}'s grading commitment for ${subject}.` });
                });
            });
        } else {
            return res.status(400).json({ message: `${user}'s grading commitment for ${subject} does not exist.` });
        }
    });
});

app.get('/view_commitments', (req, res) => {
    const { user } = req.query;

    db.all("SELECT subject FROM commitments WHERE user = ?", [user], (err, commitments) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.status(200).json(commitments.map(commitment => commitment.subject));
    });
});

app.post('/delete_commitment', (req, res) => {
    const { user, subject } = req.body;

    db.run("DELETE FROM commitments WHERE user = ? AND subject = ?", [user, subject], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.status(200).json({ message: `${user}'s grading commitment for ${subject} has been deleted.` });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
