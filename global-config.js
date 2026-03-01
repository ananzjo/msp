/**
 * global-config.js
 * Shared features for MSP (Modern Style Pack)
 * Handles Sidebar, Header Clock, and API Connection
 */

// 1. Configuration & Backend Link
// global-config.js - قم بتحديث هذا السطر فقط
const CONFIG = {
    API_URL: "https://script.google.com/macros/s/AKfycbx0zL3AFrk3PM7WDA5wApijlO78focSdaWfVK1Ikh-iHKNbm4kfiSDbhWy0Q24UuTKH/exec",
    SYSTEM_NAME: "MSP | Modern Style Pack | الطراز الحديث للتغليف"
};

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initDigitalClock();
});

/**
 * 2. Sliding Sidebar Logic
 * Always use the 'Sliding Sidebar' template [cite: 2026-02-17]
 */
function initSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
            // Toggle margin/width of main content for a smooth slide
            if (sidebar.classList.contains('closed')) {
                sidebar.style.right = "-260px";
                mainContent.style.marginRight = "0";
            } else {
                sidebar.style.right = "0";
                mainContent.style.marginRight = "260px";
            }
        });
    }
}

/**
 * 3. Pulsing Digital Taxi Clock
 * Indicates the connection between front end & back end [cite: 6, 7]
 */
function initDigitalClock() {
    const clockElement = document.getElementById('digital-clock');
    const pulseIndicator = document.querySelector('.pulse-indicator');

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        if (clockElement) {
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    // Update every second
    setInterval(updateClock, 1000);
    updateClock();

    // Verify Backend Connection Status
    checkConnection(pulseIndicator);
}

/**
 * Checks connectivity to the Apps Script URL
 * Updates the pulsing indicator color based on status
 */
async function checkConnection(indicator) {
    try {
        const response = await fetch(CONFIG.API_URL + "?action=ping");
        if (response.ok) {
            indicator.style.backgroundColor = "#2fb45a"; // MSP Logo Green (Connected)
        } else {
            indicator.style.backgroundColor = "#ff4d4d"; // Red (Server Error)
        }
    } catch (error) {
        indicator.style.backgroundColor = "#ff4d4d"; // Red (Offline)
        console.error("MSP System: Connection to Google Sheets failed.");
    }
}

// Global Notification System (Shared across all pages) [cite: 2026-02-17]
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `msp-toast msp-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}