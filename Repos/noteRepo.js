const { ObjectId } = require('mongodb');

const noteRepo = {
    // Load data into the database
    async loadData(data, db) {
        try {
            const notes = data.map(note => ({
                title: note.title || 'Untitled',
                content: note.content || '',
                creationDate: note.creationDate || new Date()
            }));
            const results = await db.collection('notes').insertMany(notes);
            return results;
        } catch (error) {
            throw new Error('Error inserting data: ' + error.message);
        }
    },

    // Get data from the database (with optional query and limit)
    async get(query = {}, limit = 0, db) {
        try {
            let items = db.collection('notes').find(query);
            if (limit > 0) {
                items = items.limit(limit);
            }
            return await items.toArray();
        } catch (error) {
            throw new Error('Error fetching data: ' + error.message);
        }
    },

    // Get data by ID
    async getById(id, db) {
        try {
            const item = await db.collection('notes').findOne({ _id: ObjectId(id) });
            return item;
        } catch (error) {
            throw new Error('Error fetching data by ID: ' + error.message);
        }
    },

    // Remove data by ID
    async remove(id, db) {
        try {
            const result = await db.collection('notes').deleteOne({ _id: ObjectId(id) });
            return result;
        } catch (error) {
            throw new Error('Error removing data by ID: ' + error.message);
        }
    },

    // Update data by ID
    async update(id, updateData, db) {
        try {
            // Ensure update data contains title, content, and creationDate
            const result = await db.collection('notes').updateOne(
                { _id: ObjectId(id) },
                { $set: {
                    title: updateData.title || '',
                    content: updateData.content || '',
                    creationDate: updateData.creationDate || new Date()
                } }
            );
            return result;
        } catch (error) {
            throw new Error('Error updating data by ID: ' + error.message);
        }
    }
};

module.exports = noteRepo;
