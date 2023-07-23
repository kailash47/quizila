const express = require('express');
const router = express.Router();
const utils = require('./../../shared/utils');
const qcategoryService = require('./qcategory.service');

router.post('/qcategory', async (req, res) => {
    try {
        let body = req.body;
        let data = await qcategoryService.addQCategory(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});

router.patch('/qcategory', async (req, res) => {
    try {
        let body = req.body;
        let data = await qcategoryService.updateQCategory(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.get('/qcategory', async (req, res) => {
    try {
        let body = req.query;
        let data = await qcategoryService.getQCategory(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.delete('/qcategory', async (req, res) => {
    try {
        let body = req.query;
        let data = await qcategoryService.deleteQCategory(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});


module.exports = router;