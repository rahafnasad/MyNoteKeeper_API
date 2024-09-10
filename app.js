const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const noteRepo = require('./Repos/noteRepo');

const url = 'mongodb://localhost:27017';
const dbName = 'notes';

const app = express();
app.use(bodyParser.json());

async function main() {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const repo = noteRepo;

        // Add a new note
        app.post('/notes', async (req, res) => {
            try {
                const { title, content, creationDate } = req.body;

                // Validate the request body
                if (!title || typeof title !== 'string') {
                    return res.status(400).json({ error: 'Valid title is required' });
                }
                if (!content || typeof content !== 'string') {
                    return res.status(400).json({ error: 'Valid content is required' });
                }

                const newNote = {
                    title,
                    content,
                    creationDate: creationDate ? new Date(creationDate) : new Date()
                };

                const result = await repo.loadData([newNote], db);

                // Optionally, send back the inserted note
                const insertedNote = result.insertedIds ? result.insertedIds[0] : null;

                res.status(201).json({ message: 'Note added successfully', noteId: insertedNote });
            } catch (error) {
                res.status(500).json({ error: 'Failed to add note: ' + error.message });
            }
        });

        // Retrieve all notes with pagination
        app.get('/notes', async (req, res) => {
            try {
                const query = req.query;
                const limit = parseInt(query.limit) || 10;
                const page = parseInt(query.page) || 1;
                const skip = (page - 1) * limit;
                const result = await repo.get({}, limit, db);
                res.json(result.slice(skip, skip + limit));
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Retrieve notes by search query
        app.get('/notes/search', async (req, res) => {
            try {
                const query = req.query.query;
                const result = await repo.get({
                    $or: [
                        { title: new RegExp(query, 'i') },
                        { content: new RegExp(query, 'i') }
                    ]
                }, 0, db);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Retrieve a note by ID
        app.get('/notes/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await repo.getById(id, db);
                if (result) {
                    res.json(result);
                } else {
                    res.status(404).json({ error: 'Note not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Delete a note by ID
        app.delete('/notes/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await repo.remove(id, db);
                if (result.deletedCount > 0) {
                    res.json({ message: 'Note deleted successfully' });
                } else {
                    res.status(404).json({ error: 'Note not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Update a note by ID
        app.put('/notes/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updateData = req.body;

                // Validate the update data
                if (!updateData.title || !updateData.content) {
                    return res.status(400).json({ error: 'Title and content are required' });
                }

                const result = await repo.update(id, updateData, db);
                if (result.modifiedCount > 0) {
                    res.json({ message: 'Note updated successfully' });
                } else {
                    res.status(404).json({ error: 'Note not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.listen(3000, () => {
            console.log('Server running on http://localhost:3000');
        });

    } catch (error) {
        console.log('Error:', error);
    }
}

main();
