// EDITOR PROCCESSING START --
function get_item_note(){
    return tinymce.activeEditor.getContent();
}
function init_item_note(_str){
tinymce.init({
    selector: '.div_note',
    plugins: 'anchor autolink codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
     setup: function (editor) {
      editor.on('init', function (e) {
        editor.setContent(_str);
      });
    }
  });
}
// EDITOR PROCCESSING END --

