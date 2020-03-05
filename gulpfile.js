const {task, series, parallel} = require('gulp');
const config = require('./config');
const path = require('path');

task("convertFixtures", require("./tasks/convertFixtures"));

task('generateOrders', require('./tasks/generateOrders'));

task("validateDb", require("./tasks/validateDb"));

task('buildDb', series('convertFixtures', 'generateOrders', 'validateDb'));
