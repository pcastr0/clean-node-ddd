const chai = require('chai');
const dirtyChai = require('dirty-chai');
const chaiChange = require('chai-change');
const cleanDatabase = require('./utils/cleanDatabase');

chai.use(dirtyChai);
chai.use(chaiChange);

beforeEach(cleanDatabase);