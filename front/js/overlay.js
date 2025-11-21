function toggleOverlay(){
	const overlay = document.querySelector('.overlay');
	overlay.classList.toggle('active');
}

function leaveOverlay(){
	const overlay = document.querySelector('.overlay');
	overlay.classList.remove('active');
}

const iframe = document.getElementById('frame');
iframe.onload = () => {
	const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
	iframeDoc.querySelector('.btn-cancel').addEventListener('click', () => {
		leaveOverlay();
	});
}

document.addEventListener('keydown', (e) => {
	if (e.key == "Escape") {
		leaveOverlay();
	}
})


