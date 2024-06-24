var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    var helper = biz9.get_helper(req);
    res.send({'helper':helper});
    res.end();
});
router.get('/',function(req, res, next) {
    //res.redirect('/item_map/');
    res.redirect('/order/orderz/');
    res.end();
});
router.get('/logout', function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    async.series([
        function(call){
            biz9.del_user(req);
            call();
        },
    ],
        function(err, result){
            res.redirect('/');
        });
});
router.get('/register',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='register';
    helper.g_app_title=APP_TITLE;
    helper.cms=biz9.get_new_biz_item(DT_ITEM,0);
    async.series([
        function(call){
            if(helper.user.tbl_id!=0){
                res.redirect('/');
            }
            else{
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
            sql = {title_url:'cms'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.cms = data_list[0];
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
router.get('/login', function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='login';
    helper.g_app_title=APP_TITLE;
    helper.cms=biz9.get_new_biz_item(DT_ITEM,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        //test--start
        /*
        function(call){
            email='ceo@bossappz.com';
            password='1234567';
            sql_obj = {email:email,password:password};
            biz9.get_sql(db,DT_USER,sql_obj,{},function(error,data_list) {
                if(data_list.length>0) {
                    helper.item = data_list[0];
                    helper.login=true;
                    biz9.save_user(req,helper.item);
                    res.redirect('/');
                }
            });
        },
        */
        //test--end
        /*
        function(call){
            if(helper.user.tbl_id!=0){
                res.redirect('/');
            }
            else{
                call();
            }
        },
        */
        function(call){
            sql = {title_url:'cms'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.cms = data_list[0];
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
router.post('/logincheckemail',function(req, res) {
    var helper = biz9.get_helper_user(req);
    helper.item = biz9.set_item_data(DT_USER,0,req.body);
    helper.validation_message =null;
    helper.login=false;
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        //check user
        function(call){
            sql_obj = {email:helper.item.email,password:helper.item.password};
            biz9.get_sql(db,DT_USER, sql_obj,{}, function(error,data_list) {
                if(data_list.length>0) {
                    helper.item = data_list[0];
                    helper.login=true;
                    biz9.save_user(req,helper.item);
                    call();
                }
                else{
                    helper.validation_message = "The Login Is Not Valid."
                    call();
                }
            });
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
//9_cms
router.get('/get_cms',function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.cms=biz9.get_new_biz_item(DT_ITEM,0);
    helper.biz9_framework_version=BIZ9_CMS_VERSION;
    helper.app_version=APP_VERSION;
    helper.project_id=PROJECT_ID;
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            sql = {title_url:'cms'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.cms = data_list[0];
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
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
