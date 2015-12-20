/**
 * Created by Matthew on 20/12/2015.
 */

$(document).scroll(function() {
    if($(document).scrollTop() >= 45) $("#messagebox").css("top", 0);
    else $("#messagebox").css("top", 45 - $(document).scrollTop());
});

$('#messagebox').addClass('animated fadeInRight');
$('#messagebox').addClass('animated fadeOutRight');

//TODO: FIX ANIMATIONS
