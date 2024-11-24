// Colors
let foregroundColor = "#000000";
let backgroundColor = "#ffffff";
function updateForegroundColor(newColor) {
	foregroundColor = newColor;
}
function updateBackgroundColor(newColor) {
	backgroundColor = newColor;
}

// QR code text
let qrCodeText = 'https://noreplica.com/';
function updateQRCodeText(newText) {
	qrCodeText = newText;
}

// Generate QR codes
let loadBackground;
function generateQRCode() {
	// Fade out background
	const pattern = document.querySelector('.pattern-container');
	pattern.dataset.active = 0;
	clearTimeout(loadBackground);

	// Update root color
	const root = document.querySelector('html');
	root.style.setProperty('--primary', foregroundColor);
	root.style.setProperty('--secondary', backgroundColor);

	const svgParent = document.getElementById("qrcode-svg");
	svgParent.innerHTML = '';
	const pngParent = document.getElementById("qrcode-png");
	pngParent.innerHTML = '';

	let qrcodeSVG = new QRCode(svgParent, {
		width: 2048,
		height: 2048,
		colorDark : foregroundColor,
		colorLight : backgroundColor,
		correctLevel : QRCode.CorrectLevel.H,
		useSVG: true
	});
	let qrcodePNG = new QRCode(pngParent, {
		width: 2048,
		height: 2048,
		colorDark : foregroundColor,
		colorLight : backgroundColor,
		correctLevel : QRCode.CorrectLevel.H,
		useSVG: undefined
	});
	qrcodeSVG.makeCode(qrCodeText);
	qrcodePNG.makeCode(qrCodeText);

	loadBackground = setTimeout(generateBackgroundPattern, 500);
}
generateQRCode();

// Generate pattern
function generateBackgroundPattern() {
	const pattern = document.querySelector('.pattern-container');
	let temp = '';
	for (let i=0; i<8; i++) {
		temp += `<div class="pattern-column"><div class="pattern-row">${splitCell(1)}</div><div class="pattern-row">${splitCell(1)}</div></div>`;
	}
	pattern.innerHTML = `<div class="pattern">${temp}</div><div class="pattern">${temp}</div>`;

	const root = document.querySelector('html');
	root.style.setProperty('--qr', `url(${document.querySelector('#qrcode-png img').src})`);
	pattern.dataset.active = 1;
}

// Split cell inside background pattern
function splitCell(level) {
	let temp = "";
	if (Math.random() < 1-level/5 && level < 5) {
		temp += `<div class="pattern-column"><div class="pattern-row">${splitCell(level+1)}</div><div class="pattern-row">${splitCell(level+1)}</div></div><div class="pattern-column"><div class="pattern-row">${splitCell(level+1)}</div><div class="pattern-row">${splitCell(level+1)}</div></div>`;
	} else {
		temp += `<div class="pattern-cell"></div>`;
	}

	return temp
}

// Download QR code
async function downloadQRCode(format) {
	// Solution from https://dev.to/sbodi10/download-images-using-javascript-51a9
	if (format == "png") {
		const image = await fetch(document.querySelector('#qrcode-png img').src);
		const imageBlog = await image.blob();
		const imageURL = URL.createObjectURL(imageBlog);
		const link = document.createElement('a');
		link.style.display = 'none';
		link.href = imageURL;
		link.download = 'qrcode.png';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		
	}

	// Solution from https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
	else if (format == 'svg') {
		const svg = document.querySelector('#qrcode-svg');
		const serializer = new XMLSerializer();
		let source = serializer.serializeToString(svg);
		if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
			source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
		}
		if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
			source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
		}
		source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
		const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
		const link = document.createElement('a');
		link.style.display = 'none';
		link.href = url;
		link.download = 'qrcode.svg';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}  

// Print background pattern
function printQRCode(size) {
	const patternContainer = document.querySelector('.pattern-container');
	patternContainer.dataset.size = size;
	const root = document.querySelector('html');
	if (size == 'letter') {
		root.style.setProperty('--width', '8.5in');
		root.style.setProperty('--height', '11in');
	} else if (size == 'tabloid') {
		root.style.setProperty('--width', '11in');
		root.style.setProperty('--height', '17in');
	} else if (size == 'poster') {
		root.style.setProperty('--width', '24in');
		root.style.setProperty('--height', '36in');
	}
	window.print();
}

// Hide/show controls
controls = true;
function hideControls() {
	controls = false;
	const container = document.querySelector('.container');
	container.dataset.controls = controls;
}
function showControls() {
	controls = true;
	const container = document.querySelector('.container');
	container.dataset.controls = controls;
}