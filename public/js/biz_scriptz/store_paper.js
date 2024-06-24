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
                $('#tb_item_edit_cart_note').val(data.helper.item.cart_note)
                $('#tb_item_edit_cart_term').val(data.helper.item.cart_term)
                $('#tb_item_edit_invoice_note').val(data.helper.item.invoice_note)
                $('#tb_item_edit_invoice_term').val(data.helper.item.invoice_term)
            }else{
                alert('Please make an selection');
            }
        }
    });
}
//9_submit
//9_save
$('#btn_item_submit').click(function(){
    hide_tabs();
    tbl_id = $('#tb_item_tbl_id').val();
    data_type = $('#tb_item_data_type').val();
    var obj={};
    obj.title='Paper';
    obj.title_url='paper';
    obj.photofilename=$('#tb_item_photofilename').val();
    obj.cart_note=$('#tb_item_edit_cart_note').val();
    obj.cart_term=$('#tb_item_edit_cart_term').val();
    obj.invoice_note=$('#tb_item_edit_invoice_note').val();
    obj.invoice_term=$('#tb_item_edit_invoice_term').val();
    $.ajax({
        type: "POST",
        url: "/cloud/crud/update/"+data_type+"/"+tbl_id,
        enctype: 'multipart/form-data',
        data: obj,
        success: function(data){
            if(data.helper.error){
                Swal.fire("Error",data.helper.error,"error");
            }else{
                $("#div_validation_message").show().delay(2000).fadeOut();
            }
            show_tabs();
        }
    });
});
