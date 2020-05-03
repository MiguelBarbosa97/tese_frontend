// var editorhtml = CodeMirror.fromTextArea(document.getElementById('htmltextarea'), {
//     mode: "xml",
//     theme: "dracula",
//     lineNumbers: true,
//     autoCloseTags: true
// });
var editorcss = CodeMirror.fromTextArea(document.getElementById('csstextarea'), {
    mode: "css",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true
});
var editorjs = CodeMirror.fromTextArea(document.getElementById('jstextarea'), {
    mode: "javascript",
    theme: "dracula",
    lineNumbers: true,
    autoCloseTags: true
});
