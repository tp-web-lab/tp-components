module.exports = async function openStreetMapExtension(root) {
  await loadStyle('https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css');
  await loadScript('https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js');

  if (!window.L) {
    console.warn('Leaflet is not available');
    return;
  }

  registerStyles();

  for (const mapEl of root.querySelectorAll('.tp-rst-map')) {
    if (!(mapEl instanceof HTMLElement)) {
      continue;
    }

    const lat = Number(mapEl.dataset.lat);
    const lon = Number(mapEl.dataset.lon);
    const zoom = Number(mapEl.dataset.zoom ?? '13');

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      mapEl.textContent = 'Invalid map coordinates.';
      continue;
    }

    const map = window.L.map(mapEl).setView([lat, lon], zoom);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    if (mapEl.dataset.marker === 'true') {
      const marker = window.L.marker([lat, lon]).addTo(map);
      const title = mapEl.dataset.title ?? '';

      if (title !== '') {
        marker.bindPopup(title);
      }
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
};

function loadScript(url) {
  return new Promise((resolve, reject) => {
    if (url.includes('leaflet') && window.L) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = false;

    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () =>
      reject(new Error(`Unable to load script: ${url}`)),
    );

    document.head.append(script);
  });
}

function loadStyle(url) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[href="${url}"]`);

    if (existing instanceof HTMLLinkElement) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;

    link.addEventListener('load', () => resolve());
    link.addEventListener('error', () =>
      reject(new Error(`Unable to load stylesheet: ${url}`)),
    );

    document.head.append(link);
  });
}

function registerStyles() {
  if (document.getElementById('tp-rst-openstreetmap-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'tp-rst-openstreetmap-styles';
  style.textContent = `
.tp-rst-map {
  inline-size: 100%;
  block-size: 24rem;
  margin-block: 1rem;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
}
`;

  document.head.append(style);
}