var router = express.Router();
//a9_ping
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
//9_index
//9_service_list
router.get('/',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='service_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' Services';
    helper.list_title=' Services';
    helper.show_add=true;
    helper.item=biz9.get_new_item(DT_SERVICE,0);
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
            biz9.get_sql(db,DT_SERVICE,sql,sort,function(error,data_list) {
                helper.item_list =data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.item_list.length;a++){
                helper.item_list[a].money_obj=biz9.get_money_obj(helper.item_list[a]);
                helper.item_list[a].visible_obj=biz9.get_visible_service_obj(helper.item_list[a].visible);
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
//9_edit_service
router.get('/edit_service/:tbl_id',biz9.check_user,function(req,res,next){
    var helper = biz9.get_helper_user(req);
    helper.render='service_edit';
    helper.back_url='/service';
    helper.item=biz9.get_new_item(DT_SERVICE,0);
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
            helper.service_visible_option_list= biz9.get_service_visible_option_list();
            call();
        },
        function(call){
            biz9.get_item(db,DT_SERVICE,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            sql = {type:DT_SERVICE};
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

