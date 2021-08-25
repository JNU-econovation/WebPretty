var express = require('express');
var db = require('../dbconnection');
var fs = require('fs');
var router = express.Router();
router.get('/', function (req, res) { //localhost:3000
    res.render('MAIN', {isLogined: req.session.logined, nickname: req.session.name});
});
//회원가입
router.get('/join', function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
    fs.readFile("./views/SIGN_UP.html", (err, data) => {
        if (err) throw (err);
        res.end(data, 'utf-8');
    });
});

router.post('/join', function(req, res, next) {
    var body = req.body;
    var name = req.body.name;
    var id = req.body.id;
    var password = req.body.pw;
    var email = req.body.email;
    var phone = req.body.phone;
    var nickname = req.body.nickname;
    var interest = req.body.genre.join(',');

    db.query('insert into user (userId, userPassword, userName, userEmail, userPhone, userNickname, interest) values(?, ?, ?, ?, ?, ?, ?)', [id, password, name, email, phone, nickname, interest], function(err, rows) {
        if (err) {
            console.log(err)};
        console.log("rows :" + rows);
        res.redirect('/auth/login');
    });
});

//로그인
router.get('/login', function(req, res) {
    var session = req.session;
    res.render('SIGN_IN');
});

router.post('/login', function(req, res) {
    var userId = req.body.id;
    var password = req.body.pw;

    db.query('select * from user where userId = ?', [userId], function(err, rows) {
        if (err) throw(err);
        else {
            if (rows.length === 0) {
                res.json({success: false, msg: '해당 유저가 존재하지 않습니다.'})
            }
            else {
                if (!password == rows[0].password) {
                    res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
                } else {
                    req.session.no = rows[0].No;
                    req.session.name = rows[0].userNickname;
                    req.session.logined = true;
                    console.log(req.session.no);
                    req.session.save(function() {
                        res.redirect('/');
                    })
                }
            }
        }
    })
})

//로그아웃
router.get('/logout', function(req, res, next) {
    if (req.session) {
        console.log('로그아웃');
        req.session.destroy(function(err) {            
            if (err) {
                console.log('세션 삭제시 에러');
                return;
            }
            console.log('세션 삭제 성공');
            res.redirect('/');
        })
    }
    else {
        console.log('로그인 안됨');
        res.redirect('/login');
    }
})
module.exports = router;
