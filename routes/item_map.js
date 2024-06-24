var router = express.Router();
//a9_ping
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
//9_index
//9_item_map_list
router.get('/',biz9.check_user, function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='item_map_edit_list';
    helper.render_list='/item_map/list_item';
    helper.page_title=APP_TITLE + ' Content';
    helper.list_title=' Items';
    helper.show_add=true;
    helper.item=biz9.get_new_item(DT_ITEM_MAP,0);
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
            sort={date_create:1};
            biz9.get_sql(db,DT_ITEM_MAP,sql,sort,function(error,data_list) {
                helper.item_list = data_list;
                call();
            });
        },
        function(call){
            //top set to null
            if(helper.is_top){
                biz9.save_cookie(req,'back_list',null);
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
//9_item_map_sub_item_list
//9_sub_item_list
//9_sub_list
router.get('/sub_item/:item_map_tbl_id/:item_parent_tbl_id',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='item_map_sub_item_edit_list';
    helper.show_add=true;
    helper.item_map=biz9.get_new_item(DT_ITEM_MAP,0);
    helper.item_parent=biz9.get_new_item(DT_BLANK,0);
    helper.back_item=biz9.get_new_item(DT_BLANK,0);

    helper.item_top=biz9.get_new_item(DT_BLANK,0);
    helper.item_parent=biz9.get_new_item(DT_BLANK,0);

    helper.sub_item_list=[];
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_ITEM_MAP,helper.item_map_tbl_id, function(error,data) {
                helper.item_map=data;
                helper.item_top=data;
                call();
            });
        },
        function(call){
            if(helper.item_parent_tbl_id!=0){
                biz9.get_item(db,helper.item_map.title_url,helper.item_parent_tbl_id, function(error,data) {
                    helper.item_parent=data;
                    call();
                });
            }else{
                helper.item_parent=helper.item_map;
                call();
            }
        },
        function(call){
            if(helper.item_parent_tbl_id!=0){
                sql={parent_tbl_id:helper.item_parent.tbl_id};
            }else{
                sql={parent_tbl_id:helper.item_map.tbl_id};
            }
            sort={date_create:-1};
            biz9.get_sql(db,helper.item_map.title_url,sql,sort,function(error,data_list) {
                helper.item_list=data_list;
                call();
            });
        },
        function(call){
            helper.page_title=APP_TITLE + ' Items';
            helper.list_title=helper.item_parent.title+ ' Items';
            call();
        },
        function(call){
            //top set to null
            if(helper.is_top){
                biz9.save_cookie(req,'back_list',null);
                back_list=[{title:get_type(helper.item_parent.data_type).title,url:get_type(helper.item_parent.data_type).url}];
                back_list.push({title:helper.item_parent.title,url:helper.url});
            }else{
                back_list=biz9.get_cookie(req,'back_list');
                if(!back_list){
                    back_list=[{title:get_type(helper.item_parent.data_type).title,url:get_type(helper.item_parent.data_type).url}];
                }else{
                    add=true;
                    for(a=0;a<back_list.length;a++){
                        if(back_list[a]){
                            if(back_list[a].tbl_id==helper.item_parent.tbl_id){
                                if(helper.item_parent.tbl_id!=back_list[a].tbl_id){
                                    delete back_list[a];
                                }
                                add=false;
                            }
                            if(add==false){
                                if(helper.item_parent.tbl_id!=back_list[a].tbl_id){
                                    delete back_list[a];
                                }
                            }
                        }
                    }
                    if(add){
                        back_list.push({title:helper.item_parent.title,url:helper.url,tbl_id:helper.item_parent.tbl_id});
                        add=true;
                    }
                }
            }
            biz9.save_cookie(req,'back_list',back_list);
            helper.back_list=back_list;
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

//9_item_map_edit
router.get('/item_map_edit/:tbl_id',biz9.check_user,function(req,res,next){
    var helper = biz9.get_helper_user(req);
    helper.render='item_map_edit';
    helper.item_map=biz9.get_new_item(DT_ITEM_MAP,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_ITEM_MAP,helper.tbl_id, function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            helper.back_url =req.headers.referer;
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
//9_sub_item_edit
//9_edit_sub_item
router.get('/sub_item_edit/:item_map_tbl_id/:sub_item_tbl_id',biz9.check_user,function(req,res,next){
    var helper = biz9.get_helper_user(req);
    helper.render='item_map_sub_item_edit';
    helper.item_map=biz9.get_new_item(DT_ITEM_MAP,helper.item_map_tbl_id);
    helper.item=biz9.get_new_item(DT_BLANK,helper.sub_item_tbl_id);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_ITEM_MAP,helper.item_map.tbl_id, function(error,data) {
                helper.item_map=data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.item_map.title_url,helper.item.tbl_id, function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            if(helper.item.tbl_id!=0){
                biz9.get_item(db,helper.item_map.title_url,helper.item.parent_tbl_id, function(error,data) {
                    helper.item_parent=data;
                    call();
                });
            }else{
                helper.item_parent=helper.item_map;
                call();
            }
        },
        function(call){
            back_list=biz9.get_cookie(req,'back_list');
            //top set to null
            if(back_list){
                add=true;
                for(a=0;a<back_list.length;a++){
                    if(back_list[a]){
                        if(back_list[a].tbl_id==helper.item_parent.tbl_id){
                            //back_list[a].url='#';
                            if(helper.item_parent.tbl_id!=back_list[a].tbl_id){
                                delete back_list[a];
                            }
                            add=false;
                        }
                        if(add==false){
                            if(helper.item_parent.title!=back_list[a].title){
                                delete back_list[a];
                            }
                        }
                    }
                }
                if(add){
                    add=true;
                }
            }
            helper.back_list=back_list;
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
//9_elete_item_map
router.post("/delete_item_map/:tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper_user(req);
    helper.item_map = biz9.get_new_item(DT_ITEM_MAP,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },

        function(call){
            biz9.get_item(db,DT_ITEM_MAP,helper.tbl_id, function(error,data) {
                helper.item_map=data;
                helper.title_url = helper.item_map.title_url;
                call();
            });
        },
        function(call){
            biz9.delete_item(db,DT_ITEM_MAP,helper.tbl_id, function(error,data) {
                helper.item_map=data;
                call();
            });
        },
        function(call){
            if(helper.title_url){
                biz9.drop(db,helper.title_url,function(error,data) {
                    helper.drop=data;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            sql={parent_tbl_id:helper.tbl_id};
            biz9.delete_sql(db,DT_PHOTO,sql,function(error,data) {
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
//9_copy_sub_item
//9_sub_item_copy
//router.post("/copy_sub_item/:item_map_tbl_id/:tbl_id", function(req, res) {
router.post("/copy_sub_item/:item_map_tbl_id/:tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper_user(req);
    helper.item_map = biz9.get_new_item(DT_ITEM_MAP,0);
    helper.sub_item = biz9.get_new_item(DT_BLANK,0);
    helper.sub_item_list = [];
    helper.top_sub_item_list = [];
    helper.p1_org_sub_item_list = [];
    helper.p2_org_sub_item_list = [];
    helper.p3_org_sub_item_list = [];
    helper.p4_org_sub_item_list = [];
    helper.p5_org_sub_item_list = [];
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_ITEM_MAP,helper.item_map_tbl_id,function(error,data) {
                helper.item_map = data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.item_map.title_url,helper.tbl_id,function(error,data) {
                helper.sub_item = data;
                call();
            });
        },
        function(call){
            if(helper.sub_item.parent_tbl_id==helper.item_map.tbl_id){
                helper.sub_item.parent_tbl_id=helper.item_map.tbl_id;
                helper.sub_item.parent_data_type=helper.item_map.title_url;
                helper.sub_item.top_tbl_id=helper.item_map.tbl_id;
                helper.sub_item.top_data_type=helper.item_map.title_url;
            }else{
                helper.sub_item.parent_tbl_id=helper.sub_item.parent_tbl_id;
                helper.sub_item.parent_data_type=helper.sub_item.parent_data_type;
                helper.sub_item.top_tbl_id=helper.item_map.tbl_id;
                helper.sub_item.top_data_type=helper.item_map.title_url;
            }
            //
            helper.sub_item.is_parent=true;
            helper.sub_item_copy =biz9.set_new_sub_item(helper.item_map.title_url,helper.sub_item);
            biz9.update_item(db,helper.item_map.title_url,helper.sub_item_copy,function(error,data) {
                helper.sub_item_copy=data;
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.tbl_id};
            sort={};
            biz9.get_sql(db,helper.item_map.title_url,sql,sort,function(error,data_list) {
                helper.sub_item_list = data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.sub_item_list.length;a++){
                helper.sub_item.is_parent=false;
                helper.sub_item_list[a].parent_tbl_id=helper.sub_item_copy.tbl_id;//top
                helper.sub_item_list[a].parent_data_type=helper.sub_item_copy.data_type;
                helper.sub_item_list[a].top_tbl_id=helper.item_map.tbl_id;
                helper.sub_item_list[a].top_data_type=helper.item_map.title_url;
                helper.top_sub_item_list.push(biz9.set_new_sub_item(helper.item_map.title_url,helper.sub_item_list[a]));
            }
            call();
        },
        function(call){
            if(helper.top_sub_item_list.length>0){
                biz9.update_list(db,helper.top_sub_item_list,function(error,data_list) {
                    helper.top_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            sql = {};
            sort={};
            biz9.get_sql(db,helper.item_map.title_url,sql,sort,function(error,data_list) {
                helper.other_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.top_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.top_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.top_sub_item_list[a].tbl_id;
                        helper.other_list[b].parent_data_type=helper.top_sub_item_list[a].data_type;
                        helper.other_list[b].top_tbl_id=helper.item_map.tbl_id;
                        helper.other_list[b].top_data_type=helper.item_map.title_url;
                        helper.p1_org_sub_item_list.push(biz9.set_new_sub_item(helper.item_map.title_url,helper.other_list[b]));
                    }
                }
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
            res.send({helper:helper});
            res.end();
        });
});
function get_sub_type(parent_type){
    switch(parent_type) {
        case DT_PROJECT:
            return DT_SUB_PROJECT;
        case DT_SUB_PROJECT:
            return DT_SUB_PROJECT;
        case DT_ITEM_MAP:
            return DT_ITEM_MAP;
    }
}
function get_type(type){
    switch(type) {
        case DT_PROJECT:
            return {title:'Projects',url:'/project'};

        case DT_ITEM_MAP:
            return {title:'Items',url:'/'};
        default:
            return {title:'Items',url:'/'};
    }
}
module.exports = router;
