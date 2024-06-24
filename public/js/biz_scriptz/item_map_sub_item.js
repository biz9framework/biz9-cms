//9_get
function get_bind_biz_item(){
    hide_tabs();
    tbl_id = $('#tb_item_tbl_id').val();
    item_map_tbl_id = $('#tb_item_map_tbl_id').val();
    item_map_title_url = $('#tb_item_map_title_url').val();
    $.ajax({
        type: "GET",
        url: "/cloud/crud/get/"+item_map_title_url+"/"+tbl_id,
        enctype: 'multipart/form-data',
        data: {},
        success: function(data){
            if(data.helper){
                show_tabs();
                bind_photo_setting(data.helper.item);
                init_item_note(data.helper.item.note);
                bind_biz_prop_obj(data);
                $('#tb_item_edit_category').val(data.helper.item.category);
                $('#tb_item_edit_sub_note').val(data.helper.item.sub_note);
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
//9_item_submit
//9_update 9_item_save
//9_save
//9_update
$('#btn_item_submit').click(function(){
    tbl_id = $('#tb_item_tbl_id').val();
    item_map_tbl_id = $('#tb_item_map_tbl_id').val();
    item_map_title_url = $('#tb_item_map_title_url').val();
    hide_tabs();
    var obj =set_biz_prop_obj();
    obj.category=$('#tb_item_edit_category').val();
    obj.sub_note=$('#tb_item_edit_sub_note').val();
    obj.search = set_biz_search(obj);
    $.ajax({
        type: "POST",
        url: "/cloud/crud/update/"+item_map_title_url+"/"+tbl_id,
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
//9_add
//9_item_add_submit
$('#btn_item_add_submit').click(function(event){
    tbl_id=0;
    item_map_title_url=$('#tb_item_map_title_url').val();
    list_total=$('#tb_item_list_count').val();
    var obj={};
    obj.title=$('#tb_item_add_title').val();
    obj.visible='true';
    obj.order=parseInt(list_total)+1;
    obj.setting_sort_type='order';
    obj.setting_sort_order='asc';
    obj.item_map_tbl_id=$('#tb_item_map_tbl_id').val();
    obj.top_tbl_id=$('#tb_item_top_tbl_id').val();
    obj.top_data_type=$('#tb_item_top_data_type').val();
    obj.parent_tbl_id=$('#tb_item_parent_tbl_id').val();
    obj.parent_data_type=$('#tb_item_parent_data_type').val();
    if(obj.title.length<=0){
        Swal.fire("Error",'Title must contain at least 3 characters',"error");
    }else{
        $('#modal_item_add').modal('hide');
        $('#tb_item_edit_title').val('');
        $('#tb_item_edit_html').val('');
        obj.title_url = obj.title.replace(/[^a-z0-9]+/ig, "_").toLowerCase();
        $.ajax({
            type: "POST",
            url: "/cloud/crud/update/"+item_map_title_url+"/"+tbl_id,
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
        tbl_id = $(this).attr('tbl_id');
        item_map_tbl_id = $(this).attr('item_map_tbl_id');
        $.ajax({
            type: "POST",
            url: "/item_map/copy_sub_item/"+item_map_tbl_id+"/"+tbl_id,
            enctype: 'multipart/form-data',
            data: {},
            success: function(data){
                window.location.reload();
            }
        });
    }
});
