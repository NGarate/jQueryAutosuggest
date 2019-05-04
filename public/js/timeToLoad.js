window.onload = function() {
	setTimeout(() => printLoadTime(getLoadTime()), 0);
};

const addAutocomplete = id => data => {
	$(`#${id}`).autocomplete({ source: data });
};

function getLoadTime(data) {
	const t = getPerformanceObject().timing || {};
	const loadTime = (t.loadEventEnd - t.navigationStart) / 1000;
	return loadTime;
}

function printLoadTime(time) {
	$("#loadTime").html(time + " segundos");
}

function getPerformanceObject() {
	return (
		window.performance ||
		window.mozPerformance ||
		window.msPerformance ||
		window.webkitPerformance ||
		{}
	);
}
