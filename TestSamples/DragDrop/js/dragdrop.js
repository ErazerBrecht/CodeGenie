var startPos = null;

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
    .inertia(true)
    .restrict({
        drag: "",
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    })
    .snap({
        mode: 'anchor',
        anchors: [],
        range: Infinity,
        elementOrigin: { x: 0.5, y: 0.5 },
        endOnly: true
    })
	.on('dragstart', function (event) {
	    if (!startPos) {
	        var rect = interact.getElementRect(event.target);

	        // record center point when starting the very first a drag
	        startPos = {
	            x: rect.left + rect.width / 2,
	            y: rect.top + rect.height / 2
	        }
	    }

	    // snap to the start position
	    event.interactable.snap({ anchors: [startPos] });
	});


interact('.dropzone')
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

        event.draggable.snap({
            anchors: [dropCenter]
        });
    })

    .on('drop', function (event) {
        event.relatedTarget.textContent = '';
        alert('Verwijderd');
    });