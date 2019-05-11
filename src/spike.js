const loki = require('lokijs');
const usersData = require('../data/users');

const db = new loki('example.db');
const users = db.addCollection('users');

users.insert(usersData);

console.log(db.getCollection('users').find({tags: {'$contains': 'Shrewsbury'}}));
