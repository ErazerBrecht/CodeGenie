$(function () {
    populatePage();
});

function populatePage() {

    var content = '';
    var questionCounter = 1;

    // jQuery AJAX call for JSON
    $.getJSON('/questions', function (data) {

        // For each item in our JSON, add a div and a code editor
        $.each(data, function () {
            content += '<input type="button" onclick="getQuestion(\'' + this._id + '\')" value="' + questionCounter + '. ' + this.QuestionTitle + '"/>';
            questionCounter++;
        });

        // Inject the whole content string into our existing HTML 
        $('#buttonList').html(content);
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

function getQuestion(id) {
    //alert(id);

    var content = '';

    // jQuery AJAX call for JSON
    $.getJSON('/questions/' + id, function (data) {

        // For each item in our JSON, add a div and a code editor
        $.each(data, function () {
            $.each(this.Questions, function () {
                if (this.Extra)
                    content += '<div> <span style="color:red; font-weight:bolder">EXTRA: </span>' + this.Question + '</div>';
                else
                    content += '<div>' + this.Question + '</div>';

                if (this.Code)
                    content += '<div class="editor"></div>';
                else
                    content += '<div contenteditable="true" class="answer"></div>';
            });
        });

        // Inject the whole content string into our existing HTML 
        $('#questionList').html(content);
        initEditors();
    });
}
