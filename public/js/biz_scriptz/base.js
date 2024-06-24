$('#div_validation_message').hide();
//9_show_tabs
function show_tabs(){
    //$('#div_tab_content').show();
    //$('#ul_nav_list').show();
    //$('#sp_spinner').hide();
    $('#btn_item_photo_upload').hide();
    $('#btn_item_file_upload').hide();
    $('#form_photo_upload').show();
    $('.tabs').show();
    $('#div_note').show();
    $('#btn_item_submit').show();
    //$('#div_check').html("");
}
//9_hide_tabs
function hide_tabs(){
    //$('#div_tab_content').hide();
    //$('#ul_nav_list').hide();
    //$('#sp_spinner').show();
    $('#btn_item_photo_upload').hide();
    $('#btn_item_file_upload').hide();
    $('#form_photo_upload').hide();
    $('.tabs').hide();
    $('#div_note').hide();
    $('#btn_item_submit').hide();
    //$('#btn_item_photo_remove').hide();
    $('#btn_item_add_submit').hide();
}
//9_upload_photo_form
$('#file_upload_photo_form').change(function(){
    var fileInput = document.getElementById('file_upload_photo_form');
    var filePath = fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.avif|\.webp|\.svg)$/i;
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        fileInput.value = '';
        return false;
    }else{
        $('#btn_item_photo_upload').show();
        $('.sp_photo').hide();
        $('#btn_item_submit').hide();
        $('#btn_item_photo_remove').hide();
    }
});
//9_upload
$('#form_photo_upload').submit(function(){
    hide_tabs();
    $.ajax({
        type: 'POST',
        url: $('#form_photo_upload').attr('action'),
        data: new FormData( this ),
        processData: false,
        contentType: false,
        success: function(data){
            if(data.helper.error){
                alert(data.helper.error);
                $('#file_upload_photo_form').show();
            }else{
            show_tabs();
            $('#btn_item_submit').show();
            $('#tb_item_photofilename').val(data.helper.item.photofilename);
            $('.img_up_primary').attr('src',data.helper.item.photo_obj.thumb_url);
            $('.sp_photo').show();
            $('#file_upload_photo_form').show();
            $('#btn_item_photo_remove').show();
            bind_photo_setting(data.helper.item);
            }
        },
        error: function(data){
            alert('UPLOAD ERROR');
            alert(data.helper.error);
            console.log(data);
        }
    });
    return false;
});
//9_upload_file_form
$('#file_upload_file_form').change(function(){
    var fileInput = document.getElementById('file_upload_file_form');
    var filePath = fileInput.value;
    var allowedExtensions = /(\.mp3)$/i;
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        fileInput.value = '';
        return false;
    }else{
        $('#btn_item_file_upload').show();
        $('.sp_photo').hide();
        $('#btn_item_submit').hide();
        $('#btn_item_photo_remove').hide();
    }
});

//9_upload
$('#form_file_upload').submit(function(){
    hide_tabs();
    $.ajax({
        type: 'POST',
        url: $('#form_file_upload').attr('action'),
        data: new FormData( this ),
        processData: false,
        contentType: false,
        success: function(data){
            if(data.helper.error){
                alert(data.helper.error);
                $('#file_upload_file_form').show();
            }else{
            $('#div_file_info').html('File Upload Success:<br/> '+data.helper.file_url);
            show_tabs();
            $('#btn_item_submit').show();
            $('.sp_photo').show();
            $('#file_upload_file_form').show();
            }
        },
        error: function(data){
            alert(data.helper.error);
            console.log('UPLOAD ERROR');
            console.log(data);
        }
    });
    return false;
});
//9_item_add
$('#tb_item_add_title').change(function(event){
    $('#btn_item_add_submit').show();
});
$('#btn_item_add').click(function(event){
    $('#modal_item_add').modal('show');
    $('#tb_item_tbl_id').val('0');
    $('#lbl_item_edit_title').val('Add');
    $('#tb_item_add_title').val('');
    $('#btn_item_add_submit').hide();
});
//9_item_photo_remove
$('#btn_item_photo_remove').click(function(event){
    tbl_id = $('#tb_item_tbl_id').val();
    data_type = $('#tb_item_data_type').val();
    $.ajax({
        type: "POST",
        url: "/cloud/crud/update/" +data_type +  "/"+tbl_id,
        enctype: 'multipart/form-data',
        data: {tbl_id:tbl_id,photofilename:''},
        success: function(data){
            if(data.helper.error){
                Swal.fire("Error",data.helper.error,"error");
            }else{
                $('.img_up_primary').attr('src','/images/no_image.png');
            }
        }
    });
    return false;
});
function bind_photo_setting(data){
    if(data.photofilename){
        show_photo(data);
    }else{
        hide_photo();
    }
    function hide_photo(){
        $('#btn_item_photo_remove').hide();
        $('#div_photo_size').hide();
        $('.sp_photo').hide();
        $('#img_up_primary').hide();
    }
    function show_photo(data){
        $('#btn_item_photo_remove').show();
        $('#div_photo_size').show();
        $('.sp_photo').show();
        $('#img_up_primary').show();
        $('#div_photo_size').show();
        $('.img_up_primary').attr('src',data.photo_obj.thumb_url);
    }
}
function set_biz_prop_obj(){
    var obj={};
    if($('#cb_item_edit_visible').is(":checked")){
        obj.visible='true';
    }else{
        obj.visible='false';
    }
    obj.tbl_id = $('#tb_item_tbl_id').val();
    obj.order = parseInt($('#tb_item_edit_order').val());
    if(isNaN(obj.order)){
        obj.order=1;
    }
    obj.photofilename=$('#tb_item_photofilename').val();
    obj.title = $('#tb_item_edit_title').val();
    if(obj.title){
        obj.title_url = obj.title.replace(/[^a-z0-9]+/ig, "_").toLowerCase();
    }
    obj.note =get_item_note();

    obj.html = $('#tb_item_edit_html').val();
    obj.setting_sort_type = $('#sl_item_edit_sort_type').find(":selected").val();
    obj.setting_sort_order = $('#sl_item_edit_sort_order').find(":selected").val();
    obj.delete_protection = $('#sl_item_edit_delete_protection').find(":selected").val();

    obj.field_1=( $('#tb_item_edit_field_1').val()!='')?$('#tb_item_edit_field_1').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim():null;
    obj.field_2=( $('#tb_item_edit_field_2').val()!='')?$('#tb_item_edit_field_2').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim():null;
    obj.field_3=( $('#tb_item_edit_field_3').val()!='')?$('#tb_item_edit_field_3').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim():null;
    obj.field_4=( $('#tb_item_edit_field_4').val()!='')?$('#tb_item_edit_field_4').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim():null;
    obj.field_5=( $('#tb_item_edit_field_5').val()!='')?$('#tb_item_edit_field_5').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim():null;
    obj.field_6=( $('#tb_item_edit_field_6').val()!='')?$('#tb_item_edit_field_6').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim():null;
    obj.field_7=( $('#tb_item_edit_field_7').val()!='')?$('#tb_item_edit_field_7').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim():null;
    obj.field_8=( $('#tb_item_edit_field_8').val()!='')?$('#tb_item_edit_field_8').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim():null;
    obj.field_9=( $('#tb_item_edit_field_9').val()!='')?$('#tb_item_edit_field_9').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim() :null;
    obj.field_10=( $('#tb_item_edit_field_10').val()!='')?$('#tb_item_edit_field_10').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim() :null;
    obj.field_11=( $('#tb_item_edit_field_11').val()!='')?$('#tb_item_edit_field_11').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim() :null;
    obj.field_12=( $('#tb_item_edit_field_12').val()!='')?$('#tb_item_edit_field_12').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim() :null;
    obj.field_13=( $('#tb_item_edit_field_13').val()!='')?$('#tb_item_edit_field_13').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim() :null;
    obj.field_14=( $('#tb_item_edit_field_14').val()!='')?$('#tb_item_edit_field_14').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim() :null;
    obj.field_15=( $('#tb_item_edit_field_15').val()!='')?$('#tb_item_edit_field_15').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim() :null;
    obj.field_16=( $('#tb_item_edit_field_16').val()!='')?$('#tb_item_edit_field_16').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase().trim() :null;
    obj.value_1=$('#tb_item_edit_value_1').val().trim();
    obj.value_2=$('#tb_item_edit_value_2').val().trim();
    obj.value_3=$('#tb_item_edit_value_3').val().trim();
    obj.value_4=$('#tb_item_edit_value_4').val().trim();
    obj.value_5=$('#tb_item_edit_value_5').val().trim();
    obj.value_6=$('#tb_item_edit_value_6').val().trim();
    obj.value_7=$('#tb_item_edit_value_7').val().trim();
    obj.value_8=$('#tb_item_edit_value_8').val().trim();
    obj.value_9=$('#tb_item_edit_value_9').val().trim();
    obj.value_10=$('#tb_item_edit_value_10').val().trim();
    obj.value_11=$('#tb_item_edit_value_11').val().trim();
    obj.value_12=$('#tb_item_edit_value_12').val().trim();
    obj.value_13=$('#tb_item_edit_value_13').val().trim();
    obj.value_14=$('#tb_item_edit_value_14').val().trim();
    obj.value_15=$('#tb_item_edit_value_15').val().trim();
    obj.value_16=$('#tb_item_edit_value_16').val().trim();
    obj.date_1=($('#tb_item_edit_date_1').val()!='')?$('#tb_item_edit_date_1').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase() :null;
    obj.date_2=($('#tb_item_edit_date_2').val()!='')?$('#tb_item_edit_date_2').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase() :null;
    obj.date_3=($('#tb_item_edit_date_3').val()!='')?$('#tb_item_edit_date_3').val().replace(/[^a-z0-9]+/ig, "_").toLowerCase() :null;
    obj.date_value_1=$('#tb_item_edit_date_value_1').val();
    obj.date_value_2=$('#tb_item_edit_date_value_2').val();
    obj.date_value_3=$('#tb_item_edit_date_value_3').val();
    return obj;
}
function bind_biz_prop_obj(data){
    $('#tb_item_edit_title').val(data.helper.item.title);
    $('#tb_item_edit_title_url').html(data.helper.item.title_url);
    $('#tb_item_edit_html').val(data.helper.item.html);
    $('#tb_item_edit_order').val(data.helper.item.order);
    $("#sl_item_edit_sort_type").val(data.helper.item.setting_sort_type);
    $("#sl_item_edit_sort_order").val(data.helper.item.setting_sort_order);
    $("#sl_item_edit_delete_protection").val(data.helper.item.delete_protection);
    $('#tb_item_edit_field_1').val(data.helper.item.field_1);
    $('#tb_item_edit_field_2').val(data.helper.item.field_2);
    $('#tb_item_edit_field_3').val(data.helper.item.field_3);
    $('#tb_item_edit_field_4').val(data.helper.item.field_4);
    $('#tb_item_edit_field_5').val(data.helper.item.field_5);
    $('#tb_item_edit_field_6').val(data.helper.item.field_6);
    $('#tb_item_edit_field_7').val(data.helper.item.field_7);
    $('#tb_item_edit_field_8').val(data.helper.item.field_8);
    $('#tb_item_edit_field_9').val(data.helper.item.field_9);
    $('#tb_item_edit_field_10').val(data.helper.item.field_10);
    $('#tb_item_edit_field_11').val(data.helper.item.field_11);
    $('#tb_item_edit_field_12').val(data.helper.item.field_12);
    $('#tb_item_edit_field_13').val(data.helper.item.field_13);
    $('#tb_item_edit_field_14').val(data.helper.item.field_14);
    $('#tb_item_edit_field_15').val(data.helper.item.field_15);
    $('#tb_item_edit_field_16').val(data.helper.item.field_16);
    $('#tb_item_edit_value_1').val(data.helper.item.value_1);
    $('#tb_item_edit_value_2').val(data.helper.item.value_2);
    $('#tb_item_edit_value_3').val(data.helper.item.value_3);
    $('#tb_item_edit_value_4').val(data.helper.item.value_4);
    $('#tb_item_edit_value_5').val(data.helper.item.value_5);
    $('#tb_item_edit_value_6').val(data.helper.item.value_6);
    $('#tb_item_edit_value_7').val(data.helper.item.value_7);
    $('#tb_item_edit_value_8').val(data.helper.item.value_8);
    $('#tb_item_edit_value_9').val(data.helper.item.value_9);
    $('#tb_item_edit_value_10').val(data.helper.item.value_10);
    $('#tb_item_edit_value_11').val(data.helper.item.value_11);
    $('#tb_item_edit_value_12').val(data.helper.item.value_12);
    $('#tb_item_edit_value_13').val(data.helper.item.value_13);
    $('#tb_item_edit_value_14').val(data.helper.item.value_14);
    $('#tb_item_edit_value_15').val(data.helper.item.value_15);
    $('#tb_item_edit_value_16').val(data.helper.item.value_16);
    $('#tb_item_edit_date_1').val(data.helper.item.date_1);
    $('#tb_item_edit_date_2').val(data.helper.item.date_2);
    $('#tb_item_edit_date_3').val(data.helper.item.date_3);
    $('#tb_item_edit_date_value_1').val(data.helper.item.date_value_1);
    $('#tb_item_edit_date_value_2').val(data.helper.item.date_value_2);
    $('#tb_item_edit_date_value_3').val(data.helper.item.date_value_3);
    $('#tb_item_tbl_id').val(data.helper.item.tbl_id);
    $('#tb_item_photofilename').val(data.helper.item.photofilename);
    $('.img_up_primary').attr('src',data.helper.item.photo_obj.thumb_url);

    if(String(data.helper.item.visible)=='true'){
        str='';
        str=str+"<div id='div_item_visible' class='custom-control custom-control-lg custom-switch'>";
        str=str+"<input type='checkbox' checked='checked' class='custom-control-input' id='cb_item_edit_visible'>";
        str=str+"<label class='custom-control-label' for='cb_item_edit_visible'>Active</label>";
        str=str+"</div>";
        $('#div_check').html(str);
    }else{
        str='';
        str=str+"<div id='div_item_visible' class='custom-control custom-control-lg custom-switch'>";
        str=str+"<input type='checkbox' class='custom-control-input' id='cb_item_edit_visible'>";
        str=str+"<label class='custom-control-label' for='cb_item_edit_visible'>Active</label>";
        str=str+"</div>";
        $('#div_check').html(str);
    }

}
//9_search
function set_biz_search(obj){
    str = '';
    if(obj.title){
        str = str + "["+obj.title+"]";
    }
    if(obj.category){
        str = str + "["+obj.category+"]";
    }
    if(obj.sub_note){
        str = str + "["+obj.sub_note+"]";
    }
    if(obj.tags){
        str = str + "["+obj.tags+"]";
    }
    if(obj.type){
        str = str + "["+obj.type+"]";
    }
    if(obj.sub_type){
        str = str + "["+obj.sub_type+"]";
    }
    if(obj.type){
        str = str + "["+obj.type+"]";
    }
    if(obj.sub_type){
        str = str + "["+obj.type+"]";
    }
    for(a=0;a<12;a++){
        if(obj['value_'+a]){
            str = str + "["+obj['value_'+a]+"]";
        }
    }
    if(str){
        str = str.toLowerCase();
    }
    return str;
}
