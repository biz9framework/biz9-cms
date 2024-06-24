var router = express.Router();
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
//9_sub_project_edit_list sub_project_edit_list
router.get('/sub_item_list/:parent_data_type/:parent_tbl_id',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='sub_item_edit_list';
    helper.show_add=true;
    helper.parent=biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.item=biz9.get_new_item(DT_ITEM,0);
    helper.top=biz9.get_new_item(DT_BLANK,0);
    //helper.back_url =helper.back_url;
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.parent_data_type,helper.parent_tbl_id, function(error,data) {
                helper.parent=data;
                call();
            });
        },
        function(call){
            if(helper.is_top){
                helper.top = helper.parent;
            }else{
                helper.top.data_type=helper.parent.top_data_type;
                helper.top.tbl_id=helper.parent.top_tbl_id;
            }
            call();
        },
        function(call){
            sql={parent_tbl_id:helper.parent.tbl_id};
            sort={date_create:-1};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.item_list=data_list;
                call();
            });
        },
        function(call){
            helper.page_title=helper.parent.title + ' Items';
            helper.list_title=helper.parent.title+ ' Items';
            call();
        },
        function(call){
            //top set to null
            if(helper.is_top){
                biz9.save_cookie(req,'back_list',null);
                back_list=[{title:get_type(helper.parent.data_type).title,url:get_type(helper.parent.data_type).url}];
                back_list.push({title:helper.parent.title,url:helper.url});
            }else{
                back_list=biz9.get_cookie(req,'back_list');
                if(!back_list){
                    back_list=[{title:get_type(helper.parent.data_type).title,url:get_type(helper.parent.data_type).url}];
                }else{
                    add=true;
                    for(a=0;a<back_list.length;a++){
                        if(back_list[a]){
                            if(back_list[a].tbl_id==helper.parent.tbl_id){
                                if(helper.parent.tbl_id!=back_list[a].tbl_id){
                                    delete back_list[a];
                                }
                                add=false;
                            }
                            if(add==false){
                                if(helper.parent.tbl_id!=back_list[a].tbl_id){
                                    delete back_list[a];
                                }
                            }
                        }
                    }
                    if(add){
                        back_list.push({title:helper.parent.title,url:helper.url,tbl_id:helper.parent.tbl_id});
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
//9_delete_item
router.post("/delete_item/:data_type/:tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper_user(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                helper.item = data;
                call();
            });
        },
        function(call){
            if(helper.item.delete_protection!='true'){
                biz9.delete_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                    helper.item = data;
                    call();
                });
            }else{
                helper.validation_message='Delete Protection Is On.';
                call();
            }
        },
        //photo
        function(call){
            if(helper.item.delete_protection!='true'){
                sql={top_tbl_id:helper.tbl_id};
                biz9.delete_sql(db,DT_PHOTO,sql,function(error,data_list) {
                    helper.del_top_photo_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        //item_top
        function(call){
            if(helper.item.delete_protection!='true'){
                sql={top_tbl_id:helper.tbl_id};
                biz9.delete_sql(db,DT_ITEM,sql,function(error,data_list) {
                    helper.del_top_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        //item_parent
        function(call){
            if(helper.item.delete_protection!='true'){
                sql={parent_tbl_id:helper.tbl_id};
                biz9.delete_sql(db,DT_ITEM,sql,function(error,data_list) {
                    helper.del_top_item_list=data_list;
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


//9_edit_sub_item
router.get('/edit_sub_item/:data_type/:tbl_id',biz9.check_user,function(req,res,next){
    var helper = biz9.get_helper_user(req);
    helper.render='sub_item_edit';
    //helper.back_url='/blog_post';
    helper.item=biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.parent=biz9.get_new_item(helper.data_type,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            back_list=biz9.get_cookie(req,'back_list');
            //top set to null
            if(back_list){
                add=true;
                for(a=0;a<back_list.length;a++){
                    if(back_list[a]){
                        if(back_list[a].tbl_id==helper.parent.tbl_id){
                            //back_list[a].url='#';
                            if(helper.parent.tbl_id!=back_list[a].tbl_id){
                                delete back_list[a];
                            }

                            add=false;
                        }
                        if(add==false){
                            if(helper.parent.title!=back_list[a].title){
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
//9_item_photo_list
router.get('/item_photo_list/:data_type/:tbl_id',biz9.check_user, function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='item_photo_edit_list';
    helper.show_add=true;
    helper.item=biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.top=biz9.get_new_item(DT_BLANK,0);
    helper.item_list=[];
    helper.photo_obj=biz9.get_new_item(DT_PHOTO,0);
    helper.back_url =req.headers.referer;
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                helper.item=data;
                helper.list_title=helper.item.title+ ' Photos';
                call();
            });
        },
        function(call){
            if(helper.is_top){
                helper.top = helper.item;
            }else{
                helper.top.data_type=helper.item.top_data_type;
                helper.top.tbl_id=helper.item.top_tbl_id;
            }
            call();
        },
        function(call){
            sql={parent_tbl_id:helper.tbl_id};
            sort={date_create:-1};
            biz9.get_sql(db,DT_PHOTO,sql,sort,function(error,data_list) {
                helper.item_list=data_list;
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
//9_copy_item
router.post("/old_copy_item/:data_type/:tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper_user(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.other_list = [];
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
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            if(helper.data_type==DT_PROJECT){
                helper.item_copy=biz9.set_new_project(DT_PROJECT,helper.item);
            }else if(helper.data_type==DT_BLOG_POST){
                helper.item_copy=biz9.set_new_blog_post(DT_BLOG_POST,helper.item);
            }else if(helper.data_type==DT_PRODUCT){
                helper.item_copy=biz9.set_new_product(DT_PRODUCT,helper.item);
            }else if(helper.data_type==DT_CATEGORY){
                helper.item_copy=biz9.set_new_category(DT_CATEGORY,helper.item);
            }else if(helper.data_type==DT_SERVICE){
                helper.item_copy=biz9.set_new_service(DT_SERVICE,helper.item);
            }else if(helper.data_type==DT_EVENT){
                helper.item_copy=biz9.set_new_event(DT_EVENT,helper.item);
            }else if(helper.data_type==DT_MEMBER){
                helper.item_copy=biz9.set_new_member(DT_MEMBER,helper.item);
            }
            biz9.update_item(db,helper.data_type,helper.item_copy,function(error,data) {
                helper.item_copy=data;
                call();
            });
        },
        function(call){
            biz9.copy_photo_list(db,helper.tbl_id,helper.item_copy.tbl_id,function(error,data_list) {
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.tbl_id};
            sort={date_create:1};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.sub_item_list = data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.sub_item_list.length;a++){
                helper.sub_item_list[a].is_parent=false;
                helper.sub_item_list[a].parent_tbl_id=helper.item_copy.tbl_id;//top
                helper.top_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.sub_item_list[a]));
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
            if(helper.item.top_data_type){
                sql = {top_data_type:helper.item.top_data_type};
            }else{
                sql = {top_data_type:helper.item.data_type};
            }

            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.other_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.top_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.top_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.top_sub_item_list[a].tbl_id;
                        helper.p1_org_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p1_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p1_org_sub_item_list,function(error,data_list) {
                    helper.p1_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p1_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p1_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p1_org_sub_item_list[a].tbl_id;
                        helper.p2_org_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p2_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p2_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p2_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p2_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p2_org_sub_item_list[a].tbl_id;
                        helper.p3_org_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p2_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p2_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p3_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p3_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p3_org_sub_item_list[a].tbl_id;
                        helper.p4_org_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p3_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p3_org_sub_item_list=data_list;
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
//9_copy_item
router.post("/copy_item/:data_type/:tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper_user(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.copy_top_item(db,helper.data_type,helper.tbl_id,function(error,data) {
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
            res.send({helper:helper});
            res.end();
        });
});
//9_sub_item_copy
router.post("/copy_sub_item/:parent_data_type/:parent_tbl_id/:sub_tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper_user(req);
    helper.parent_item = biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.sub_item = biz9.get_new_item(DT_ITEM,helper.sub_tbl_id);
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
            biz9.get_item(db,helper.parent_item.data_type,helper.parent_item.tbl_id,function(error,data) {
                helper.parent_item = data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.sub_item.data_type,helper.sub_item.tbl_id,function(error,data) {
                helper.sub_item = data;
                call();
            });
        },
        function(call){
            if(helper.sub_item.parent_tbl_id==helper.parent_item.tbl_id){
                helper.sub_item.parent_tbl_id=helper.sub_item.parent_tbl_id;
            }else{
                helper.sub_item.parent_tbl_id=helper.sub_item.parent_tbl_id;
            }
            helper.sub_item.is_parent=true;
            helper.sub_item_copy =biz9.set_new_sub_item(helper.sub_item.data_type,helper.sub_item);
            biz9.update_item(db,helper.sub_item.data_type,helper.sub_item_copy,function(error,data) {
                helper.sub_item_copy=data;
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.sub_item.tbl_id};
            sort={};
            biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                helper.sub_item_list = data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.sub_item_list.length;a++){
                helper.sub_item_list[a].is_parent=false;
                helper.sub_item_list[a].parent_tbl_id=helper.sub_item_copy.tbl_id;//top
                helper.top_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.sub_item_list[a]));
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
            biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                helper.other_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.top_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.top_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.top_sub_item_list[a].tbl_id;
                        //helper.other_list[b].is_parent=false;
                        helper.p1_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p1_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p1_org_sub_item_list,function(error,data_list) {
                    helper.p1_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p1_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p1_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p1_org_sub_item_list[a].tbl_id;
                        helper.other_list[b].is_parent=false;
                        helper.p2_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p2_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p2_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p2_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p2_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p2_org_sub_item_list[a].tbl_id;
                        //helper.other_list[b].is_parent=false;
                        helper.p3_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p2_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p2_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p3_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p3_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p3_org_sub_item_list[a].tbl_id;
                        //helper.other_list[b].is_parent=false;
                        helper.p4_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p3_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p3_org_sub_item_list=data_list;
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
//9_delete_sub_item
router.post("/delete_sub_item/:data_type/:tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper_user(req);
    helper.sub_item = biz9.get_new_item(DT_ITEM,helper.tbl_id);
    helper.del_list=[];
    helper.copy_sub_item_list = [];
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
            biz9.get_item(db,helper.sub_item.data_type,helper.sub_item.tbl_id,function(error,data) {
                helper.sub_item = data;
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.sub_item.tbl_id};
            sort={date_create:-1};
            biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                helper.del_list = data_list;
                call();
            });
        },
        function(call){
            async.forEachOf(helper.del_list,function(value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p1_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p1_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p2_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p2_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p3_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p3_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p4_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p4_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            biz9.delete_list(db,helper.sub_item.data_type,helper.del_list,function(error,data) {
                helper.del_list=data;
                call();
            });
        },
        function(call){
            biz9.delete_item(db,helper.sub_item.data_type,helper.tbl_id,function(error,data) {
                helper.sub_item = data;
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

//9_item_photo_list
router.get('/oldphoto/:data_type/:tbl_id',biz9.check_user,function(req, res, next) {
    var helper = biz9.get_helper_user(req);
    helper.render='item_photo_edit_list';
    helper.show_add=true;
    helper.item=biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.photo_obj=biz9.get_new_item(DT_PHOTO,0);
    helper.item_list=[];
    helper.back_url =req.headers.referer;
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                helper.item=data;
                helper.list_title=helper.item.title+ ' Photos';
                call();
            });
        },
        function(call){
            sql={parent_tbl_id:helper.tbl_id};
            sort={date_create:-1};
            biz9.get_sql(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.item_list=data_list;
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
function get_type(type){
    switch(type) {
        case DT_BLOG_POST:
            return {title:'Blog Posts',url:'/blog_post'};
        case DT_CATEGORY:
            return {title:'Categorys',url:'/category'};
        case DT_EVENT:
            return {title:'Events',url:'/event'};
        case DT_PROJECT:
            return {title:'Projects',url:'/project'};
        case DT_PRODUCT:
            return {title:'Products',url:'/product'};
        case DT_SERVICE:
            return {title:'Services',url:'/service'};
        case DT_MEMBER:
            return {title:'Member',url:'/member'};
        case DT_ITEM_MAP:
            return {title:'Items',url:'/'};
        case DT_ITEM:
            return {title:'Sub Items',url:'/'};
        default:
            return {title:'Blank',url:'/'};
    }
}
module.exports = router;
