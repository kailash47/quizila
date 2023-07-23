const express = require('express');
const router = express.Router();
const utils = require('./../../shared/utils');
const quizService = require('./quiz.service');
const path = require('path');

router.post('/quiz', async (req, res) => {
    try {
        let body = req.body;
        let data = await quizService.addQuiz(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});

router.patch('/quiz', async (req, res) => {
    try {
        let body = req.body;
        let data = await quizService.updateQuiz(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.get('/quiz', async (req, res) => {
    try {
        let body = req.query;
        let data = await quizService.getQuiz(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.delete('/quiz', async (req, res) => {
    try {
        let body = req.query;
        let data = await quizService.deleteQuiz(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});

router.post('/quiz-question-map', async (req, res) => {
    try {
        let body = req.body;
        let data = await quizService.addQuizQuestionMap(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});
router.get('/quiz-question-map', async (req, res) => {
    try {
        let body = req.query;
        let data = await quizService.getQuizQuestionMap(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});
router.delete('/quiz-question-map', async (req, res) => {
    try {
        let body = req.query;
        let data = await quizService.deleteQuizQuestionMap(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});

router.post('/quiz-user-map', async (req, res) => {
    try {
        let body = req.body;
        let data = await quizService.addQuizUserMap(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});
router.get('/quiz-user-map', async (req, res) => {
    try {
        let body = req.query;
        let data = await quizService.getQuizUserMap(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});
router.patch('/quiz-user-map', async (req, res) => {
    try {
        let body = req.body;
        let data = await quizService.updateQuizUserMap(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(error.status);
        res.json(utils.failedResponse(error.status, error));
    }
});
router.delete('/quiz-user-map', async (req, res) => {
    try {
        let body = req.query;
        let data = await quizService.deleteQuizUserMap(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});


router.post('/quiz-question-user-map', async (req, res) => {
    try {
        let body = req.body;
        let data = await quizService.addQuizQuestionUserMap(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});


router.get('/my-quiz', async (req, res) => {
    try {
        const userid = req.decoded.id
        let body = req.query;
        body.user_id = userid;
        let data = await quizService.getMyQuiz(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});

router.get('/my-quiz-list', async (req, res) => {
    try {
        let body = req.query;
        let data = await quizService.getMyQuizList(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        // const userid = req.decoded.id
        let body = req.query;
        // body.user_id = userid;
        let data = await quizService.getLeaderboard(body);
        res.status(200).json(utils.successResponse(data));
    } catch (error) {
        res.status(500);
        res.json(utils.failedResponse(500, error));
    }
});


module.exports = router;