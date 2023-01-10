const collectionModel = require('./Model')

const collectionService = {
    createRecord: (collection, success, fail) => {
        collectionModel.create(collection)
            .then(data => success(data))
            .catch(error => fail(error))
    },
    getRecord: (id, success, fail)=> {
        collectionModel.find({_id: id})
            .then(data => success(data))
            .catch(error => fail(error))
    },
    getRecordBySlug: (slug, success, fail)=> {
        console.log(slug)
        collectionModel.find({slug: slug})
            .then(data => success(data))
            .catch(error => fail(error))
    },
    getAllRecords: (success, fail)=> {
        collectionModel.find()
            .then(data => success(data))
            .catch(error => fail(error))
    },
    updateRecordsPriceById: (id, value, success, fail) => {
        collectionModel.updateOne({_id: id}, {$set:{floor_price: value}})
            .then(data => success(data))
            .catch(error => fail(error))
    },
    updateRecordsBySlug: (slug, collection, success, fail) => {
        collectionModel.updateOne({slug: slug}, {
            $set:{
                one_hour_difference: collection.one_hour_difference,
                average_price: collection.average_price,
                floor_price: collection.floor_price,
                total_volume: collection.total_volume,
                num_owners: collection.num_owners
            }}, {upsert: true})
            .then(data => success(data))
            .catch(error => fail(error))
    },
    updateInitialRecordsBySlug: (slug, collection, success, fail) => {
        collectionModel.updateOne({slug: slug}, {
            $set:{
                name: collection.name,
                slug: collection.slug,
                image_url: collection.image_url,
                large_image_url: collection.large_image_url
            }}, {upsert: true})
            .then(data => success(data))
            .catch(error => fail(error))
    },
    getCollectionNames: (success, fail) => {
        collectionModel.find()
            .then(data => success(data.map(collection => {return {slug:collection.slug,name:collection.name}})))
            .catch(error => fail(error))
    }

}

module.exports = collectionService