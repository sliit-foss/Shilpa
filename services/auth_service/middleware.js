/**
 * Middleware 
 * Author: Nandun Bandara
 */
(() => {

    'use strict';

    const bodyParser = require('body-parser');
    const cors = require('cors');


    const init = app => {

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        // Allow cross-origin resource sharing
        app.use(cors());

    };

    module.exports = {
        init
    };

})();