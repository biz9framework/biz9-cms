var router = express.Router();
//9_ping
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
//9_index
//9_contact_list
router.get('/',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='contact_edit_list';
    helper.render_list='/';
    helper.page_title=APP_TITLE + ' ContactZ';
    helper.list_title=' ContactZ';
    helper.show_add=true;
    helper.item=biz9.get_new_item(DT_CONTACT,0);
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
            biz9.get_sql(db,DT_CONTACT,sql,sort,function(error,data_list) {
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
//9_contact_edit
router.get('/edit_contact/:tbl_id',biz9.check_user,function(req,res){
    var helper = biz9.get_helper_user(req);
    helper.render='contact_edit';
    helper.back_url='/contact';
    helper.item=biz9.get_new_item(DT_CONTACT,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_CONTACT,helper.tbl_id,function(error,data) {
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

//9_update_contact
router.post("/update_contact/:tbl_id",biz9.check_user,function(req,res){
    var helper = biz9.get_helper_user(req);
    helper.item = biz9.set_item_data(DT_CONTACT,helper.tbl_id,req.body);
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
                biz9.update_item(db,DT_CONTACT,helper.item,function(error,data) {
                    helper.item=data;
                    call();
                });
            }
            else{
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
module.exports = router;
