const defaults = {
    bg: 'https://raw.githubusercontent.com/ssv445/social-image-builder/refs/heads/main/images/bg-shree.png',
    fg: 'https://raw.githubusercontent.com/ssv445/social-image-builder/refs/heads/main/images/user-02.png',
    rightImage: 'https://raw.githubusercontent.com/ssv445/social-image-builder/refs/heads/main/images/user-02.png',
    quote: "स्वच्छ एवं अनूठा मेला: खेल-की-रेल (Sports Roadshow), फूलों की मनमोहक प्रदर्शनी (Flower Show), आकर्षक सांस्कृतिक कार्यक्रम, डिस्पोज़ेबल-मुक्त जानकी रसोई (Food Court) — सबका आनंद लेने ज़रूर पधारें!",
    message: "अपना संस्थान, भीलवाड़ा",
    name: 'आपका नाम',
    allowQuoteEdit: false
};

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        bg: params.get('bg') || defaults.bg,
        fg: params.get('fg') || defaults.fg,
        rightImage: params.get('rightImage') || defaults.rightImage,
        quote: params.get('quote') || '',
        message: params.get('msg') || '',
        name: params.get('name') || defaults.name,
        allowQuoteEdit: params.get('allowQuoteEdit') !== 'false'
    };
}

function updatePreview() {
    console.log('updatePreview');
    // Add a small delay to ensure DOM updates are complete
    setTimeout(() => {
        html2canvas(document.getElementById('original-container'), {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            logging: false // Reduce console noise
        }).then(canvas => {
            const dataUrl = canvas.toDataURL('image/png');
            $('#preview-image').attr('src', dataUrl);
            console.log('updatePreview done');
        });
    }, 100);
}

// Update text input handlers to use debounce
let previewDebounceTimer;
function debouncedPreview() {
    clearTimeout(previewDebounceTimer);
    previewDebounceTimer = setTimeout(updatePreview, 300);
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
            const file = new File([blob], 'rakt-arpan-mahotsav-2025.png', { type: 'image/png' });
            await navigator.share({
                title: 'रक्त अर्पण महोत्सव 2025',
                text: 'रक्त अर्पण महोत्सव 2025, 09 मार्च 2025, भीलवाड़ा',
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

function handleImageSelect(e, targetId) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            const modal = new bootstrap.Modal(document.getElementById('imageModal'));
            
            // Set the active target and image URL
            activeImageTarget = targetId;
            document.getElementById('cropperImage').src = imageUrl;
            
            // Show modal and init cropper after modal is shown
            modal.show();
            $('#imageModal').on('shown.bs.modal', function () {
                initCropper(imageUrl);
                // Remove the event listener to avoid multiple initializations
                $(this).off('shown.bs.modal');
            });
        }
        reader.readAsDataURL(file);
    }
}

function initCropper(imageUrl) {
    const image = document.getElementById('cropperImage');
    
    // Destroy existing cropper if any
    if (cropper) {
        cropper.destroy();
    }

    // Initialize cropper
    cropper = new Cropper(image, {
        aspectRatio: 1,
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

    // Text input handlers with debounce
    $('#message-input, #name-input, #quote-input').on('input', function() {
        const id = $(this).attr('id');
        const targetId = id.replace('-input', '');
        $(`#${targetId}`).text($(this).val());
        debouncedPreview();
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

    // Image visibility handlers
    $('#show-left-image, #show-right-image').on('change', function() {
        const isLeft = this.id === 'show-left-image';
        const className = isLeft ? 'show-left-image' : 'show-right-image';
        
        if (this.checked) {
            $('#original-container').addClass(className);
        } else {
            $('#original-container').removeClass(className);
        }
        // Use setTimeout to ensure class changes are applied
        setTimeout(updatePreview, 100);
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

        const canvas = cropper.getCroppedCanvas({
            width: 275,
            height: 275,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            $(`#${activeImageTarget}`).attr('src', url);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('imageModal'));
            modal.hide();
            
            // Add delay to ensure image is loaded
            setTimeout(updatePreview, 100);
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