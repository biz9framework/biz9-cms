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
                bind_biz_prop_obj(data);
                $('#tb_item_edit_title').val(data.helper.item.title);
                $('#tb_item_edit_position').val(data.helper.item.position);
                $('#tb_item_edit_bio').val(data.helper.item.bio);
            }else{
                alert('Please make an selection');
            }
        }
    });
}
//9_item_submit
//9_update 9_item_save
//9_save
$('#btn_item_submit').click(function(){
    var obj =set_biz_prop_obj();
    tbl_id = $('#tb_item_tbl_id').val();
    data_type = $('#tb_item_data_type').val();
    obj.position=$('#tb_item_edit_position').val();
    obj.bio=$('#tb_item_edit_bio').val();
    obj.search = set_biz_search(obj);
    if(obj.title){
        hide_tabs();
        $.ajax({
            type: "POST",
            url: "/cloud/crud/update/"+data_type+"/"+tbl_id,
            enctype: 'multipart/form-data',
            data: obj-save,
            success: function(data){
                $("#div_validation_message").show().delay(2000).fadeOut();
                $("#h_item_edit_title").html(obj.title);
                $("#tb_item_edit_title_url").html(obj.title_url);
                show_tabs();
            }
        });
    }else{
        alert('Please enter a valid full name');
    }

});
//9_item_add_submit
//9_add
$('#btn_item_add_submit').click(function(event){
    tbl_id=0;
    data_type=$('#tb_item_data_type').val();
    list_count=$('#tb_item_list_count').val();
    var obj={};
    obj.title=$('#tb_item_add_title').val();
    obj.visible='false';
    obj.order=parseInt(list_count)+1;
    if(obj.title.length<=0){
        Swal.fire("Error",'Title must contain at least 3 characters',"error");
    }else{
        $('#tb_item_edit_title').val('');
        $('#tb_item_edit_html').val('');
        obj.title_url = obj.title.replace(/[^a-z0-9]+/ig, "_").toLowerCase();
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
        tbl_id = $(this).attr('tbl_id');
        $.ajax({
            type: "POST",
            url: "/team/copy_team/"+tbl_id,
            enctype: 'multipart/form-data',
            data: {},
            success: function(data){
                window.location.reload();
            }
        });
    }
});
//9_item_delete
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

