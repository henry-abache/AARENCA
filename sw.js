const mapUrl = ev.latitud ? `https://www.google.com/maps/dir/?api=1&destination=${ev.latitud},${ev.longitud}` : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ev.lugar)}`;
