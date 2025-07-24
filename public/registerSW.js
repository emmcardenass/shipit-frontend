if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(
        (registration) => {
          console.log('✅ Service Worker registrado con éxito:', registration.scope);
        },
        (error) => {
          console.log('❌ Falló el registro del Service Worker:', error);
        }
      );
    });
  }
  