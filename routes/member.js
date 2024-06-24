var router = express.Router();
//a9_ping
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
//9_index
//9_member_list
router.get('/',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='member_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' Members';
    helper.list_title=' Members';
    helper.show_add=true;
    helper.item = biz9.get_new_item(DT_MEMBER,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            sql = {};
            sort={date_create:-1};
            biz9.get_sql(db,DT_MEMBER,sql,sort,function(error,data_list) {
                helper.item_list =data_list;
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
//9_edit_member
router.get('/edit_member/:tbl_id',biz9.check_user,function(req,res,next){
    var helper = biz9.get_helper_user(req);
    helper.render='member_edit';
    helper.back_url='/member';
    helper.item=biz9.get_new_item(DT_MEMBER,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_MEMBER,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            sql = {type:DT_MEMBER};
            sort={};
            biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
                helper.category_list =data_list;
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
