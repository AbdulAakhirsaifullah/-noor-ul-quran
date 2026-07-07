"use client";

import { useEffect, useState } from "react";

const KAABA = { lat: 21.4225, lng: 39.8262 };

function bearingTo(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function QiblaPage() {
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [heading, setHeading] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setQiblaBearing(bearingTo(latitude, longitude, KAABA.lat, KAABA.lng));
        setDistance(distanceKm(latitude, longitude, KAABA.lat, KAABA.lng));
      },
      () => setError("Location permission is needed to calculate Qibla direction.")
    );

    function onOrientation(e: DeviceOrientationEvent) {
      if (e.alpha != null) setHeading(360 - e.alpha);
    }
    window.addEventListener("deviceorientation", onOrientation);
    return () => window.removeEventListener("deviceorientation", onOrientation);
  }, []);

  const rotation = qiblaBearing != null ? qiblaBearing - heading : 0;

  return (
    <div className="mx-auto max-w-sm px-4 py-10 text-center sm:px-6">
      <h1 className="font-display text-3xl font-bold">Qibla Direction</h1>
      <p className="mt-2 text-sm text-ink/60 dark:text-white/60">Point your device flat and rotate until the arrow points up.</p>

      {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <div className="relative mx-auto mt-10 flex h-64 w-64 items-center justify-center rounded-full border-4 border-primary-100 bg-white shadow-card dark:border-primary-900 dark:bg-night-card">
        <div
          className="absolute h-24 w-1.5 origin-bottom rounded-full bg-gold"
          style={{ transform: `rotate(${rotation}deg)`, bottom: "50%" }}
        />
        <span className="absolute top-3 text-xs font-semibold text-ink/50 dark:text-white/50">N</span>
        <span className="text-2xl">🕋</span>
      </div>

      {qiblaBearing != null && (
        <div className="mt-6 space-y-1 text-sm">
          <p>Qibla bearing: <span className="font-semibold">{qiblaBearing.toFixed(1)}°</span> from North</p>
          {distance != null && <p>Distance to the Kaaba: <span className="font-semibold">{Math.round(distance).toLocaleString()} km</span></p>}
        </div>
      )}

      <p className="mt-8 text-xs text-ink/40 dark:text-white/40">
        Compass accuracy depends on your device's sensors — calibrate by moving your phone in a
        figure-8 if the arrow seems off.
      </p>
    </div>
  );
}
