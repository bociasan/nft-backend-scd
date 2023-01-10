const cron = require('node-cron')
const sdk = require('api')('@opensea/v1.0#bg4ikl1mk428b')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const collectionRouter = require("./Collections/Controller");

const collectionService = require('./Collections/Service');

const mockData = require("./mock/mockCollections");
let collections = []

const getUrlsAndNames = async () => {
    await Promise.all(mockData.slugs.map(slug =>
        sdk.retrievingASingleCollection({collection_slug: slug})
            .then(({data}) => {
                const {name, slug, image_url, large_image_url} = data.collection
                // console.log(data.collection)

                // collections.push({
                //     name, slug, image_url, large_image_url
                // })
                return {name, slug, image_url, large_image_url}
            })
            .catch(err => console.error(err))
    )).then(prres => collections = prres)
}

const fetchData = () => {
    // sdk.retrievingCollectionStats({collection_slug: 'doodles-official'})
    sdk.retrievingCollectionStats({collection_slug: 'ens'})
        .then(res => {
            console.log(res.data)
            collectionService.createRecord(
                {one_hour_difference, average_price, floor_price} = res.data.stats,
                data => console.log(data),
                error => console.log(error),
            );
        })
        .catch(err => console.error(err));
}

const fetchAllCollections = () => {
    sdk.retrievingCollections({offset: '0', limit: '2'})
        .then(({data}) =>
            data.collections.map(el => {
                collectionService.createRecord(
                    {
                        name: el.name,
                        slug: el.slug,
                        one_hour_difference: el.stats.one_hour_difference,
                        average_price: el.stats.average_price,
                        floor_price: el.stats.floor_price,
                        total_volume: el.stats.total_volume,
                        num_owners: el.stats.num_owners,
                    },
                    data => console.log(data),
                    error => console.log(error),
                );
                console.log(el)
                console.log('****************   ---   ******************')
            })
        )
        .catch(err => console.error(err));
    console.log('****************   end   ******************')
}

const fetchFixedCollections = () => {
    collections.forEach(collection => {
        if (collection.slug !== '') {
            sdk.retrievingCollectionStats({collection_slug: collection.slug})
                .then(res => {
                    //console.log(res.data)
                    let el = res.data
                    collectionService.updateRecordsBySlug(
                        collection.slug,
                        {
                            one_hour_difference: el.stats.one_hour_difference,
                            average_price: el.stats.average_price,
                            floor_price: el.stats.floor_price,
                            total_volume: el.stats.total_volume,
                            num_owners: el.stats.num_owners,
                        },
                        data => {/*console.log(data)*/},
                        error => {/*console.log(error)*/},
                    );
                })
                .catch(err => console.error(err));
        } else {
            console.log('Slug is empty...')
        }
    })
}

const saveInitialDataToDatabase = () => {
    console.log('Entererd in save.', collections.length)
    collections.forEach((collection, i) => {
        // console.log(collection)
        if (collection.slug !== '') {
            collectionService.updateInitialRecordsBySlug(
                collection.slug,
                {
                    name: collection.name,
                    slug: collection.slug,
                    // one_hour_difference: el.stats.one_hour_difference,
                    // average_price: el.stats.average_price,
                    // floor_price: el.stats.floor_price,
                    // total_volume: el.stats.total_volume,
                    // num_owners: el.stats.num_owners,

                    image_url: collection.image_url,
                    large_image_url: collection.large_image_url
                },
                data => {/*console.log(data)*/},
                error => {/*console.log(error)*/},
            );
        } else {
            console.log('Slug is empty...')
        }
    })
}

const startServer = () => {
    app.listen(4000, () => console.log('server started on PORT 4000'))
}

const startDatabase = () => {
    mongoose.connect('mongodb://localhost:27017/', () => console.log('database started'))
}

const initRoutes = () => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Allow-Methods', '*');
        next();
    });
    app.use(express.json());
    app.use('/api/collections', collectionRouter);
}

const startApp = async () => {
    startServer()
    startDatabase()
    initRoutes()
    await getUrlsAndNames()
    saveInitialDataToDatabase()
}

startApp()

//cron at 10 seconds
// cron.schedule('*/10 * * * * * ', fetchData,{})
// cron.schedule('*/10 * * * * * ', fetchAllCollections,{})
cron.schedule('*/10 * * * * * ', fetchFixedCollections, {})

