const defaults = {
    bg: 'https://raw.githubusercontent.com/ssv445/social-image-builder/refs/heads/main/images/background-02.png',
    fg: 'https://raw.githubusercontent.com/ssv445/social-image-builder/refs/heads/main/images/user-02.png',
    rightImage: 'https://raw.githubusercontent.com/ssv445/social-image-builder/refs/heads/main/images/user-02.png',
    quote: "अपना संस्थान के साथ जुड़ें हरित संगम 2025 पर्यावरण मेला में – एक अनूठा मेला, जो प्रेरणा और मस्ती का संगम है।",
    message: "अपना संस्थान, भीलवाड़ा",
    name: 'आपका नाम',
    allowQuoteEdit: true
};

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        bg: params.get('bg') || defaults.bg,
        fg: params.get('fg') || defaults.fg,
        rightImage: params.get('rightImage') || defaults.rightImage,
        quote: params.get('quote') || defaults.quote,
        message: params.get('msg') || defaults.message,
        name: params.get('name') || defaults.name,
        allowQuoteEdit: params.get('allowQuoteEdit') !== 'false'
    };
}

function updatePreview() {
    console.log('updatePreview');
    html2canvas(document.getElementById('original-container'), {
        scale: 1,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const dataUrl = canvas.toDataURL('image/png');
        $('#preview-image').attr('src', dataUrl);
        console.log('updatePreview done');
    });
}

function downloadImage() {
    html2canvas(document.getElementById('original-container'), {
        scale: 3,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'harit-sangam-2025.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        //wait for 5 seconds
        setTimeout(() => {
            window.location.href = 'https://bit.ly/4eaZedj?r=qr';
        }, 5000);
    });
}

function initializeApp() {
    const params = getUrlParams();

    // Set initial values
    $('#original-container').css('background-image', `url(${params.bg})`);
    $('#fg-image').attr('src', params.fg);
    $('#right-image').attr('src', params.rightImage);
    $('#quote').text(params.quote);
    $('#message').text(params.message);
    $('#name').text(params.name);

    // Set input values
    $('#quote-input').val(params.quote);
    $('#message-input').val(params.message);
    $('#name-input').val(params.name);

    // Handle quote editing permission
    if (!params.allowQuoteEdit) {
        $('#quote-input').prop('disabled', true);
        $('#quote-input').closest('.row').hide(); // Hide the entire quote input row
    }

    // Initialize image visibility
    if ($('#show-left-image').is(':checked')) {
        $('#original-container').addClass('show-left-image');
    }
    if ($('#show-right-image').is(':checked')) {
        $('#original-container').addClass('show-right-image');
    }

    // Generate initial preview
    updatePreview();
}

$(document).ready(() => {
    initializeApp();

    // Add quote input handler
    $('#quote-input').on('input', function() {
        $('#quote').text($(this).val());
    });

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
    $('.preview-btn').on('click', updatePreview);

    // Download handler
    $('.download-btn').on('click', downloadImage);

    // Add right image upload handler
    $('#right-image-upload').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            $('#right-image').attr('src', url);
        }
    });

    // Add image visibility handlers
    $('#show-left-image').on('change', function() {
        if (this.checked) {
            $('#original-container').addClass('show-left-image');
        } else {
            $('#original-container').removeClass('show-left-image');
        }
        updatePreview();
    });

    $('#show-right-image').on('change', function() {
        if (this.checked) {
            $('#original-container').addClass('show-right-image');
        } else {
            $('#original-container').removeClass('show-right-image');
        }
        updatePreview();
    });
}); 