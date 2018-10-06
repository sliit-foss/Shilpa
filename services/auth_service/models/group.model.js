'use strict'

// Dependencies
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({

    groupName: {type: String, require: true, unique:true},
    description: {type: String, require: true},
    allowedSections: [{

        sectionName: {type: String, require: true}

    }],
    members: [{

        username: {type: String, require: true},
        email: {type: String, require: true}

    }]

});

module.exports = mongoose.model('Group', GroupSchema);