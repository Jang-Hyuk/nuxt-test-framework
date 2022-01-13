const route = require('express').Router();

/**
 * Explain why they are here
 */
route.get('/', (req, res) => {
	res.status(200).end();
});

module.exports = route;
