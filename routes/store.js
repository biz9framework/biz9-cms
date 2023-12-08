var router = express.Router();
//9_ping
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
//9_store_info
router.get('/info',biz9.check_user, function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='store_info_edit';
    helper.page_title=APP_TITLE + ' Store Business';
    helper.show_add=false;
    helper.item=biz9.get_new_item(DT_ITEM,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.item = data_list[0];
                }
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//9_store_paper
router.get('/paper',biz9.check_user, function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='store_paper_edit';
    helper.page_title=APP_TITLE + ' Invoice';
    helper.show_add=false;
    helper.item=biz9.get_new_item(DT_ITEM,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            sql = {title_url:'paper'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.item = data_list[0];
                }
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//9_store_cms
router.get('/cms',biz9.check_user, function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='store_cms_edit';
    helper.page_title=APP_TITLE + ' Content Management System';
    helper.show_add=false;
    helper.item=biz9.get_new_item(DT_ITEM,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            sql = {title_url:'cms'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.item = data_list[0];
                }
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
module.exports = router;
