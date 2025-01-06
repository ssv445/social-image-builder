# Social Image Builder

A web-based tool to create personalized social media images with customizable text and profile pictures. Perfect for events, campaigns, or any situation where you need to create multiple personalized images with a consistent template.

## Features

- 🖼️ Customizable template with background image
- 👤 Upload and crop profile pictures
- 📝 Editable text fields (name, description, message)
- 🔄 Real-time preview
- 📱 Mobile-friendly interface
- 💾 High-quality image download
- 📤 Native share support on mobile devices
- 🎨 Optional dual profile picture layout

## Demo

Try it out: [Live Demo](https://ssv445.github.io/social-image-builder/)

## Customization

### URL Parameters

You can customize the default values using URL parameters:
Like: https://your-domain.com/index.html?bg=IMAGE_URL&quote=YOUR_QUOTE&allowQuoteEdit=false


Available parameters:
- `bg`: Background image URL
- `fg`: Default left profile image URL
- `rightImage`: Default right profile image URL
- `quote`: Default quote text
- `msg`: Default message text
- `name`: Default name text
- `allowQuoteEdit`: Set to 'false' to disable quote editing

### Template Dimensions

The template uses a 1080x1920 pixel canvas (9:16 ratio), perfect for:
- Instagram Stories
- WhatsApp Status
- Facebook Stories
- Other vertical social media formats

### Styling

Key CSS classes you can customize:
- `.quotation`: Main quote styling
- `.bottom-content`: Bottom section with profile(s) and text
- `.circular-image`: Profile picture styling
- `.text-overlay`: Text overlay styling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Cropper.js](https://fengyuanchen.github.io/cropperjs/) for image cropping
- [html2canvas](https://html2canvas.hertzen.com/) for image generation
- [Bootstrap](https://getbootstrap.com/) for UI components

## Contact

Shyam Verma - [@ssv445](https://twitter.com/ssv445)

Project Link: [https://github.com/ssv445/social-image-builder](https://github.com/ssv445/social-image-builder)