var router = express.Router();
//9_ping
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
//9_item_order_list 9_list
router.get('/orderz',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='order_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' OrderZ';
    helper.list_title=' OrderZ';
    helper.show_add=false;
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
            biz9.get_sql(db,DT_ORDER,sql,sort,function(error,data_list) {
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
//9_item_detail 9_detail
router.get('/detail/:order_id',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='order_detail';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' Order Detail';
    helper.list_title='Invoice';
    helper.show_add=false;
    helper.order = biz9.get_new_item(DT_BLANK,0);
    helper.store=biz9.get_new_biz_item(DT_ITEM,0);
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
                    helper.store_paper = data_list[0];
                }
                call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.store_info = data_list[0];
                }
                call();
            });
        },
        function(call){
            biz9.get_order(db,helper.order_id,function(error,data) {
                helper.order=data;
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
//9_item_detail
router.get('/cart/detail/:customer_id',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='cart_detail';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' Cart Detail';
    helper.list_title='Cart';
    helper.show_add=false;
    helper.cart = biz9.get_new_item(DT_BLANK,0);
    helper.store=biz9.get_new_biz_item(DT_ITEM,0);
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
                    helper.store_paper = data_list[0];
                }
                call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.store_info = data_list[0];
                }
                call();
            });
        },
        function(call){
            sql = {customer_id:helper.customer_id};
            sort={date_create:-1};
            biz9.get_cart(db,sql,function(error,data) {
                helper.cart=data;
                if(helper.cart.item_list.length>0){
                    helper.full_date_create=helper.cart.item_list[0].date_obj.full_date_create;
                }else{
                    helper.full_date_create='No Items Found';
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
//9_item_cart_list
router.get('/cartz',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='cart_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' CartZ';
    helper.list_title='CartZ';
    helper.show_add=false;
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
            sort={};
            biz9.get_sql(db,DT_CART_ITEM,sql,sort,function(error,data_list) {
                helper.item_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.item_list.length;a++){
                helper.item_list[a].price = biz9.get_money(helper.item_list[a].price);
                helper.item_list[a].old_price = biz9.get_money(helper.item_list[a].old_price);
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
module.exports = router;
