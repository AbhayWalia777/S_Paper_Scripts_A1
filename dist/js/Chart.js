let chart = null;
let series = null;
let currentScriptCode = null;
let refreshTimer = null;
let lastBarTime = null;

const REFRESH_INTERVAL_MS = 5000; // adjust based on interval
const modal = document.getElementById('ModalBasicChart');
const toggleBtn = document.getElementById("toggleChartView");
const wrapper = document.querySelector(".chart-wrapper");

if (toggleBtn && wrapper) {
    toggleBtn.addEventListener("click", () => {
        wrapper.classList.toggle("fullscreen-mode");

        // Optional icon swap
        const icon = toggleBtn.querySelector("i");
        if (wrapper.classList.contains("fullscreen-mode")) {
            icon.classList.remove("bi-arrows-fullscreen");
            icon.classList.add("bi-fullscreen-exit");
        } else {
            icon.classList.remove("bi-fullscreen-exit");
            icon.classList.add("bi-arrows-fullscreen");
        }

        // Resize chart properly after layout change
        setTimeout(autoResizeChart, 200);
    });
}

// =========================
// Chart Theme
// =========================
function applyTheme() {
    if (!chart) return;

    const isDarkMode = document.body.classList.contains('dark-mode-active');

    chart.applyOptions({
        layout: {
            background: { type: 'solid', color: isDarkMode ? '#020617' : '#ffffff' },
            textColor: isDarkMode ? '#e5e7eb' : '#000000'
        },
        grid: {
            vertLines: { color: isDarkMode ? '#1e293b' : '#e0e0e0' },
            horzLines: { color: isDarkMode ? '#1e293b' : '#e0e0e0' }
        }
    });
}

// =========================
// Chart Lifecycle
// =========================
function initChart() {
    if (chart) return;

    const container = document.getElementById("chart");

    chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: 360,
        timeScale: { timeVisible: true }
    });

    series = chart.addSeries(LightweightCharts.CandlestickSeries);
    applyTheme();
}

function autoResizeChart() {
    if (!chart) return;

    const container = document.getElementById("chart");
    chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight || 360
    });
}

// =========================
// Auto Refresh Control
// =========================
function startAutoRefresh() {
    stopAutoRefresh();
    refreshTimer = setInterval(refreshChart, REFRESH_INTERVAL_MS);
}
function refreshChart() {
    resetChartState();
    loadChartData();
}
function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

function resetChartState() {
    lastBarTime = null;
}

// =========================
// Data Loading
// =========================
function loadChartData() {
    if (!currentScriptCode || !series) return;

    const fromDate = document.getElementById("fromDate")?.value;
    const toDate = document.getElementById("toDate")?.value;
    const interval = document.getElementById("interval")?.value;

    const API_URL =
        `https://prod-tradingapi.sanaitatechnologies.com/WatchListApi/historical-data` +
        `?scriptCode=${currentScriptCode}` +
        `&fromDate=${fromDate}` +
        `&toDate=${toDate}` +
        `&interval=${interval}`;

    fetch(API_URL)
        .then(r => r.json())
        .then(res => {
            if (!res?.data) return;

            if (res.message) {
                showChartError(res.message);
                return;
            }

            if (res.data?.isError) {
                showChartError(res.data.errorMessage);
                return;
            }


            hideChartError();

            const IST_OFFSET = 5.5 * 60 * 60;
            const bars = res.data.historicalData.map(d => ({
                time: Math.floor(new Date(d.timeStamp).getTime() / 1000) + IST_OFFSET,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close
            }));


            if (!bars.length) return;

            if (!lastBarTime) {
                // First load
                series.setData(bars);
                lastBarTime = bars[bars.length - 1].time;
                chart.timeScale().resetTimeScale();
            } else {
                // Live update
                const latestBar = bars[bars.length - 1];
                series.update(latestBar);
                lastBarTime = latestBar.time;
            }

            chart.applyOptions({
                rightPriceScale: { autoScale: true }
            });

            applyTheme();
        });
}

// =========================
// UI Events
// =========================
function attachUIEvents() {
    const from = document.getElementById("fromDate");
    const to = document.getElementById("toDate");
    const interval = document.getElementById("interval");

    if (from) from.onchange = () => {
        resetChartState();
        loadChartData();
    };

    if (to) to.onchange = () => {
        resetChartState();
        loadChartData();
    };

    if (interval) interval.onchange = () => {
        resetChartState();
        loadChartData();
    };
}

// =========================
// Modal Events
// =========================
if (modal) {
    //modal.addEventListener('show.modal', function (event) {
    //	//const button = event.relatedTarget;
    //	//currentScriptCode = button?.getAttribute('data-scriptcode');
    //	currentScriptCode = $('#ModalBasicChart').data('scriptcode');

    //	resetChartState();
    //	initChart();
    //	attachUIEvents();
    //	loadChartData();
    //	//startAutoRefresh();
    //});

    //modal.addEventListener('shown.modal', autoResizeChart);

    //modal.addEventListener('hidden.modal', function () {
    //	stopAutoRefresh();
    //});
    }    

// =========================
// Window Resize
// =========================
window.addEventListener("resize", autoResizeChart);

// =========================
// Observe Dark Mode Changes
// =========================
const observer = new MutationObserver(applyTheme);
observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
});

// =========================
// Error Handling
// =========================
function showChartError(message) {
    const errorBox = document.getElementById("chartError");
    const errorMsg = document.getElementById("chartErrorMessage");

    if (!errorBox || !errorMsg) return;

    errorMsg.textContent = message;
    errorBox.classList.remove("d-none");
}

function hideChartError() {
    const errorBox = document.getElementById("chartError");
    if (!errorBox) return;

    errorBox.classList.add("d-none");
}
