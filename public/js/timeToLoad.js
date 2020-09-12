window.onload = function() {
	setTimeout(() => printLoadTime(getLoadTime()), 0);
};

function getLoadTime(data) {
	const t = getPerformanceObject().timing || {};
	const SECOND = 1000;
	const loadTime = (t.loadEventEnd - t.navigationStart) / SECOND;
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
