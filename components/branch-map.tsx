"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup, CircleMarker } from "leaflet";
import type { Branch } from "./branch-explorer";
import "leaflet/dist/leaflet.css";

export function BranchMap({ branches, selected, location, onSelect }: {
  branches: Branch[];
  selected: Branch | null;
  location: { lat: number; lng: number } | null;
  onSelect: (id: string) => void;
}) {
  const element = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const leaflet = useRef<typeof import("leaflet") | null>(null);
  const markers = useRef<LayerGroup | null>(null);
  const userMarker = useRef<CircleMarker | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let createdMap: LeafletMap | null = null;
    (async () => {
      const L = await import("leaflet");
      if (!element.current || cancelled) return;
      leaflet.current = L;
      createdMap = L.map(element.current, { zoomControl: false, scrollWheelZoom: false }).setView([32.5, 53.7], 5);
      L.control.zoom({ position: "bottomleft" }).addTo(createdMap);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(createdMap);
      markers.current = L.layerGroup().addTo(createdMap);
      map.current = createdMap;
      setReady(true);
    })();
    return () => { cancelled = true; createdMap?.remove(); map.current = null; markers.current = null; leaflet.current = null; };
  }, []);

  useEffect(() => {
    const L = leaflet.current;
    if (!ready || !L || !map.current || !markers.current) return;
    markers.current.clearLayers();
    branches.forEach(branch => {
      const active = selected?.id === branch.id;
      const marker = L.circleMarker([branch.lat, branch.lng], {
        radius: active ? 12 : 9,
        color: "#fff", weight: 3,
        fillColor: active ? "#112c43" : "#0a754f", fillOpacity: 1,
      });
      marker.bindTooltip(branch.name, { direction: "top", offset: [0, -9] });
      marker.on("click", () => onSelect(branch.id));
      marker.addTo(markers.current!);
    });
    userMarker.current?.remove();
    if (location) {
      userMarker.current = L.circleMarker([location.lat, location.lng], {
        radius: 9, color: "#fff", weight: 3, fillColor: "#3289d4", fillOpacity: 1,
      }).bindTooltip("موقعیت شما").addTo(map.current);
    }
  }, [branches, selected?.id, location?.lat, location?.lng, onSelect, ready]);

  useEffect(() => {
    const L = leaflet.current;
    if (!ready || !L || !map.current) return;
    if (selected) map.current.flyTo([selected.lat, selected.lng], 13, { duration: .7 });
    else if (branches.length) {
      const coordinates = branches.map(branch => [branch.lat, branch.lng] as [number, number]);
      if (location) coordinates.push([location.lat, location.lng]);
      if (coordinates.length === 1) map.current.flyTo(coordinates[0], 12, { duration: .7 });
      else map.current.fitBounds(L.latLngBounds(coordinates), { padding: [45, 45], maxZoom: 12, animate: true });
    } else if (location) map.current.flyTo([location.lat, location.lng], 11, { duration: .7 });
  }, [branches, selected?.id, location?.lat, location?.lng, ready]);

  return <div className="branch-map-wrap">
    <div ref={element} className="branch-map" aria-label="نقشه تعاملی شعب نمونه" role="application"/>
    {!ready && <div className="branch-map-loading">در حال آماده‌سازی نقشه…</div>}
    <div className="branch-map-caption"><span className="branch-map-key"><i/> شعب نمونه</span>{location && <span className="branch-map-key user-key"><i/> موقعیت شما</span>}</div>
  </div>;
}
