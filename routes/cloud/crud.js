var express = require('express');
var router = express.Router();
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
router.post("/delete/:data_type/:tbl_id", function(req, res) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.delete_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post("/update/:data_type/:tbl_id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(helper.data_type,helper.tbl_id,req.body);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.update_item(db,helper.data_type,helper.item,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post("/update_biz/:data_type/:tbl_id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.org_item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.item = biz9.set_item_data(helper.data_type,helper.tbl_id,req.body);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
    function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id, function(error,data) {
                helper.org_item =data;
                call();
            });
        },
        function(call){
            helper.item=biz9.convert_biz_item_org(helper.org_item,helper.item,helper.biz_list.split(","));
            biz9.update_item(db,helper.data_type,helper.item,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.get("/get/:data_type/:tbl_id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id, function(error,data) {
                helper.item =data;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
