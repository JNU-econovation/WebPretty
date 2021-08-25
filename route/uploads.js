var express = require('express');
var path = require('path');
var db = require('../dbconnection');
var fs = require('fs');
var multer = require('multer');
var cors = require('cors');
var ejs = require('ejs');
//multer 기본설정(파일 저장)
var storage = multer.diskStorage({
    destination: function(req, res, callback) {
        callback(null, 'uploads');
    },
    filename: function(req, file, callback) {
        var extention = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extention);
        callback(null, basename + Date.now() + extention);
    }
});
var upload = multer({
    storage:storage,
    limits:{
        files:5
    }
});
var router = express.Router();

router.post('/', upload.array('file', 1), function(req, res) {
    var files = req.files;
	var originalname;
    var filename;
    var mimetype;
    var size;
    console.log('==== 업로드된 파일 ====');
    if (files.length > 0) {
        console.dir(files[0]);
    }
    else {
        console.log('파일이 없습니다');
    }
    if(Array.isArray(files)) {
        for(var i = 0; i > files.length; i++) {
            originalname = files[i].originalname;
            filename = files[i].filename;
            mimetype = files[i].mimetype;
            size = files[i].size;
        }
    }
    res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    res.write("<h1>파일 업로드 성공</h1>");
    res.write("<p>원본파일 : " + originalname + "</p>");
    res.write("<p>저장파일 : " + filename + "</p>");
    res.end();
})

module.exports = router;
