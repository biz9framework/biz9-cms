var router = express.Router();
//9_ping
router.get('/ping', function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.item='cool';
    helper.render='item_edit_note';
    res.render(helper.render,{helper:helper});
    res.end();
});
//9_index
//9_event_list
router.get('/',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='event_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' Events';
    helper.list_title=' Events';
    helper.show_add=true;
    helper.item=biz9.get_new_item(DT_EVENT,0);
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
            biz9.get_sql(db,DT_EVENT,sql,sort,function(error,data_list) {
                helper.item_list =data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.item_list.length;a++){
                helper.item_list[a].date_full = moment(helper.item_list[a].start_date+ " " + helper.item_list[a].start_time, 'YYYY-MM-DD h:mm').format("dddd MMMM Do, YYYY");
                helper.item_list[a].time_full = moment(helper.item_list[a].start_date+ " " + helper.item_list[a].start_time, 'YYYY-MM-DD h:mm').format("h:mm a");
                helper.item_list[a].start_date_time_str = moment(helper.item_list[a].start_date+ " " + helper.item_list[a].start_time, 'YYYY-MM-DD h:mm').format("dddd MMMM Do, YYYY h:mm a");
                helper.item_list[a].money_obj=biz9.get_money_obj(helper.item_list[a]);
                helper.item_list[a].visible_obj=biz9.get_visible_event_obj(helper.item_list[a].visible);
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
//9_event_edit 9_edit 9_edit
router.get('/edit_event/:tbl_id',biz9.check_user,function(req,res,next){
    var helper = biz9.get_helper_user(req);
    helper.render='event_edit';
    helper.back_url='/event';
    helper.event=biz9.get_new_item(DT_EVENT,0);
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
            biz9.get_item(db,DT_EVENT,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            helper.event_visible_option_list= biz9.get_event_visible_option_list();
            call();
        },
        function(call){
            sql = {type:DT_EVENT};
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

