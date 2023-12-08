var router = express.Router();
//9_ping
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
//9_add_user
router.post("/add",function(req,res){
    var helper = biz9.get_helper_user(req);
    helper.item = biz9.set_item_data(DT_USER,0,req.body);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.account_validate_password(helper.item.password,function(error,data){
                helper.validation_message=data;
                call();
            });
        },
        function(call){
            biz9.account_validate_email(db,helper.item.data_type,helper.item.tbl_id,helper.item.email,function(error,data){
                helper.validation_message=error;
                call();
            });
        },
        function(call){
            if(!helper.validation_message){
                biz9.update_item(db,helper.item.data_type,helper.item,function(error,data) {
                    helper.item=data;
                    call();
                });
            }
            else{
                call();
            }
        },
        //item_store_info_add
        function(call){
            if(!helper.validation_message){
                helper.store=biz9.get_new_item(DT_ITEM,0);
                helper.store.title_url='info';
                biz9.update_item(db,DT_ITEM,helper.store,function(error,data) {
                    helper.store_info=data;
                    call();
                });
            }else{
                call();
            }
        },
        //item_store_paper_add
        function(call){
            if(!helper.validation_message){
                helper.store=biz9.get_new_item(DT_ITEM,0);
                helper.store.title_url='paper';
                biz9.update_item(db,DT_ITEM,helper.store,function(error,data) {
                    helper.store_info=data;
                    call();
                });
            }else{
                call();
            }
        },
        //item_store_cms_add
        function(call){
            if(!helper.validation_message){
                helper.store=biz9.get_new_item(DT_ITEM,0);
                helper.store.title_url='cms';
                biz9.update_item(db,DT_ITEM,helper.store,function(error,data) {
                    helper.store_info=data;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_userz
router.get('/',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='user_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' UserZ';
    helper.list_title=' UserZ';
    helper.show_add=true;
    helper.item=biz9.get_new_item(DT_USER,0);
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
            sort={order:1};
            biz9.get_sql(db,DT_USER,sql,sort,function(error,data_list) {
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
//9_edit_user
router.get('/edit_user/:user_tbl_id',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.item=biz9.get_new_item(DT_USER,0);
    helper.render='user_edit';
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },

        function(call){
            biz9.get_item(db,DT_USER,helper.user_tbl_id,function(error,data) {
                helper.item=data;
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
//9_edit_profile
router.get('/edit_profile',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.item=biz9.get_new_item(DT_USER,0);
    helper.render='user_edit';
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_USER,helper.user.tbl_id,function(error,data) {
                helper.item=data;
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
//9_update_profile
router.post("/update_profile",function(req,res){
    var helper = biz9.get_helper_user(req);
    async.series([
        function(call){
            if(helper.user.data_type==DT_USER){
                helper.item = biz9.set_item_data(DT_USER,helper.user.tbl_id,req.body);
                call();
            }else{
                call();
            }
        },
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.account_validate_password(helper.item.password,function(error,data){
                helper.validation_message=data;
                call();
            });
        },
        function(call){
            biz9.account_validate_email(db,helper.item.data_type,helper.item.tbl_id,helper.item.email,function(error,data){
                helper.validation_message=error;
                call();
            });
        },
        function(call){
            if(!helper.validation_message){
                biz9.update_item(db,helper.item.data_type,helper.item,function(error,data) {
                    helper.item=data;
                    call();
                });
            }
            else{
                call();
            }
        },
        function(call){
            if(!helper.validation_message){
                biz9.get_item(db,helper.item.data_type,helper.item.tbl_id,function(error,data) {
                    biz9.save_user(req,data);
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_delete_user
router.post("/delete_user", biz9.check_user,function(req,res){
    var helper = biz9.get_helper_user(req);
    async.series([
        function(call){
            if(helper.user.data_type==DT_USER){
                helper.item = biz9.set_item_data(DT_USER,helper.user.tbl_id,req.body);
                call();
            }else if(helper.user.data_type==DT_CUSTOMER){
                helper.item = biz9.set_item_data(DT_CUSTOMER,helper.user.tbl_id,req.body);
                call();
            }else{
                call();
            }
        },
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.delete_item(db,helper.item.data_type,helper.item.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            biz9.del_user(req);
            call();
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
