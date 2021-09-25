const axios = require('./axios-with-cache');
const FileDB = require('./file-db');
const parseDate = require('./date-parser');
const { parse: parseHTML } = require('node-html-parser');

const jsonPerson = require('../json/person_default.json');
const jsonPerson1 = require('../json/person1.json');
const jsonPerson2 = require('../json/person2.json');
const jsonPlace = require('../json/place_default.json');

const wikipediaURL = 'https://en.wikipedia.org';
const memoryCache = {};
const cacheDBs = {};

function _get(...params) {
  async function get(type, name, url, params = {}) {
    const cacheDB =
      cacheDBs[type] || (cacheDBs[type] = new FileDB(`wikipedia/${type}`));
    let data = await cacheDB.read(name);
    if (!data) {
      ({ data } = await axios.get(url, { params }));
      await cacheDB.write({
        key: name,
        value: data,
      });
    }
    return data;
  }

  const [cacheKey, key] = params;
  const cache = (memoryCache[cacheKey] = memoryCache[cacheKey] || {});
  return cache[key] || (cache[key] = get(...params));
}

async function _getHTML(...params) {
  const data = await _get(...params);
  const dom = parseHTML(data);
  return {
    dom,
    text: data,
  };
}

async function _getJSON(...params) {
  const data = await _get(...params);

  if (typeof data != 'object') {
    throw Error('data is not a json object');
  }

  return data;
}

async function getRender(title) {
  const url = `${wikipediaURL}/w/index.php`;
  return await _getHTML('render', title, url, {
    title,
    action: 'render',
  });
}

async function getWiki(name) {
  const url = `${wikipediaURL}/wiki/${encodeURIComponent(name)}`;
  return await _getHTML('wiki', name, url);
}

async function getMedia(name) {
  const encodedName = encodeURIComponent(name);
  const url = `${wikipediaURL}/api/rest_v1/page/media-list/${encodedName}`;
  return await _getJSON('media', name, url);
}

async function getEventDate(eventName) {
  const { dom } = await getRender(eventName);

  try {
    const [dateElement] = dom
      .querySelectorAll('tr')
      .filter((trElement) => trElement.text.includes('Date'));
    const date = dateElement.querySelector('td').text;
    return parseDate(date);
  } catch {
    return '';
  }
}

async function getRealName(name) {
  const { dom } = await getWiki(name);
  const { text: realname } = dom.querySelector('h1') || {};
  return realname;
}

async function getImageFileNames(name) {
  const { dom } = await getWiki(name);
  const imageElements = dom.querySelectorAll('a[class="image"]') || {};
  var hrefs = [];
  imageElements.forEach(function(element) {
    hrefs.push(element.getAttribute('href').replace("/wiki/File:", ""));
  });
  return hrefs;
}

async function getPerson(name) {
  const url = `${wikipediaURL}/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles=`+name+`&format=json`;
  try {
    // var {data} = await axios.get(url, {});
    var data = jsonPerson1;
    var page = Object.values(data.query.pages);
    var pageContent = ((page[0].revisions[0])['*']).split("\n");

    var birthPlace = "";
    var deathPlace = "";

    for(var i = 0; i < pageContent.length; i++){
      if((pageContent[i].indexOf("birth_place") > -1)){
        bPlace = String((pageContent[i].split(" ="))[1]).trim();
        if(bPlace != ""){
          birthPlace = bPlace.split('[[').join('').split(']]').join('');
        }      
      }
      if((pageContent[i].indexOf("death_place") > -1)){
        dPlace = String((pageContent[i].split(" ="))[1]).trim();
        if(dPlace != ""){
          deathPlace = dPlace.split('[[').join('').split(']]').join('');
        }      
      }
    }
    
    data = {
      birthPlace,
      deathPlace
    }

    return data;
  } catch {
    return 'No Dom Data';
  }
}

async function getWikiCoord(name) {
  const url = `${wikipediaURL}/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&titles=`+name+`&format=json`;
  try {
    // var {data} = await axios.get(url, {});
    var data = jsonPlace;
    var page = Object.values(data.query.pages);
    var pageContent = ((page[0].revisions[0])['*']).split("\n");

    var coord = "";

    for(var i = 0; i < pageContent.length; i++){
      if((pageContent[i].indexOf("coordinates") > -1)){
        coord = String((pageContent[i].split(" ="))[1]).trim();
        if(coord != ""){
          coord = coord.split('{{')[1].split('}}')[0];
          coord = coord.split('coord|')[1].split('|display')[0];
        }      
      }
    }
    return coord;
  } catch {
    return 'No Dom Data';
  }
}

module.exports = {
  getRender,
  getWiki,
  getMedia,
  getEventDate,
  getRealName,
  getPerson,
  getImageFileNames,
  getWikiCoord,
};
