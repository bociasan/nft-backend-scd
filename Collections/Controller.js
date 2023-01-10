const express  = require('express');
const collectionService = require('./Service');
const {slugs} = require("../mock/mockCollections");

const collectionRouter = express.Router();

collectionRouter.route('/nft-create').post(createCollection);
collectionRouter.route('/nft-update').put(updateRecordsValueById);
collectionRouter.route('/nft-get').get(getCollection);
collectionRouter.route('/nft-get-by-slug').post(getCollectionBySlug);
collectionRouter.route('/nft-get-all').get(getAllCollections);
collectionRouter.route('/nft-get-collection-names').get(getCollectionNames);

function createCollection(request, response){
    const value = request.body;

    collectionService.createRecord(
        value,
        data => response.status(201).json(data),
        error => response.status(400).json(error),
    );
}

function updateRecordsValueById(request, response){
    const value = request.body;

    collectionService.updateRecordsPriceById(
        value,
        data => response.status(201).json(data),
        error => response.status(400).json(error),
    );
}

function getCollection(request, response){
    const id = request.body._id;

    collectionService.getRecord(
        id,
        data => response.status(201).json(data),
        error => response.status(400).json(error),
    );
}

function getCollectionBySlug(request, response){
    const slug = request.body.slug
    console.log(slug)
    collectionService.getRecordBySlug(
        slug,
        data => {
            console.log('success',data)
            return response.status(201).json(data)
        },
        error => {
            console.log('error', error)
            return response.status(400).json(error)
        }
    )
}

function getAllCollections(request, response){
    collectionService.getAllRecords(
        data => response.status(201).json(data),
        error => response.status(400).json(error),
    );
}

function getCollectionNames(request, response){
    collectionService.getCollectionNames(
        data => response.status(201).json(data),
        error => response.status(400).json(error),
    );
}


module.exports = collectionRouter;
