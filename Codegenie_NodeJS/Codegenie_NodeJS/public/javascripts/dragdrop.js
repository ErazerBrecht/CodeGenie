(function ($) {
    $.fn.invisible = function () {
        return this.each(function () {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function () {
        return this.each(function () {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));

var origPos;
var origColor;

interact('.block')
    .draggable({
    onmove: function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        
        target.style.webkitTransform =
            target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';
        
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
})
    .restrict({
    drag: "",
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
})
    .snap({
    mode: 'anchor',
    anchors: [],
    elementOrigin: { x: 0.5, y: 0.5 },
    endOnly: true
})
    //Triggered when you start draging
	.on('dragstart', function (event) {
    $("#dropzone").visible();
    
    //Get the draged block
    var rect = interact.getElementRect(event.target);
    
    // record center point this is needed to return the block to orginal postition
    origPos = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
    
    // snap to the start position
    event.interactable.snap({ anchors: [origPos] });
});


interact('#dropzone')
    // enable draggables to be dropped into this
    .dropzone({ overlap: 'center' })
    // only accept elements matching this CSS selector
    .accept('.block')
    // listen for drop related events
    .on('dragenter', function (event) {
    var dropRect = interact.getElementRect(event.target),
        dropCenter = {
            x: dropRect.left + dropRect.width / 2,
            y: dropRect.top + dropRect.height / 2
        };
    
    origColor = event.relatedTarget.style.background;
    event.relatedTarget.style.background = '#D43F3A';
    event.draggable.snap({
        anchors: [dropCenter]
    });
})
	.on('dragleave', function (event) {
    event.relatedTarget.style.background = origColor;
    event.draggable.snap(false);
    // when leaving a dropzone, snap to the original position
    event.draggable.snap({ anchors: [origPos] });
})
    .on('dropdeactivate', function (event) {
    // Make dropzone invsible again!
    $("#dropzone").invisible();
})
    .on('drop', function (event) {
    event.relatedTarget.textContent = '';
    alert("delete");
});