const defaults = {
    bg: 'https://raw.githubusercontent.com/ssv445/social-image-builder/refs/heads/main/images/background-02.png',
    fg: 'https://raw.githubusercontent.com/ssv445/social-image-builder/refs/heads/main/images/user-02.png',
    rightImage: 'https://raw.githubusercontent.com/ssv445/social-image-builder/refs/heads/main/images/user-02.png',
    quote: "स्वच्छ एवं अनूठा मेला: जोशीला खेल-की-रेल (Sports Roadshow), फूलों की मनमोहक प्रदर्शनी (Flower Show), आकर्षक सांस्कृतिक कार्यक्रम, डिस्पोज़ेबल-मुक्त जानकी रसोई (Food Court) — सबका आनंद लेने ज़रूर पधारें!",
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

async function shareOrDownload() {
    const canvas = await html2canvas(document.getElementById('original-container'), {
        scale: 3,
        useCORS: true,
        allowTaint: true
    });

    // Convert canvas to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    
    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare) {
        try {
            const file = new File([blob], 'harit-sangam-2025.png', { type: 'image/png' });
            await navigator.share({
                title: 'हरित संगम 2025',
                text: 'हरित संगम 2025 पर्यावरण मेला, 10-14 जनवरी 2025, भीलवाड़ा',
                files: [file]
            });
        } catch (err) {
            console.log('Share failed:', err);
            // Fallback to download if share fails
            downloadFile(canvas);
        }
    } else {
        // Fallback for desktop or unsupported browsers
        downloadFile(canvas);
    }

    // Redirect after 10 seconds
    setTimeout(() => {
        window.location.href = 'https://bit.ly/4eaZedj?r=qr';
    }, 10000);
}

function downloadFile(canvas) {
    const link = document.createElement('a');
    link.download = 'harit-sangam-2025.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
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

    // Initialize image visibility - only left image checked by default
    if ($('#show-left-image').is(':checked')) {
        $('#original-container').addClass('show-left-image');
    }
    // Only add right image class if explicitly checked
    if ($('#show-right-image').is(':checked')) {
        $('#original-container').addClass('show-right-image');
    }

    // Generate initial preview
    updatePreview();
}

let cropper = null;
let activeImageTarget = null;

function initCropper(imageUrl, aspectRatio = 1) {
    const image = document.getElementById('cropperImage');
    image.src = imageUrl;
    
    // Destroy existing cropper if any
    if (cropper) {
        cropper.destroy();
    }

    // Initialize cropper
    cropper = new Cropper(image, {
        aspectRatio: aspectRatio,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
    });
}

function handleImageSelect(e, targetId) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            initCropper(e.target.result);
            const modal = new bootstrap.Modal(document.getElementById('imageModal'));
            modal.show();
        }
        reader.readAsDataURL(file);
    }
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

    // Update download handler to use share
    $('.download-btn').on('click', shareOrDownload);

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

    // Setup image upload buttons
    $('#leftImageBtn, #rightImageBtn').on('click', function() {
        activeImageTarget = this.id === 'leftImageBtn' ? 'fg-image' : 'right-image';
        
        // Create temporary file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e) => handleImageSelect(e, activeImageTarget);
        fileInput.click();
    });

    // Handle crop button click
    $('#cropButton').on('click', function() {
        if (!cropper) return;

        // Get cropped canvas
        const canvas = cropper.getCroppedCanvas({
            width: 275,    // Match your circular image size
            height: 275,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });

        // Convert to blob and create object URL
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            $(`#${activeImageTarget}`).attr('src', url);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
            modal.hide();
            
            // Update preview
            updatePreview();
        }, 'image/jpeg', 0.9);
    });

    // Clean up cropper when modal is hidden
    $('#imageModal').on('hidden.bs.modal', function () {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    });
}); 