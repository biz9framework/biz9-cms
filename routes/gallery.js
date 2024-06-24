var router = express.Router();
//a9_ping
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
//9_index
//9_gallery_list
router.get('/',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='gallery_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' Gallerys';
    helper.list_title=' Gallerys';
    helper.show_add=true;
    helper.item=biz9.get_new_item(DT_GALLERY,0);
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
            biz9.get_sql(db,DT_GALLERY,sql,sort,function(error,data_list) {
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
        function(err, datas){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//9_edit_gallery
router.get('/edit_gallery/:tbl_id',biz9.check_user,function(req,res,next){
    var helper = biz9.get_helper_user(req);
    helper.render='gallery_edit';
    helper.back_url='/gallery';
    helper.item=biz9.get_new_item(DT_GALLERY,0);
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
            biz9.get_item(db,DT_GALLERY,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            sql = {type:DT_GALLERY};
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
        function(err, datas){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
module.exports = router;
