function get_bind_biz_item(){
    hide_tabs();
    tbl_id = $('#tb_item_tbl_id').val();
    data_type = $('#tb_item_data_type').val();
    $.ajax({
        type: "GET",
        url: "/cloud/crud/get/"+data_type+"/"+tbl_id,
        enctype: 'multipart/form-data',
        data: {},
        success: function(data){
            if(data.helper){
                show_tabs();
                bind_photo_setting(data.helper.item);
                init_item_note(data.helper.item.note);
                bind_biz_prop_obj(data);
                $('#tb_item_edit_category').val(data.helper.item.category);
            }else{
                alert('Please make an selection');
            }
        }
    });
}
//9_delete
//9_item_delete
$("#tbl_list").on("click", ".link_item_delete", function(){
    if (confirm("Are you sure?")) {
        tbl_id = $(this).attr('tbl_id');
        data_type = $(this).attr('data_type');
        $.ajax({
            type: "POST",
            url: "/item/delete_item/"+data_type +'/'+tbl_id,
            enctype: 'multipart/form-data',
            data: {},
            success: function(data){
                if(data.helper.error){
                    alert(data.helper.error);
                }else{
                    window.location.reload();
                }
            }
            });
    }
});
//9_add
//9_item_add_submit
$('#btn_item_add_submit').click(function(event){
    tbl_id=0;
    list_total=$('#tb_item_list_count').val();
    data_type=$('#tb_item_data_type').val();
    var obj={};
    obj.title=$('#tb_item_add_title').val();
    obj.visible='true';
    obj.order=parseInt(list_total)+1;
    obj.parent_tbl_id=$('#tb_parent_tbl_id').val();
    obj.parent_data_type=$('#tb_parent_data_type').val();
    obj.top_tbl_id=$('#tb_top_tbl_id').val();
    obj.top_data_type=$('#tb_top_data_type').val();
    if(obj.title.length<=0){
        Swal.fire("Error",'Title must contain at least 3 characters',"error");
    }else{
        obj.title_url = obj.title.replace(/[^a-z0-9]+/ig, "_").toLowerCase();
        $('#tb_item_edit_title').val('');
        $.ajax({
            type: "POST",
            url: "/cloud/crud/update/"+data_type+"/"+tbl_id,
            enctype: 'multipart/form-data',
            data: obj,
            success: function(data){
                if(data.helper.error){
                    Swal.fire("Error",data.helper.error,"error");
                }else{
                    window.location.reload();
                }
            }
        });
    }
    return false;
});
//9_item_copy
//9_copy
$("#tbl_list").on("click", ".link_item_copy", function(){
    if (confirm("Are you sure?")) {
        parent_tbl_id=$('#tb_parent_tbl_id').val();
        parent_data_type=$('#tb_parent_data_type').val();
        tbl_id = $(this).attr('tbl_id');
        data_type = $(this).attr('data_type');
        $.ajax({
            type: "POST",
            url: "/item/copy_sub_item/"+parent_data_type+"/"+parent_tbl_id+"/"+tbl_id,
            enctype: 'multipart/form-data',
            data: {},
            success: function(data){
                window.location.reload();
            }
        });
    }
});
//9_item_submit
//9_update 9_item_save
//9_save
$('#btn_item_submit').click(function(){
    var obj =set_biz_prop_obj();
    obj.tbl_id = $('#tb_item_tbl_id').val();
    obj.data_type = $('#tb_item_data_type').val();
    hide_tabs();
    obj.category=$('#tb_item_edit_category').val();
    obj.search = set_biz_search(obj);
    $.ajax({
        type: "POST",
        url: "/cloud/crud/update/"+obj.data_type+"/"+obj.tbl_id,
        enctype: 'multipart/form-data',
        data: obj,
        success: function(data){
            $("#div_validation_message").show().delay(2000).fadeOut();
            $("#h_item_edit_title").html(obj.title);
            $('#tb_item_edit_title_url').html(obj.title_url);
            show_tabs();
        }
    });
});
