const mapUrl = ev.latitud ? `https://www.google.com/maps/search/?api=1&query=${ev.latitud},${ev.longitud}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.lugar)}`;
