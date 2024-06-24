//9_get
function get_bind_biz_item(){
    hide_tabs();
    $("#tb_item_edit_title_url").hide(); //hide
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
                if(!data.helper.item.first_name){
                    data.helper.item.first_name = ' ';
                }
                if(!data.helper.item.last_name){
                    data.helper.item.last_name = ' ';
                }
                $("#h_item_edit_title").html(data.helper.item.first_name + " " +data.helper.item.last_name);
                $('#sel_item_edit_category').val(data.helper.item.category);
                $('#tb_item_edit_first_name').val(data.helper.item.first_name);
                $('#tb_item_edit_last_name').val(data.helper.item.last_name);
                $('#tb_item_edit_position').val(data.helper.item.position);
                $('#tb_item_edit_location').val(data.helper.item.location);
                $('#sel_item_edit_visible').val(data.helper.item.visible);
                $('#tb_item_edit_bio').val(data.helper.item.bio);
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
//9_save//9_update
$('#btn_item_submit').click(function(){
    var obj =set_biz_prop_obj();
    tbl_id = $('#tb_item_tbl_id').val();
    data_type = $('#tb_item_data_type').val();
    obj.first_name=$('#tb_item_edit_first_name').val();
    obj.last_name=$('#tb_item_edit_last_name').val();
    obj.title = obj.first_name + " " +obj.last_name;
    obj.position=$('#tb_item_edit_position').val();
    obj.location=$('#tb_item_edit_location').val();
    obj.bio=$('#tb_item_edit_bio').val();
    obj.category=$('#sel_item_edit_category option:selected').text();
    if(obj.first_name){
        hide_tabs();
        $.ajax({
            type: "POST",
            url: "/cloud/crud/update/"+data_type+"/"+tbl_id,
            enctype: 'multipart/form-data',
            data: obj,
            success: function(data){
                $("#div_validation_message").show().delay(2000).fadeOut();
                $("#h_item_edit_title").html(obj.first_name + " " +obj.last_name);
                show_tabs();
            }
        });
    }else{
        alert('Please enter a valid first name');
    }
});
//9_add
$('#btn_item_add_submit').click(function(event){
    tbl_id=0;
    data_type=$('#tb_item_data_type').val();
    list_count=$('#tb_item_list_count').val();
    var obj={};
    obj.first_name=$('#tb_item_add_title').val();
    obj.visible='false';
    obj.order=parseInt(list_count)+1;
    if(obj.first_name.length<=0){
        Swal.fire("Error",'First name must contain at least 3 characters',"error");
    }else{
        $('#tb_item_edit_title').val('');
        $('#tb_item_edit_html').val('');
        obj.title_url = obj.first_name.replace(/[^a-z0-9]+/ig, "_").toLowerCase();
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
