$(function () {
    populatePage();
});

function populatePage() {

    var content = '';

    // jQuery AJAX call for JSON
    $.getJSON('/questions', function (data) {
        content += '<div class="row">';
        // For each item in our JSON, add a div and a code editor
        $.each(data, function () {
            content += '<div onclick="getQuestion(\'' + this._id + '\')" class="col-sm-6 col-md-4 col-lg-3" ><div class="tile blue"><div class="title"><h3>' + this.QuestionTitle + '</h1></div></div></div>';
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
