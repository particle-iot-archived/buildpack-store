let path = require('path');
let fs = require('fs');
require('dotenv').config({silent: true});
let glob = require('glob');
let _ = require('lodash');
let bluebird = require('bluebird');

// Set up Redis client
let redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
let client = redis.createClient(process.env.REDIS_URL);
client.on('error', err => {
	console.error(`Redis error ${err}`);
	process.exit(1);
});

// Check environment
if (!process.env.INPUT_DIR) {
	console.error('INPUT_DIR env variable is empty. ' +
		'Are you running this outside of buildpack?');
	process.exit(2);
}
if (!process.env.DRAY_JOB_ID) {
	console.error('DRAY_JOB_ID env variable is empty. ' +
		'Are you running this outside of Dray job?');
	process.exit(3);
}
if (!process.env.REDIS_EXPIRE_IN) {
	// 10 minutes
	process.env.REDIS_EXPIRE_IN = 60 * 10;
}

// Collect all resulting files...
let inputDir = process.env.INPUT_DIR;
if (!_.endsWith(inputDir, path.sep)) {
	inputDir += path.sep;
}
let files = glob.sync(`${inputDir}*`);
let promises = [];
// ...and store them in Redis
for (file of files) {
	let filename = file.replace(inputDir, '');
	let key = `${process.env.DRAY_JOB_ID}_${filename}`;

	promises.push(client.hsetAsync(
		process.env.DRAY_JOB_ID,
		filename,
		fs.readFileSync(file).toString()
	));
}
// Expire this record after some time
promises.push(client.expireAsync(
	process.env.DRAY_JOB_ID,
	process.env.REDIS_EXPIRE_IN
));

// Once everything is done, exit
Promise.all(promises).then(value => {
	client.quit();
	process.exit(0);
}, reason => {
	client.quit();
	console.error(reason);
	process.exit(4);
});
