const express = require('express');
const router = express.Router();
const utils = require('./../../shared/utils');
const questionService = require('./question.service');
const path = require('path');

router.post('/question', async (req, res) => {
    try {
        let body = req.body;
        let data = await questionService.addQuestion(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});

router.patch('/question', async (req, res) => {
    try {
        let body = req.body;
        let data = await questionService.updateQuestion(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.get('/question', async (req, res) => {
    try {
        let body = req.query;
        let data = await questionService.getQuestion(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.delete('/question', async (req, res) => {
    try {
        let body = req.query;
        let data = await questionService.deleteQuestion(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.post('/option', async (req, res) => {
    try {
        let body = req.body;
        let data = await questionService.addOption(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});

router.patch('/option', async (req, res) => {
    try {
        let body = req.body;
        let data = await questionService.updateOption(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.get('/option', async (req, res) => {
    try {
        let body = req.query;
        let data = await questionService.getOption(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.delete('/option', async (req, res) => {
    try {
        let body = req.query;
        let data = await questionService.deleteOption(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.post('/question-cat-map', async (req, res) => {
    try {
        let body = req.body;
        let data = await questionService.addQuestionCatMap(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});


router.get('/cat-question', async (req, res) => {
    try {
        let body = req.query;
        let data = await questionService.getCatQuestion(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});


module.exports = router;