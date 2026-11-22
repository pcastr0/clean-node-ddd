import cleanDatabase from './utils/cleanDatabase';

// Integration tests hit a real database: truncate between every test.
// Unit tests run without any setup file (and without any database).
beforeEach(() => cleanDatabase());