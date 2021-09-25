const GeonNames = require('../../lib/geonames');

GeonNames.getHierarchy('Seoul').then((list) => {
  console.log(list.map((o) => o.name));
});
