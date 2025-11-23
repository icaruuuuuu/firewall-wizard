function toggleOverlay(){
	const overlay = document.querySelector('.overlay');
	document.body.classList.toggle('blur');
	overlay.classList.toggle('active');
}

function leaveOverlay(){
	const overlay = document.querySelector('.overlay');
	document.body.classList.remove('blur');
	overlay.classList.remove('active');
}

const iframe = document.getElementById('frame');
iframe.onload = () => {
	const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
	const cancelBtn = iframeDoc.querySelector('.btn-cancel');

	if (cancelBtn) {
		cancelBtn.addEventListener('click', () => {
			leaveOverlay();
		});
	}
}

document.addEventListener('keydown', (e) => {
	if (e.key === "Escape") {
		leaveOverlay();
	}
});
