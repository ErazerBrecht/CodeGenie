$(function () {
    populatePage();
});

function populatePage() {

    var content = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/exercises', function (data) {
        content += '<div class="row">';
        // For each item in our JSON, add a div and a code editor
        $.each(data, function () {
            content += '<div onclick="getExercise(\'' + this._id + '\')" class="col-sm-6 col-md-4 col-lg-3" ><div class="tile blue"><div class="title"><h3>' + this.title + '</h1></div></div></div>';
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

function getExercise(id) {
    var content = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/exercises/' + id, function (data) {

        // For each item in our JSON, add a div and a code editor
        $.each(data, function () {
            $.each(this.questions, function () {
                if (this.extra)
                    content += '<div> <span style="color:red; font-weight:bolder">EXTRA: </span>' + this.question + '</div>';
                else
                    content += '<div>' + this.question + '</div>';

                switch (this.type) {
                    case 'Checkbox': content += '<input type="checkbox">'; break;
                    case 'Question': content += '<div contenteditable="true" class="answer"></div>'; break;
                    case 'Code': content += '<div class="editor"></div>'; break;
                }
            });
        });

        // Inject the whole content string into our existing HTML 
        $('#questionList').html(content);
        initEditors();
    });
}
