// EDITOR PROCCESSING START --
var editor=null;
function get_item_note(){
    return editor.getContents()
}
function init_item_note(_str){
    if(!_str){
        _str='';
    }
     editor = SUNEDITOR.create('biz_tb_note',{ toolbarContainer : '#toolbar_container',
        showPathLabel : false,
        charCounter : true,
        width : 'auto',
        height : 'auto',
        minHeight : '100px',
        minWidth : '250px',
        buttonList : [
            ['undo','redo','font','fontSize','formatBlock'],
            ['bold','underline','italic','strike','removeFormat'],
            ['fontColor','hiliteColor','outdent','indent','align','horizontalRule','list'],
            ['link','image','video','fullScreen','showBlocks']
        ]});
    editor.setContents(_str);
}
// EDITOR PROCCESSING END --

