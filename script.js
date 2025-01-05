const defaults = {
    bg: 'https://picsum.photos/1080/1920',
    fg: 'https://picsum.photos/100/100',
    message: 'Hello World',
    name: 'John Doe',
    fgX: 50,
    fgY: 50,
    messageX: 200,
    messageY: 200,
    nameX: 200,
    nameY: 250
};

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        bg: params.get('bg') || defaults.bg,
        fg: params.get('fg') || defaults.fg,
        message: params.get('msg') || defaults.message,
        name: params.get('name') || defaults.name,
        fgX: parseInt(params.get('fgX')) || defaults.fgX,
        fgY: parseInt(params.get('fgY')) || defaults.fgY,
        messageX: parseInt(params.get('msgX')) || defaults.messageX,
        messageY: parseInt(params.get('msgY')) || defaults.messageY,
        nameX: parseInt(params.get('nameX')) || defaults.nameX,
        nameY: parseInt(params.get('nameY')) || defaults.nameY
    };
}

function updatePreview() {
    html2canvas(document.getElementById('original-container'), {
        scale: 1,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const dataUrl = canvas.toDataURL('image/png');
        $('#preview-image').attr('src', dataUrl);
    });
}

function downloadImage() {
    html2canvas(document.getElementById('original-container'), {
        scale: 3,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'personalized-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

function initializeApp() {
    const params = getUrlParams();

    // Set initial values
    $('#original-container').css('background-image', `url(${params.bg})`);
    $('#fg-image').attr('src', params.fg);
    $('#message').text(params.message);
    $('#name').text(params.name);

    // Set positions
    $('#fg-image').css({ left: params.fgX, top: params.fgY });
    $('#message').css({ left: params.messageX, top: params.messageY });
    $('#name').css({ left: params.nameX, top: params.nameY });

    // Set input values
    $('#message-input').val(params.message);
    $('#name-input').val(params.name);
    $('#fg-x').val(params.fgX);
    $('#fg-y').val(params.fgY);
    $('#message-x').val(params.messageX);
    $('#message-y').val(params.messageY);
    $('#name-x').val(params.nameX);
    $('#name-y').val(params.nameY);

    // Generate initial preview
    updatePreview();
}

$(document).ready(() => {
    initializeApp();

    // File upload handlers
    $('#bg-upload').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            $('#original-container').css('background-image', `url(${url})`);
            
            // Display image dimensions
            const img = new Image();
            img.onload = function() {
                $('#bg-info').text(`Dimensions: ${this.width}x${this.height}`);
            };
            img.src = url;
        }
    });

    $('#fg-upload').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            $('#fg-image').attr('src', url);
        }
    });

    // Text input handlers
    $('#message-input').on('input', function() {
        $('#message').text($(this).val());
    });

    $('#name-input').on('input', function() {
        $('#name').text($(this).val());
    });

    // Position input handlers
    $('.form-control[type="number"]').on('input', function() {
        const id = $(this).attr('id');
        const value = $(this).val();

        switch(id) {
            case 'fg-x':
            case 'fg-y':
                $('#fg-image').css({
                    left: $('#fg-x').val(),
                    top: $('#fg-y').val()
                });
                break;
            case 'message-x':
            case 'message-y':
                $('#message').css({
                    left: $('#message-x').val(),
                    top: $('#message-y').val()
                });
                break;
            case 'name-x':
            case 'name-y':
                $('#name').css({
                    left: $('#name-x').val(),
                    top: $('#name-y').val()
                });
                break;
        }
    });

    // Preview handler
    $('#preview-btn').on('click', updatePreview);

    // Download handler
    $('#download-btn').on('click', downloadImage);
}); 