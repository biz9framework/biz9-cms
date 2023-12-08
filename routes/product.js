var router = express.Router();
//ping
router.get('/ping', function(req, res, next) {
    res.render({ping:'product'});
    res.end();
});
//9_index
//9_list
router.get('/',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='product_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' Products';
    helper.list_title=' Products';
    helper.show_add=true;
    helper.item=biz9.get_new_item(DT_PRODUCT,0);
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
            sort={title:-1};
            biz9.get_sql(db,DT_PRODUCT,sql,sort,function(error,data_list) {
                helper.item_list =data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.item_list.length;a++){
                helper.item_list[a].money_obj=biz9.get_money_obj(helper.item_list[a]);
                helper.item_list[a].visible_obj=biz9.get_visible_product_obj(helper.item_list[a].visible);
            }
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
//9_edit
router.get('/edit_product/:tbl_id',biz9.check_user,function(req,res,next){
    var helper = biz9.get_helper_user(req);
    helper.render='product_edit';
    helper.back_url='/product';
    helper.product=biz9.get_new_item(DT_PRODUCT,0);
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
            helper.product_visible_option_list= biz9.get_product_visible_option_list();
            call();
        },
        function(call){
            biz9.get_item(db,DT_PRODUCT,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            sql = {type:DT_PRODUCT};
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

