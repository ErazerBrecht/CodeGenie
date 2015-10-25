$(function () {
    populatePage();
});

function populatePage() {

    var content = '';
    var questionCounter = 1;

    // jQuery AJAX call for JSON
    $.getJSON('/json', function (data) {

        // For each item in our JSON, add a div and a code editor
        $.each(data, function () {
            content += '<h3>' + questionCounter + '. ' + this.QuestionTitle + '</h3>';
            $.each(this.Questions, function () {
                content += '<div>' + this + '</div>';
                content += '<div class="editor"></div>';
            });

            questionCounter++;
        });

        // Inject the whole content string into our existing HTML 
        $('#questionList').html(content);
        initEditors();
    });
};

function initEditors() {
    var editor;
    $('.editor').each(function (index) {
        editor = ace.edit(this);
        editor.setTheme("ace/theme/sqlserver");
        editor.getSession().setMode("ace/mode/csharp");
    });
}
