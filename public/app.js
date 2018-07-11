// Check if service workers are supported by user's browsers
if ('serviceWorker' in navigator) {
  try {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Register the service worker passing our service worker code
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          // Registration was successful
          console.log('ServiceWorker registration successful!', registration.scope);
          // Show snackbar letting users know that Kerpal can be used offline
          Snackbar.show({
            text: 'Kerpal available offline!',
            pos: 'bottom-right',
            actionTextColor: 'yellow',
            backgroundColor: 'rgba(50,50,50, 0.7)',
            duration: 20000,
          });
        }, (err) => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  } catch (e) {
    Raven.captureException(e);
  }
}

// Event listener that checks to see if user is online or offline
window.addEventListener('load', () => {
  function checkConnectionStatus() {
    const status = navigator.onLine;
    // Alert user if their connection status changes by showing a snackbar
    if (status) {
      Snackbar.show({
        text: 'Kerpal is online!',
        pos: 'bottom-right',
        actionTextColor: 'yellow',
        backgroundColor: 'rgba(50,50,50, 0.7)',
        duration: 20000,
      });
    } else {
      Snackbar.show({
        text: 'Kerpal is offline!',
        pos: 'bottom-right',
        actionTextColor: 'yellow',
        backgroundColor: 'rgba(50,50,50, 0.7)',
        duration: 20000,
      });
    }
  }
  // add event listeners for online and offline events with callback function
  window.addEventListener('online', checkConnectionStatus);
  window.addEventListener('offline', checkConnectionStatus);
});
