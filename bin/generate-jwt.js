'use strict';

const jwt = require('../src/utils/jwt');

const jwtBearerHeader = jwt.getJwtBearerHeader({ isAdmin: true }, 500);
console.log(jwtBearerHeader);
