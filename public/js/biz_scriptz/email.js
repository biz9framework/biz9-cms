$(document).ready(function() {
    $('#div_validation_message').hide();
    show_tabs();

    //9_item_add_submit
    $('#btn_item_add_submit').click(function(event){
        tbl_id=0;
        email=$('#tb_item_add_title').val();
        data_type=$('#tb_item_data_type').val();
        list_count=$('#tb_item_list_count').val();
        order=parseInt(list_count)+1;

        validate_email=function(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());

        }

        if(!validate_email(email)){
            Swal.fire("Error",'Please enter a valid email',"error");
        }else{
            $.ajax({
                type: "POST",
                url: "/cloud/mail/update_email_list",
                enctype: 'multipart/form-data',
                data: {
                    email:email,
                },
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
});

