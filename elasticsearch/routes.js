//Referenced from: https://medium.com/@siddharthac6/elasticsearch-node-js-b16ea8bec427
const ElasticSearch = require('./ElasticSearch.js')
const routes = require('express').Router()
const utils = require('./utils')

const matchAll = {
    "index": "encourse",
    "type": "course",
    "payload": {
        "query": { "match_all": {} },
        "size": 50
    }
}

routes.get('/ping', (req, res) => {
    ElasticSearch.ping(req, res);
});

routes.post('/index/init', (req, res) => {
    // [ 1 ] Create an index
    const index = req.body.index;
    ElasticSearch.initIndex(req, res, index);
});

routes.post('/index/check', (req, res) => {
    //  [ 2 ] Check if Index exists
    const index = req.body.index;
    ElasticSearch.indexExists(req, res, index);
});
routes.post('/index/mapping', (req, res) => {
    //  [ 3 ] Preparing index and its mapping (basically setting data-types of each attributes and more)
    const payload = req.body.payload || {};
    const index = req.body.index || 'courses';
    ElasticSearch.initMapping(req, res, index, payload);
    return null;
});

routes.post('/add', (req, res) => {
    //  [ 4.a ] Add data to index
    const payload = req.body.payload || {};
    const index = req.body.index || 'courses';
    const docType = req.body.type || 'misc';
    ElasticSearch.addDocument(req, res, index, docType, payload);
    return null; 
});

routes.post('/addAll', (req, res) => {
    //  [ 4.b ] Add data to index
    const payload = req.body.payload || [];
    const platform = req.body.platform || 'unknown'
    const newPayload = utils.addInstructions(payload, platform, 'courses')
    // console.log('payload:', payload)
    ElasticSearch.addAllDocuments(req, res, newPayload);
    return null; 
});

routes.post('/update', (req, res) => {
    //  [ 5 ] Update a document
    const payload = req.body.payload || {};
    const index = req.body.index || 'courses';
    const docType = req.body.type || 'misc';
    ElasticSearch.updateDocument(req, res, index, docType, payload);
    return null; 
});

routes.post('/search', (req, res) => {
    // [ 6 ] Search an index
    // const index = req.body.index || 'courses';
    const payload = req.body.payload
    // const docType = req.body.type || 'misc';
    ElasticSearch.search(req, res, payload);
});

routes.post('/delete-document', (req, res) => {
    //  Delete a document
    const index = req.body.index || 'courses';
    const docType = req.body.type || 'misc';
    ElasticSearch.deleteDocument(req, res, index, docType);
    return null; 
});

routes.post('/delete_all', (req, res) => {
    ElasticSearch.deleteAll(req, res);
});

module.exports = routes;