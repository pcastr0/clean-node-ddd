'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  load({ sequelize, dataTypes, baseFolder, indexFile = 'index.js' }) {
    const loaded = {};

    fs
      .readdirSync(baseFolder)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== indexFile) && (file.slice(-3) === '.js');
      })
      .forEach(file => {
        // Fix this
        const model = require(path.join(baseFolder, file))(sequelize, dataTypes);
        // console.log(sequelize);
        // console.log(dataTypes);
        // const model = sequelize['import'](path.join(baseFolder, file));
        const modelName = file.split('.')[0];
        loaded[modelName] = model;
        console.log('model.name');
        console.log(model);
        // console.log('load model');
        // console.log(model);
        // console.log(typeof model);
      });

    Object.keys(loaded).forEach(modelName => {
      if (loaded[modelName].associate) {
        loaded[modelName].associate(loaded);
      }
    });

    loaded.database = sequelize;
    console.log(loaded);

    return loaded;

  }
};




