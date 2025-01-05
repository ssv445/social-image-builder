PROJECT SPECIFICATION FOR A SINGLE-PAGE NEXT.JS (JAVASCRIPT ONLY) IMAGE PERSONALIZATION APP
	1.	OVERVIEW

	•	This application is built with Next.js using the old /pages routing system.
	•	All coding should be in JavaScript (no TypeScript).
	•	It should be a single-page application (only one route, pages/index.js).
	•	The app is mobile-friendly and handles all functionality in the browser (no backend API).

	2.	CORE FUNCTIONALITY
a) DEFAULT VALUES AND URL OVERRIDES

	•	The app must support default values for:
	•	Background image URL
	•	Foreground circular image URL
	•	Message text
	•	Name text
	•	X and Y positions for images and text
	•	URL parameters can override these defaults (e.g., ?bg=someimage.jpg&fg=avatar.png&msg=Hello&name=John&msgX=50&msgY=100&fgX=200&fgY=300).

b) IMAGE UPLOADS
	•	Users can optionally upload a new background image or a new circular foreground image using  elements.
	•	When a file is selected, the preview updates immediately (no server call).
	•	The background image’s dimensions (width and height) must be displayed after selection or loading.

c) TEXT FIELDS
	•	There are two text inputs: one for a message, one for a name.
	•	Each text field has a default value (which may be overridden by a URL parameter).
	•	Text fields update in real-time on the preview.

d) POSITIONING ELEMENTS
	•	Both the background image and the circular image can be positioned with X, Y coordinates in state.
	•	Both text fields can also be positioned with X, Y coordinates.
	•	X, Y coordinates can come from default values, user input, or URL parameters.

e) DOWNLOAD FINAL IMAGE
	•	A “Download” button captures the entire preview area (background, circular image, both text fields) as a single image.
	•	The capture process uses a client-side library such as html2canvas or dom-to-image.
	•	The final image downloads in high resolution (allow setting a “scale” or similar option).

3.	PROJECT STRUCTURE: standard nextjs structure

4.	IMPLEMENTATION DETAILS
a) INITIALIZATION

	•	Create a Next.js app using npx create-next-app my-app.
	•	Ensure the old page-based routing structure (pages folder).
	•	Delete unnecessary files so you only have pages/index.js as the main route.

b) DEPENDENCIES
	•	Install html2canvas or dom-to-image for client-side image generation.
	•	Optionally install a state management approach or just use React hooks within the page.

c) LOADING DEFAULTS AND URL PARAMETERS
	•	In getInitialProps (or using router.query) parse any URL parameters (bg, fg, msg, name, msgX, msgY, fgX, fgY, etc.).
	•	Merge these with your own predefined default values.

d) STATE MANAGEMENT
	•	Use React’s useState hooks to store:
	•	backgroundImageUrl
	•	foregroundImageUrl
	•	messageText
	•	nameText
	•	backgroundPosition (usually 0,0 if not moved, or you can let background be fixed)
	•	foregroundPositionX, foregroundPositionY
	•	messagePositionX, messagePositionY
	•	namePositionX, namePositionY
	•	On component mount, set initial states from the merged defaults and URL parameters.

e) FILE UPLOAD HANDLERS
	•	For background and foreground upload, use onChange events on .
	•	Convert the file to a local URL via URL.createObjectURL and update the state.
	•	After background loads, get its natural width and height to display to the user.

f) REAL-TIME TEXT AND POSITION UPDATES
	•	Provide text inputs for message and name, each updates the corresponding state.
	•	Provide numeric inputs or sliders for X, Y coordinates of the circular image, message text, and name text.
	•	Reflect these changes immediately in the preview.

g) PREVIEW RENDERING
	•	A  container that visually displays:
	•	The background image (using backgroundImage or an  tag).
	•	The circular foreground image at the specified X, Y position (CSS absolute positioning).
	•	The message and name text elements at their respective X, Y positions.

h) DOWNLOAD FUNCTION
	•	On “Download” button click:
	1.	Use html2canvas(document.getElementById(‘preview’), { scale: 2 or 3 }) or dom-to-image with similar options.
	2.	Convert the result to a data URL or blob.
	3.	Trigger a download by creating a temporary  element and simulating a click.

	5.	MOBILE OPTIMIZATION

	•	Use responsive CSS so the preview fits on smaller screens (media queries or a simple flexible layout).
	•	Ensure buttons and inputs are large enough to tap easily.

	6.	DELIVERABLES

	•	A single pages/index.js file with all functionality in JavaScript (no TypeScript).
	•	A styles/globals.css or inline styles for basic formatting.
	•	A minimal package.json with dependencies: next, react, react-dom, and html2canvas or dom-to-image.
	•	No server-side or backend code beyond necessary Next.js config.

	7.	TESTING AND VERIFICATION

	•	Test on desktop and mobile to ensure file uploads, text updates, positioning, and final download all work correctly.
	•	Verify URL parameters correctly override the defaults.
	•	Check that downloaded images are high resolution (e.g., check resulting file size and clarity).

END OF SPECIFICATION