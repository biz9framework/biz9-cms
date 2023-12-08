var router = express.Router();
//a9_ping
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
//9_index
//9_project_list
router.get('/',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='project_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' Projects';
    helper.list_title=' Projects';
    helper.show_add=true;
    helper.item=biz9.get_new_item(DT_PROJECT,0);
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
            biz9.get_sql(db,DT_PROJECT,sql,sort,function(error,data_list) {
                helper.item_list =data_list;
                call();
            });
        },
        function(call){
            //top set to null
            biz9.save_cookie(req,'back_list',null);
            call();
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
//9_edit_project
router.get('/edit_project/:tbl_id',biz9.check_user,function(req,res,next){
    var helper = biz9.get_helper_user(req);
    helper.render='project_edit';
    helper.back_url='/project';
    helper.item=biz9.get_new_item(DT_PROJECT,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_PROJECT,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            sql = {type:DT_PROJECT};
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

