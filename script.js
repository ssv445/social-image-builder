const defaults = {
    bg: 'https://picsum.photos/1080/1920',
    fg: 'https://picsum.photos/200/200',
    message: 'Hello World',
    name: 'John Doe'
};

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        bg: params.get('bg') || defaults.bg,
        fg: params.get('fg') || defaults.fg,
        message: params.get('msg') || defaults.message,
        name: params.get('name') || defaults.name
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

    // Set input values
    $('#message-input').val(params.message);
    $('#name-input').val(params.name);

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

    // Preview handler
    $('#preview-btn').on('click', updatePreview);

    // Download handler
    $('#download-btn').on('click', downloadImage);
}); 