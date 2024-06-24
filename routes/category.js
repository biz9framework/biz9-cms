var router = express.Router();
//ping
router.get('/ping', function(req, res, next) {
    res.render({ping:'category'});
    res.end();
});
//9_index
//9_list
router.get('/',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='category_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' Categorys';
    helper.list_title=' Categorys';
    helper.show_add=true;
    helper.item=biz9.get_new_item(DT_CATEGORY,0);
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
            biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
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
//9_edit
router.get('/edit_category/:tbl_id',biz9.check_user,function(req,res,next){
    var helper = biz9.get_helper_user(req);
    helper.render='category_edit';
    helper.back_url='/category';
    helper.category=biz9.get_new_item(DT_CATEGORY,0);
    helper.g_file_url=FILE_URL;
    async.series([

        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_CATEGORY,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            helper.category_title_list = [
                {value:DT_BLOG_POST,title:'Blog Post'},
                {value:DT_EVENT,title:'Event'},
                {value:DT_GALLERY,title:'Gallery'},
                {value:DT_PRODUCT,title:'Product'},
                {value:DT_SERVICE,title:'Service'},
            ]
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
module.exports = router;
