const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    cells: [{
        cell: {
            type: Number,
            required: true
        },
        classification: {
            type: String,
            required: true
        }
    }]
});

imgSchema.methods.cleanup = function() {
    return {
        id: this.id,
        cells: this.cells.map(c => ({
            cell: c.cell,
            classification: c.classification
        }))
        }
    }

const Image = mongoose.model('Image', imgSchema);

module.exports = Image;