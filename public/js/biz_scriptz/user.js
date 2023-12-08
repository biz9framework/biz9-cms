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
                $('#tb_item_edit_password').val(data.helper.item.password)
                $('#tb_item_edit_first_name').val(data.helper.item.first_name)
                $('#tb_item_edit_last_name').val(data.helper.item.last_name)
                $('#tb_item_edit_email').val(data.helper.item.email)
                $('#tb_item_edit_first_name').val(data.helper.item.first_name)
            }else{
                alert('Please make an selection');
            }
        }
    });
}
//9_item_submit
//9_item_update
$('#btn_item_submit').click(function(){
    hide_tabs();
    data_type = $('#tb_item_data_type').val();
    obj={};
    obj.first_name = $('#tb_item_edit_first_name').val();
    obj.last_name = $('#tb_item_edit_last_name').val();
    obj.email = $('#tb_item_edit_email').val();
    obj.password = $('#tb_item_edit_password').val();
    obj.photofilename=$('#tb_item_photofilename').val();
    if(!validate_email(obj.email)){
        Swal.fire("Error","Please enter a valide email address","error");
        show_tabs();
    }
    else{
        $.ajax({
            type: "POST",
            url: "/user/update_profile/",
            enctype: 'multipart/form-data',
            data:obj,
            success: function(data){
                if(data.helper.error){
                    Swal.fire("Error",data.helper.error,"error");
                }else{
                    $("#div_validation_message").show().delay(2000).fadeOut();
                }
                show_tabs();
            }
        });
    }
});
//9_item_add_submit
$('#btn_item_add_submit').click(function(event){
    tbl_id=0;
    data_type=$('#tb_item_data_type').val();
    list_count=$('#tb_item_list_count').val();
    var obj={};
    obj.email=$('#tb_item_add_title').val();
    obj.visible='true';
    obj.order=parseInt(list_count)+1;
    if(obj.email.length<=0){
        Swal.fire("Error",'Title must contain at least 3 characters',"error");
    }else if(!validate_email(obj.email)){
        Swal.fire("Error",'Please enter a valide email.',"error");
    }
    else{
        $.ajax({
            type: "POST",
            url: "/user/add",
            enctype: 'multipart/form-data',
            data: obj,
            success: function(data){
                if(data.helper.error){
                    Swal.fire("Error",data.helper.error,"error");
                }else{
                    $('#tb_item_edit_title').val('');
                    window.location='/user';
                }

                return false;
            }
        });
    }
    return false;
});

//9_item_edit
//9_edit
$("#tbl_list").on("click", ".link_item_edit", function(){
    tbl_id = $(this).attr('tbl_id');
    window.location='/user/edit_user/'+tbl_id;
});
