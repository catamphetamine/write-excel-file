export default function downloadBlob(blob, filename) {
	// Create a URL for the blob
	const url = URL.createObjectURL(blob)

	// Create a temporary anchor element
	const a = document.createElement('a')
	a.style.display = 'none'
	a.href = url
	a.download = filename // Set the proposed filename for the download

	// Append the anchor to the body to make it clickable
	document.body.appendChild(a)

	// Trigger the download by simulating a click
	a.click()

	// Clean up by revoking the object URL and removing the anchor
	setTimeout(() => {
		URL.revokeObjectURL(url)
		document.body.removeChild(a)
	}, 100) // Delay for Firefox compatibility
}
