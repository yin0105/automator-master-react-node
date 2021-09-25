const express = require('express');
const router = express.Router();

// const RecordMaker = require('./lib/cri/record-maker');
const SmallestPlacePicker = require('./lib/smallest-place-picker');

const DBPedia = require('./lib/dbpedia');
const WikiPedia = require('./lib/wikipedia');
const WikiMedia = require('./lib/wikimedia');
const Geonames = require('./lib/geonames');

const path = require('path');
const execPerl = require('./lib/exec-perl');

const CRIDB = require('./lib/cri/db');

// jest.setTimeout(5 * 60 * 1000); // 5 minutes

const connect = CRIDB.createConnection();




// WikiMedia
router.get('/wikimedia/getimageurl/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const result = await WikiMedia.getImageURL(keyword);
        return res.json({
            keyword,
            result
        });
    } catch (error) {
        next(error);        
    }
});

// WikiPedia
router.get('/wikipedia/getimagefilenames/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        // const result = await WikiPedia.getImageFileNames(keyword);
        const result = [
            "Odo_bayeux_tapestry.png",
            "Odo_of_Bayeux.jpg",
            "MontfauconHaroldEye.jpg",
            "Stothard_Bayeux_41_42_Plate_10.jpg",
            "Bayeux_tapestry_laid_work_detail..jpg",
            "Tapisserie_de_Bayeux_31109.jpg",
            "Bayeux_Tapestry_scene1_Edward.jpg",
            "Tapisserie_agriculture.JPG",
            "Comete_Tapisserie_Bayeux.jpg",
            "Normans_Bayeux.jpg",
            "Bayeux_Tapestry_scene57_Harold_death.jpg",
            "Harold_arrow,_Bayeux_tapestry_detail.jpeg",
            "Aelfgyva.jpg",
            "Bayeux_Tapestry_scene29-30-31_Harold_coronation.jpg",
            "Bayeux_Tapestry_replica_in_Reading_Museum.jpg",
            "1066_Medieval_Mosaic_(Bayeux_Tapestry)_sections.jpg",
            "Street_art_in_Bayeux_about_tapestry.jpg",
            "Commons-logo.svg",
            "Odo_bayeux_tapestry_detail.jpg",
            "Sampler_by_Elizabeth_Laidman_1760_detail.jpg",
            "Kaitag.jpg",
            "Charlemagne_tapestry.JPG"
        ]
        return res.json({
            keyword,
            result
        });
    } catch (error) {
        next(error);        
    }
});

router.get('/waiter', async (req, res, next) => {
    try {
        const result = "waiter";
        return res.json({
            result
        });
    } catch (error) {
        next(error);        
    }
});

router.get('/wikipedia/getperson/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const result = await WikiPedia.getPerson(keyword);
        return res.json({
            keyword,
            result
        });
    } catch (error) {
        next(error);        
    }
});

router.get('/wikipedia/search/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const result = await WikiPedia.getEventDate(keyword);
        return res.json({
            result
        });
    } catch (error) {
        next(error);        
    }
});

router.get('/wikipedia/getcoord/:keyword', async (req, res, next) => {
    try {
        const { keyword } = req.params;
        const result = await WikiPedia.getWikiCoord(keyword);
        return res.json({
            result
        });
    } catch (error) {
        next(error);        
    }
});

// DBPedia
router.get('/dbpedia/search/:keyword', async (req, res, next) => {
    try {
        const {keyword} = req.params;
        const result = await DBPedia.get(keyword);
        return res.json({
            ...result.data
        });
    } catch (error) {
        next(error);        
    }
})

// Geonames
router.get('/geonames/getcoordinate/:keyword', async (req, res, next) => {
    try {
        const {keyword} = req.params;
        const result = await Geonames.getHierarchy(keyword);
        return res.json({
            ...result.data
        });
    } catch (error) {
        next(error);        
    }
})

// CRIDB Test
router.get('/cridb/test/:keyword', async (req, res, next) => {
    try {
        const {keyword} = req.params;

        // const perlCodePath = path.join(__dirname, 'lib/cri/request.pl');

        // const result = await execPerl(perlCodePath, 1, 2); // perl: add all numbers
        // console.log("result => ", result);

        const db = await connect;
        // console.log("db => ", db);
        const records = await db.searchThing(keyword);
        // console.log("records => ", records);

        return res.json({
            keyword,
            // records
        });
    } catch (error) {
        next(error);        
    }
})

module.exports = router;