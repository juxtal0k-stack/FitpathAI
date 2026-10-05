import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  Activity, 
  Check, 
  Layers, 
  Footprints, 
  AlertCircle,
  ExternalLink,
  Play,
  Pause,
  RefreshCw,
  LocateFixed
} from 'lucide-react';
import { ThemeConfig } from '../theme';
import { DeviceVisitItem, IndividualProfile } from '../types';

interface DeviceMapTrackerProps {
  theme: ThemeConfig;
  profile: IndividualProfile | null;
  visits: DeviceVisitItem[];
  onAddVisit?: (visit: Omit<DeviceVisitItem, 'id' | 'timestamp'>) => Promise<void>;
  onDeleteVisit?: (id: string) => Promise<void>;
  onSyncLocation?: (lat: number, lng: number, distanceIncKm: number) => void;
}

// Compute distance in KM between two lat/lng points using Haversine formula
function computeHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// Helper child component to pan camera to target position
function CameraRecenter({ target }: { target: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (map && target) {
      map.panTo(target);
    }
  }, [map, target]);
  return null;
}

export const DeviceMapTracker: React.FC<DeviceMapTrackerProps> = ({
  theme,
  profile,
  visits = [],
  onAddVisit,
  onDeleteVisit,
  onSyncLocation,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDkYBOB9H1KVoVf_3-5WzUuVyhrv9Du3ok';

  // Base starting location derived from profile address or fallback
  const baseStart = useMemo(() => {
    if (profile?.deviceLocation?.latitude && profile?.deviceLocation?.longitude) {
      return {
        lat: profile.deviceLocation.latitude,
        lng: profile.deviceLocation.longitude,
        name: profile.addressLine || 'Home Base Residence',
      };
    }
    return {
      lat: 18.9220,
      lng: 72.8347,
      name: 'Registered Base Start Location (Mumbai Marine Drive)',
    };
  }, [profile]);

  // Current live device position
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number }>(baseStart);
  const [totalDistanceTraveledKm, setTotalDistanceTraveledKm] = useState<number>(() => {
    return profile?.deviceLocation?.totalDistanceKm || 3.4;
  });

  // Selected marker for InfoWindow
  const [selectedVisit, setSelectedVisit] = useState<DeviceVisitItem | null>(null);
  const [showBaseInfo, setShowBaseInfo] = useState<boolean>(false);

  // Simulation mode: walk along route every second
  const [isSimulatingWalk, setIsSimulatingWalk] = useState<boolean>(false);
  const [walkSpeedKmh, setWalkSpeedKmh] = useState<number>(4.8); // 4.8 km/h typical walking speed

  // Modal to add custom visit
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newPlaceName, setNewPlaceName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<DeviceVisitItem['category']>('Gym');
  const [newNotes, setNewNotes] = useState<string>('');
  const [newLat, setNewLat] = useState<number>(baseStart.lat + 0.005);
  const [newLng, setNewLng] = useState<number>(baseStart.lng + 0.004);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locateStatus, setLocateStatus] = useState<string | null>(null);

  // Synchronize base location changes
  useEffect(() => {
    if (baseStart) {
      setCurrentPosition({ lat: baseStart.lat, lng: baseStart.lng });
    }
  }, [baseStart]);

  // Handle Live Walk Simulation (updates every single second)
  useEffect(() => {
    if (!isSimulatingWalk) return;

    const interval = setInterval(() => {
      // Small randomized delta in lat/lng (~1.3 meters per second = ~4.8 km/h)
      const latDelta = (Math.random() - 0.48) * 0.00012;
      const lngDelta = (Math.random() - 0.48) * 0.00012;

      setCurrentPosition((prev) => {
        const nextLat = prev.lat + latDelta;
        const nextLng = prev.lng + lngDelta;
        const distDelta = computeHaversineDistanceKm(prev.lat, prev.lng, nextLat, nextLng);

        setTotalDistanceTraveledKm((d) => {
          const newTotal = parseFloat((d + distDelta).toFixed(3));
          if (onSyncLocation) {
            onSyncLocation(nextLat, nextLng, distDelta);
          }
          return newTotal;
        });

        return { lat: nextLat, lng: nextLng };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulatingWalk, onSyncLocation]);

  // Request browser GPS position
  const handleGetDeviceGps = () => {
    if (!navigator.geolocation) {
      setLocateStatus('Geolocation is not supported by your browser');
      setTimeout(() => setLocateStatus(null), 3000);
      return;
    }

    setIsLocating(true);
    setLocateStatus('Pinging device hardware GPS sensors...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        const distFromBase = computeHaversineDistanceKm(baseStart.lat, baseStart.lng, coords.lat, coords.lng);
        setCurrentPosition(coords);
        setNewLat(coords.lat);
        setNewLng(coords.lng);
        setIsLocating(false);
        setLocateStatus(`Device GPS locked: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)} (±${Math.round(pos.coords.accuracy)}m)`);
        setTimeout(() => setLocateStatus(null), 4000);

        if (onSyncLocation) {
          onSyncLocation(coords.lat, coords.lng, 0);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocateStatus(`GPS sensor warning: ${err.message}. Using base registered coordinates.`);
        setTimeout(() => setLocateStatus(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Submit new visit
  const handleCreateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim()) return;

    const distFromStart = computeHaversineDistanceKm(baseStart.lat, baseStart.lng, newLat, newLng);

    if (onAddVisit) {
      await onAddVisit({
        placeName: newPlaceName.trim(),
        latitude: newLat,
        longitude: newLng,
        distanceKm: distFromStart,
        category: newCategory,
        notes: newNotes.trim() || undefined,
      });
    }

    setShowAddModal(false);
    setNewPlaceName('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Status Bar */}
      <div className={`p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} shadow-xs`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-lg font-extrabold tracking-tight ${theme.textPrimary}`}>
                    Device Location & Travel Distance Tracker
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Google Maps Platform
                  </span>
                </div>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Tracks distance traveled using Google Maps data with base starting coordinates from your address.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 px-3.5 rounded-xl border ${theme.borderClass} ${theme.isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Distance</div>
              <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                {totalDistanceTraveledKm.toFixed(2)} <span className="text-xs font-normal">km</span>
              </div>
            </div>

            <div className={`p-2.5 px-3.5 rounded-xl border ${theme.borderClass} ${theme.isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
              <div className="text-[10px] uppercase font-bold text-slate-400">Recent Visits</div>
              <div className={`text-base font-extrabold ${theme.textPrimary}`}>
                {visits.length} <span className="text-xs font-normal text-slate-400">places</span>
              </div>
            </div>

            <button
              onClick={() => setIsSimulatingWalk(!isSimulatingWalk)}
              className={`p-2.5 px-3 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer ${
                isSimulatingWalk
                  ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isSimulatingWalk ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSimulatingWalk ? 'Pause Walk' : 'Simulate Walk'}</span>
            </button>
          </div>
        </div>

        {/* GPS Sensor status notice */}
        {locateStatus && (
          <div className="mt-3 p-2.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Activity className="w-4 h-4 animate-spin text-emerald-600" />
            <span>{locateStatus}</span>
          </div>
        )}
      </div>

      {/* Main Map Container */}
      <div className={`rounded-2xl border ${theme.borderClass} overflow-hidden shadow-md bg-white dark:bg-slate-900`}>
        {/* Map Header Action Bar */}
        <div className={`px-4 py-3 border-b ${theme.borderClass} flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/60`}>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Base Start:
            </span>
            <span className="truncate max-w-[240px] sm:max-w-md text-slate-500 dark:text-slate-400">
              {profile?.addressLine || '12 Marine Drive, Nariman Point, Mumbai'} ({baseStart.lat.toFixed(4)}, {baseStart.lng.toFixed(4)})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGetDeviceGps}
              disabled={isLocating}
              className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-emerald-500' : ''}`} />
              <span>Locate GPS</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Visit Pin</span>
            </button>
          </div>
        </div>

        {/* Google Map View via @vis.gl/react-google-maps */}
        <div style={{ width: '100%', height: '440px', position: 'relative' }}>
          <APIProvider apiKey={apiKey}>
            <Map
              mapId="DEMO_MAP_ID"
              colorScheme="DARK"
              style={{ width: '100%', height: '100%' }}
              defaultCenter={{ lat: baseStart.lat, lng: baseStart.lng }}
              defaultZoom={14}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              <CameraRecenter target={currentPosition} />

              {/* 1. Base Starting Location Marker */}
              <AdvancedMarker
                position={{ lat: baseStart.lat, lng: baseStart.lng }}
                onClick={() => setShowBaseInfo(true)}
                title="Registered Base Start Location"
              >
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold shadow-md mb-1 whitespace-nowrap border border-emerald-400">
                    🏁 BASE START
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
              </AdvancedMarker>

              {/* Base InfoWindow */}
              {showBaseInfo && (
                <InfoWindow
                  position={{ lat: baseStart.lat, lng: baseStart.lng }}
                  onCloseClick={() => setShowBaseInfo(false)}
                >
                  <div className="p-2 text-slate-900 max-w-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase text-emerald-600">Base Origin Anchor</div>
                    <div className="text-xs font-extrabold">{profile?.addressLine || 'Home Base Residence'}</div>
                    <div className="text-[11px] text-slate-500">
                      Postal Code: {profile?.postalCode || '400021'} • {profile?.addressCity || 'Mumbai'}, {profile?.addressCountry || 'India'}
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                      Coordinates: {baseStart.lat.toFixed(5)}, {baseStart.lng.toFixed(5)}
                    </div>
                  </div>
                </InfoWindow>
              )}

              {/* 2. Live Device Position Marker (when simulating or active) */}
              <AdvancedMarker
                position={{ lat: currentPosition.lat, lng: currentPosition.lng }}
                title="Live Device Current Position"
              >
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg animate-ping absolute opacity-75" />
                  <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-lg relative">
                    <Footprints className="w-3 h-3" />
                  </div>
                </div>
              </AdvancedMarker>

              {/* 3. Recent Device Visit Markers */}
              {visits.map((visit) => {
                const isSelected = selectedVisit?.id === visit.id;
                const isDoctor = visit.category === 'Clinic/Doctor';
                const isGym = visit.category === 'Gym';

                return (
                  <AdvancedMarker
                    key={visit.id}
                    position={{ lat: visit.latitude, lng: visit.longitude }}
                    onClick={() => setSelectedVisit(visit)}
                    title={visit.placeName}
                  >
                    <div className="flex flex-col items-center cursor-pointer group">
                      <div className={`w-7 h-7 rounded-xl border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-115 ${
                        isDoctor
                          ? 'bg-indigo-600'
                          : isGym
                          ? 'bg-amber-600'
                          : 'bg-emerald-600'
                      }`}>
                        {isDoctor ? '🩺' : isGym ? '💪' : '📍'}
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Selected Visit InfoWindow */}
              {selectedVisit && (
                <InfoWindow
                  position={{ lat: selectedVisit.latitude, lng: selectedVisit.longitude }}
                  onCloseClick={() => setSelectedVisit(null)}
                >
                  <div className="p-2 text-slate-900 max-w-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase text-indigo-600">
                        {selectedVisit.category}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {selectedVisit.distanceKm} km from start
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900">
                      {selectedVisit.placeName}
                    </div>
                    {selectedVisit.notes && (
                      <p className="text-[11px] text-slate-600 italic">
                        "{selectedVisit.notes}"
                      </p>
                    )}
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex items-center justify-between">
                      <span>Visited: {new Date(selectedVisit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {onDeleteVisit && (
                        <button
                          onClick={() => {
                            onDeleteVisit(selectedVisit.id);
                            setSelectedVisit(null);
                          }}
                          className="text-red-500 hover:text-red-700 font-bold ml-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>

        {/* Recent Visits List Table */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-bold ${theme.textPrimary}`}>
              Recent Device Visits Log ({visits.length})
            </h3>
            <span className="text-xs text-slate-400">
              Recorded by phone accelerometer & GPS sensors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visits.map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  setCurrentPosition({ lat: v.latitude, lng: v.longitude });
                  setSelectedVisit(v);
                }}
                className={`p-3.5 rounded-xl border ${theme.borderClass} ${
                  theme.isDark ? 'bg-slate-800/80 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'
                } transition cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {v.category}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      {v.distanceKm} km
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold ${theme.textPrimary} line-clamp-1`}>
                    {v.placeName}
                  </h4>
                  {v.notes && (
                    <p className={`text-[11px] ${theme.textSecondary} line-clamp-2 mt-0.5`}>
                      {v.notes}
                    </p>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(v.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                    {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {onDeleteVisit && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVisit(v.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Visit"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Visit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Recent Device Visit Pin
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVisit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Place / Location Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Health Clinic, Campus Gym, Cafe"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Clinic/Doctor">Clinic / Doctor Visit</option>
                  <option value="Gym">Gym / Fitness Center</option>
                  <option value="Campus">University / Campus</option>
                  <option value="Library">Library / Study Center</option>
                  <option value="Park/Outdoor">Park / Running Track</option>
                  <option value="Market">Nutrition / Health Market</option>
                  <option value="Home">Home / Residence</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={newLat}
                    onChange={(e) => setNewLat(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={newLng}
                    onChange={(e) => setNewLng(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. 45 min workout, blood pressure checkup"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Save Visit Pin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
