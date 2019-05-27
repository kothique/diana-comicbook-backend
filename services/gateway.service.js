'use strict';

const ApiGateway = require('moleculer-web');
const asyncBusboy = require('async-busboy');

module.exports = {
	name: 'api',
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		use: [
			async (req, res, next) => {
				try {
					const { files, fields } = await asyncBusboy(req);
					Object.assign(req.body, fields);
					files.forEach(file => req.body[file.fieldname] = file);
				} catch (error) {
					// ignore
				} finally {
					next();
				}
			}
		],

		cors: {
			origin: '*',
			methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
			allowedHeaders: '*',
			//exposedHeaders: '*',
			credentials: true,
			maxAge: null
		},

		routes: [{
			path: '/api',
			whitelist: [/.*/],
			aliases: {
			},
			bodyParsers: {
				json: true
			}
		}],

		// Serve assets from 'public' folder
		assets: {
			folder: 'public'
		}
	}
};
