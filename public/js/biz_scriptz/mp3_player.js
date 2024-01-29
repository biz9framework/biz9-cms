//9_upload_track
$('#form_track_file_upload').submit(function(){
    $('#j_player').hide();
    hide_tabs();
    $.ajax({
        type: 'POST',
        url: $('#form_track_file_upload').attr('action'),
        data: new FormData( this ),
        processData: false,
        contentType: false,
        success: function(data){
            $('#div_file_info').html('File Upload Success');
            show_tabs();
            $('#j_player').show();
            $('#btn_item_submit').show();
            $('.sp_photo').show();
            $('#file_upload_file_form').show();
            $('#tb_item_track_filename').val(data.helper.item.mp3filename);
            $('#tb_item_track_duration').val(data.helper.item.mp3duration);
            g_file_url=$('#tb_item_file_url').val();
            $("#jquery_jplayer_1").jPlayer("setMedia", {
                title:data.helper.item.mp3filename,
                mp3:g_file_url+data.helper.item.mp3filename
            });
        },
        error: function(data){
            alert('UPLOAD MP3 ERROR');
            console.log(data);
        }
    });
    return false;
});
function bind_biz_track_player(title,track_url){
    if(!title){
        title='';
    }
    if(!track_url){
        track_url='';
    }
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                title:title,
                mp3: track_url
            });
        },
        cssSelectorAncestor: "#jp_container_1",
        swfPath: "/js",
        supplied: "mp3",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true
    });

    if(title && track_url){
        $('#j_player').show();
    }else{
        $('#j_player').hide();
    }
}
