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
                $('#tb_item_edit_first_name').val(data.helper.item.first_name);
                $('#tb_item_edit_password').val(data.helper.item.password);
                $('#tb_item_edit_last_name').val(data.helper.item.last_name);
                $('#tb_item_edit_company').val(data.helper.item.company);
                $('#tb_item_edit_email').val(data.helper.item.email);
                $('#tb_item_edit_city').val(data.helper.item.city);
                $('#select2-sel_item_country-container').html(data.helper.item.country)
                $('#select2-sel_item_state-container').html(data.helper.item.state)
            }else{
                alert('Please make an selection');
            }
        }
    });
}
//9_save
$('#btn_item_submit').click(function(){
    var obj={};
    if($('#cb_item_edit_visible').is(":checked")){
        obj.visible='true';
    }else{
        obj.visible='false';
    }
    tbl_id = $('#tb_item_tbl_id').val();
    obj.data_type = $('#tb_item_data_type').val();
    obj.first_name = $('#tb_item_edit_first_name').val();
    obj.password = $('#tb_item_edit_password').val();
    obj.last_name = $('#tb_item_edit_last_name').val();
    obj.company = $('#tb_item_edit_company').val();
    obj.email = $('#tb_item_edit_email').val();
    obj.city = $('#tb_item_edit_city').val();
    obj.country = $('#sel_item_country').val();
    obj.state = $('#sel_item_state').val();
    obj.photofilename=$('#tb_item_photofilename').val();
    if(obj.first_name){
        hide_tabs();
        $.ajax({
            type: "POST",
            url: "/customer/update_customer/"+tbl_id,
            enctype: 'multipart/form-data',
            data: obj,
            success: function(data){
                if(data.helper.error){
                    Swal.fire("Error",data.helper.error,"error");
                }else{
                    $("#h_item_edit_title").html(obj.email);
                    $("#div_validation_message").show().delay(2000).fadeOut();

                }
                show_tabs();
            }
        });
    }else{
        alert('Please enter a valid first name');
    }
});
//9_copy
$("#tbl_list").on("click", ".link_item_copy", function(){
    tbl_id = $(this).attr('tbl_id');
    $.ajax({
        type: "POST",
        url: "/customer/copy_customer/"+tbl_id,
        enctype: 'multipart/form-data',
        data: {},
        success: function(data){
            window.location.reload();
        }
    });
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
//9_add
$('#btn_item_add_submit').click(function(event){
    obj={};
    tbl_id=0;
    data_type=$('#tb_item_data_type').val();
    list_count=$('#tb_item_list_count').val();
    obj.email=$('#tb_item_add_title').val();
    obj.visible='true';
    obj.password='1234567';
    obj.order=parseInt(list_count)+1;
    if(obj.email.length<=0){
        Swal.fire("Error",'Please enter a first name',"error");
    }else if(!validate_email(obj.email)){
        Swal.fire("Error",'Please enter a valid email',"error");
    }
    else{
        $.ajax({
            type: "POST",
            url: "/customer/update_customer/"+tbl_id,
            enctype: 'multipart/form-data',
            data: obj,
            success: function(data){
                if(data.helper.error){
                    Swal.fire("Error",data.helper.error,"error");
                }else{
                    window.location.reload();
                }
                return false;
            }
        });
    }
    return false;
});
