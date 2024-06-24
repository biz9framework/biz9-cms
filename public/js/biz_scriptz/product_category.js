//9_get
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
                $('#tb_item_edit_title').val(data.helper.item.title);
                $('#tb_item_edit_sub_note').val(data.helper.item.sub_note);
            }else{
                alert('Please make an selection');
            }
        }
    });
}
//9_copy
$("#tbl_list").on("click", ".link_item_copy", function(){
    if (confirm("Are you sure?")) {
        tbl_id = $(this).attr('tbl_id');
        data_type = $(this).attr('data_type');
        $.ajax({
            type: "POST",
            url: "/item/copy_item/"+data_type+"/"+tbl_id,
            enctype: 'multipart/form-data',
            data: {},
            success: function(data){
                window.location.reload();
            }
        });
    }
});
//9_submit//9_update
$('#btn_item_submit').click(function(){
    tbl_id=$('#tb_item_tbl_id').val();
    data_type=$('#tb_item_data_type').val();
    var obj =set_biz_prop_obj();
    obj.sub_note=$('#tb_item_edit_sub_note').val();
    obj.search = set_biz_search(obj);
    if(obj.title){
        hide_tabs();
        $.ajax({
            type: "POST",
            url: "/cloud/crud/update/"+data_type+"/"+tbl_id,
            enctype: 'multipart/form-data',
            data: obj,
            success: function(data){
                $("#div_validation_message").show().delay(2000).fadeOut();
                $("#h_item_edit_title").html(obj.title);
                show_tabs();
            }
        });
    }else{
        alert('Please enter a valid title');
    }
});
//9_add
//9_add_submit
$('#btn_item_add_submit').click(function(event){
    tbl_id=0;
    data_type=$('#tb_item_data_type').val();
    list_count=$('#tb_item_list_count').val();
    var obj={};
    obj.title=$('#tb_item_add_title').val();
    obj.visible='true';
    obj.parent_tbl_id=$('#tb_parent_tbl_id').val();
    obj.order=parseInt(list_count)+1;
    if(obj.title.length<=0){
        Swal.fire("Error",'Title must contain at least 3 characters',"error");
    }else{
        obj.title_url = obj.title.replace(/[^a-z0-9]+/ig, "_").toLowerCase();
        $.ajax({
            type: "POST",
            url: "/cloud/crud/update/" +data_type+ "/"+tbl_id,
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
//9_delete
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
