var express = require('express');
var db = require('../dbconnection');
var fs = require('fs');
var ejs = require('ejs');
var router = express.Router();

//목록
router.get('/', function(req, res) {
    db.query('select noticeNo, noticeTitle, hit, DATE_FORMAT(curdate(), "%Y.%m.%d") as createAt from notice', function(err, rows) {
        if (err) {
            console.log(err);
        }
        console.log(rows);
        res.render('notice', {rows: rows, isLogined: req.session.logined, nickname: req.session.name});
    })
});

//읽기
router.get('/read/:noticeNo', function(req, res, next) {
    var noticeNo = req.params.noticeNo;
    
    console.log("noticeNo : " + noticeNo);
    db.beginTransaction(function(err) {
        db.query('update notice set hit = hit + 1 where noticeNo=?', [noticeNo], function(err) {
            if (err) {
                console.log(err);
                db.rollback(function () {
                    console.error('rollback error1');
                });
            }
            db.query('select noticeNo, noticeTitle, noticeContents, DATE_FORMAT(curdate(), "%Y.%m.%d") as createAt, hit from notice where noticeNo=?', [noticeNo], function(err, rows) {
                if (err) {
                    console.log(err);
                    db.rollback(function () {
                        console.error('rollback err2');
                    })
                }
                else {
                    db.commit(function (err) {
                        if (err) console.log(err);
                        console.log("row : " + rows);
                        res.render('read', {title: rows[0].noticeTitle, rows: rows});
                    })
                }
            });
        });
    });
});

module.exports = router;
