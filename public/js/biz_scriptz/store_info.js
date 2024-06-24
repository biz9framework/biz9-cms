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
                //-business-start
                $('#tb_item_edit_business_name').val(data.helper.item.business_name);
                $('#tb_item_edit_business_email').val(data.helper.item.business_email);
                $('#tb_item_edit_business_phone').val(data.helper.item.business_phone);
                $('#tb_item_edit_business_address1').val(data.helper.item.business_address1);
                $('#tb_item_edit_business_address2').val(data.helper.item.business_address2);
                $('#tb_item_edit_business_city').val(data.helper.item.business_city);
                $('#tb_item_edit_business_zip').val(data.helper.item.business_zip);
                $('#tb_item_edit_business_cashapp').val(data.helper.item.business_cashapp);
                $('#select2-sel_item_state-container').html(data.helper.item.business_state)
                $('#select2-sel_item_country-container').html(data.helper.item.business_country)
                $('#lbl_item_edit_business_state').html(data.helper.item.business_state);
                $('#lbl_item_edit_business_country').html(data.helper.item.business_country);
                //-business-end
                //-social-start
                $('#tb_item_edit_social_website').val(data.helper.item.social_website);
                $('#tb_item_edit_social_blog').val(data.helper.item.social_blog);
                $('#tb_item_edit_social_facebook').val(data.helper.item.social_facebook);
                $('#tb_item_edit_social_instagram').val(data.helper.item.social_instagram);
                $('#tb_item_edit_social_twitter').val(data.helper.item.social_twitter);
                $('#tb_item_edit_social_youtube').val(data.helper.item.social_youtube);
                //-social-end
                //-stripe-start
                $('#tb_item_edit_business_stripe_key').val(data.helper.item.business_stripe_key);
                //-stripe-end
                //-brevo-start
                $('#tb_item_edit_brevo_key').val(data.helper.item.brevo_key);
                $('#tb_item_edit_brevo_sender').val(data.helper.item.brevo_sender);
                $('#tb_item_edit_brevo_reply').val(data.helper.item.brevo_reply);
                $('#tb_item_edit_brevo_form_send_template_id').val(data.helper.item.brevo_form_send_template_id);
                $('#tb_item_edit_brevo_form_send_subject').val(data.helper.item.brevo_form_send_subject);
                $('#tb_item_edit_brevo_order_send_template_id').val(data.helper.item.brevo_order_send_template_id);
                $('#tb_item_edit_brevo_order_send_subject').val(data.helper.item.brevo_order_send_subject);
                $('#tb_item_edit_brevo_item_review_update_template_id').val(data.helper.item.brevo_item_review_update_template_id);
                $('#tb_item_edit_brevo_item_review_update_subject').val(data.helper.item.brevo_item_review_update_subject);
                $('#tb_item_edit_brevo_vendor_payment_order_confirmation_subject').val(data.helper.item.brevo_vendor_payment_order_confirmation_subject);
                $('#tb_item_edit_brevo_vendor_payment_order_confirmation_template_id').val(data.helper.item.brevo_vendor_payment_order_confirmation_template_id);
                //-brevo-end
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
    tbl_id = $('#tb_item_tbl_id').val();
    data_type = $('#tb_item_data_type').val();
    var obj={};
    obj.title='Info';
    obj.title_url='info';
    obj.photofilename=$('#tb_item_photofilename').val();
    obj.business_name=$('#tb_item_edit_business_name').val();
    obj.business_email=$('#tb_item_edit_business_email').val();
    obj.business_phone=$('#tb_item_edit_business_phone').val();
    obj.business_country=$('#sel_item_country').val();
    obj.business_address1=$('#tb_item_edit_business_address1').val();
    obj.business_address2=$('#tb_item_edit_business_address2').val();
    obj.business_city=$('#tb_item_edit_business_city').val();
    obj.business_state=$('#sel_item_state').val();
    obj.business_zip=$('#tb_item_edit_business_zip').val();
    obj.business_cashapp=$('#tb_item_edit_business_cashapp').val();
    obj.business_stripe_key=$('#tb_item_edit_business_stripe_key').val();
    obj.social_website=$('#tb_item_edit_social_website').val();
    obj.social_blog=$('#tb_item_edit_social_blog').val();
    obj.social_facebook=$('#tb_item_edit_social_facebook').val();
    obj.social_instagram=$('#tb_item_edit_social_instagram').val();
    obj.social_twitter=$('#tb_item_edit_social_twitter').val();
    obj.social_youtube=$('#tb_item_edit_social_youtube').val();
    obj.brevo_key=$('#tb_item_edit_brevo_key').val();
    obj.brevo_sender=$('#tb_item_edit_brevo_sender').val();
    obj.brevo_reply=$('#tb_item_edit_brevo_reply').val();
    obj.brevo_form_send_template_id=$('#tb_item_edit_brevo_form_send_template_id').val();
    obj.brevo_form_send_subject=$('#tb_item_edit_brevo_form_send_subject').val();
    obj.brevo_order_send_template_id=$('#tb_item_edit_brevo_order_send_template_id').val();
    obj.brevo_order_send_subject=$('#tb_item_edit_brevo_order_send_subject').val();
    obj.brevo_item_review_update_template_id=$('#tb_item_edit_brevo_item_review_update_template_id').val();
    obj.brevo_item_review_update_subject=$('#tb_item_edit_brevo_item_review_update_subject').val();
    obj.brevo_vendor_payment_order_confirmation_subject=$('#tb_item_edit_brevo_vendor_payment_order_confirmation_subject').val();
    obj.brevo_vendor_payment_order_confirmation_template_id=$('#tb_item_edit_brevo_vendor_payment_order_confirmation_template_id').val();
    if(!validate_email(obj.business_email)){
        Swal.fire("Error","Please enter a valid  business email address","error");
        show_tabs();
    }
    else{
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
    }
});

