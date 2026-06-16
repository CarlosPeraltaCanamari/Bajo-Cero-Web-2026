'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'

const SUCRE = { lat: -19.0431, lng: -65.2592 }
const SANTA_CRUZ = { lat: -17.7833, lng: -63.1821 }

// Custom Premium Dark Map Styles for Google Maps (if API Key is available)
const googleDarkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#020b18" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#020b18" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#182a44" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#081a30" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0d2646" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#0d2646" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }], },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3c192" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000d1e" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
]

export default function GoogleMapPicker({ lat, lng, onChange, defaultCity }) {
  const mapRef = useRef(null)
  const searchInputRef = useRef(null)
  
  // App Config
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  
  // Google Maps States
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)
  const [markerInstance, setMarkerInstance] = useState(null)
  
  // Leaflet States (OSM Fallback)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const leafletMapRef = useRef(null)
  const leafletMarkerRef = useRef(null)
  
  // Search & GPS States
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [loadingGps, setLoadingGps] = useState(false)

  // 1. Loader Engine: Load Google Maps if Key exists, otherwise load Leaflet (OpenStreetMap)
  useEffect(() => {
    if (apiKey) {
      // Load Google Maps API
      if (window.google && window.google.maps) {
        Promise.resolve().then(() => setGoogleLoaded(true))
        return
      }

      const existingScript = document.getElementById('google-maps-script')
      if (existingScript) {
        const handleLoad = () => Promise.resolve().then(() => setGoogleLoaded(true))
        existingScript.addEventListener('load', handleLoad)
        return () => existingScript.removeEventListener('load', handleLoad)
      }

      const script = document.createElement('script')
      script.id = 'google-maps-script'
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${apiKey}`
      script.async = true
      script.defer = true
      script.onload = () => Promise.resolve().then(() => setGoogleLoaded(true))
      script.onerror = () => {
        console.error('Error al cargar la API de Google Maps.')
        toast.error('No se pudo cargar Google Maps. Recargando en modo alternativo...')
      }
      document.head.appendChild(script)
    } else {
      // Load Leaflet (OSM fallback) dynamically
      if (window.L) {
        Promise.resolve().then(() => setLeafletLoaded(true))
        return
      }

      // Append Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // Append Leaflet JS
      const existingLeafletScript = document.getElementById('leaflet-js')
      if (existingLeafletScript) {
        const handleLoad = () => Promise.resolve().then(() => setLeafletLoaded(true))
        existingLeafletScript.addEventListener('load', handleLoad)
        return () => existingLeafletScript.removeEventListener('load', handleLoad)
      }

      const script = document.createElement('script')
      script.id = 'leaflet-js'
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      script.onload = () => Promise.resolve().then(() => setLeafletLoaded(true))
      document.head.appendChild(script)
    }
  }, [apiKey])

  // 2. Google Maps Initialization
  useEffect(() => {
    if (!apiKey || !googleLoaded || !mapRef.current) return

    let initialCenter = SUCRE
    if (lat && lng) {
      initialCenter = { lat: Number(lat), lng: Number(lng) }
    } else if (defaultCity === 'Santa Cruz') {
      initialCenter = SANTA_CRUZ
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: (lat && lng) ? 16 : 14,
      styles: googleDarkMapStyle,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    })
    setMapInstance(map)

    const marker = new window.google.maps.Marker({
      position: initialCenter,
      map: map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      icon: {
        path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 6,
        fillColor: '#dc7828',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
      }
    })
    setMarkerInstance(marker)

    marker.addListener('dragend', () => {
      const pos = marker.getPosition()
      onChange({ lat: pos.lat(), lng: pos.lng() })
    })

    map.addListener('click', (event) => {
      marker.setPosition(event.latLng)
      onChange({ lat: event.latLng.lat(), lng: event.latLng.lng() })
    })

    // Autocomplete setup
    if (searchInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ['geometry', 'name', 'formatted_address'],
        types: ['geocode', 'establishment'],
      })
      autocomplete.bindTo('bounds', map)
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.geometry && place.geometry.location) {
          const loc = place.geometry.location
          map.setCenter(loc)
          map.setZoom(17)
          marker.setPosition(loc)
          onChange({ lat: loc.lat(), lng: loc.lng() })
        }
      })
    }
  }, [googleLoaded, apiKey])

  // 3. Leaflet (OpenStreetMap) Initialization (Keyless Fallback)
  useEffect(() => {
    if (apiKey || !leafletLoaded || !mapRef.current) return

    let initialCenter = SUCRE
    if (lat && lng) {
      initialCenter = { lat: Number(lat), lng: Number(lng) }
    } else if (defaultCity === 'Santa Cruz') {
      initialCenter = SANTA_CRUZ
    }

    // Reset map instance if it already exists
    if (leafletMapRef.current) {
      leafletMapRef.current.remove()
    }

    const map = window.L.map(mapRef.current, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: (lat && lng) ? 16 : 14,
      zoomControl: true,
    })
    leafletMapRef.current = map

    // CartoDB Dark Matter tiles (premium keyless dark theme layer)
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map)

    // DivIcon using SVG pin
    const pinIcon = window.L.divIcon({
      html: `
        <div style="display: flex; justify-content: center; align-items: center; width: 30px; height: 30px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#dc7828" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3" fill="#ffffff"/>
          </svg>
        </div>
      `,
      className: 'custom-leaflet-pin',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    })

    const marker = window.L.marker([initialCenter.lat, initialCenter.lng], {
      draggable: true,
      icon: pinIcon
    }).addTo(map)
    leafletMarkerRef.current = marker

    marker.on('dragend', () => {
      const pos = marker.getLatLng()
      onChange({ lat: pos.lat, lng: pos.lng })
    })

    map.on('click', (e) => {
      marker.setLatLng(e.latlng)
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
    })

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [leafletLoaded, apiKey])

  // 4. Handle defaultCity changes (Sucre / Santa Cruz)
  useEffect(() => {
    if (lat && lng) return // Don't override user's coordinates

    const newCenter = defaultCity === 'Santa Cruz' ? SANTA_CRUZ : SUCRE

    if (apiKey && mapInstance && markerInstance) {
      mapInstance.setCenter(newCenter)
      mapInstance.setZoom(14)
      markerInstance.setPosition(newCenter)
    } else if (!apiKey && leafletMapRef.current && leafletMarkerRef.current) {
      leafletMapRef.current.setView([newCenter.lat, newCenter.lng], 14)
      leafletMarkerRef.current.setLatLng([newCenter.lat, newCenter.lng])
    }
  }, [defaultCity, mapInstance, markerInstance, apiKey, lat, lng])

  // 5. Nominatim Free Geocoding Search Engine (for OpenStreetMap mode)
  const handleSearchAddress = async (e) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      // Restrict search results to Bolivia context
      const query = `${searchQuery.trim()}, Bolivia`
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
      const data = await res.json()
      
      if (data && data.length > 0) {
        const first = data[0]
        const location = { lat: parseFloat(first.lat), lng: parseFloat(first.lon) }

        if (apiKey && mapInstance && markerInstance) {
          const latLng = new window.google.maps.LatLng(location.lat, location.lng)
          mapInstance.setCenter(latLng)
          mapInstance.setZoom(17)
          markerInstance.setPosition(latLng)
        } else if (!apiKey && leafletMapRef.current && leafletMarkerRef.current) {
          leafletMapRef.current.setView([location.lat, location.lng], 17)
          leafletMarkerRef.current.setLatLng([location.lat, location.lng])
        }

        onChange(location)
        toast.success('Ubicación encontrada.')
      } else {
        toast.error('No se encontró la dirección.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error al realizar la búsqueda.')
    } finally {
      setSearching(false)
    }
  }

  // 6. Geolocation GPS Engine
  const handleGetCurrentLocation = (e) => {
    e.preventDefault()
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización.')
      return
    }

    setLoadingGps(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        if (apiKey && mapInstance && markerInstance) {
          mapInstance.setCenter(userLoc)
          mapInstance.setZoom(17)
          markerInstance.setPosition(userLoc)
        } else if (!apiKey && leafletMapRef.current && leafletMarkerRef.current) {
          leafletMapRef.current.setView([userLoc.lat, userLoc.lng], 17)
          leafletMarkerRef.current.setLatLng([userLoc.lat, userLoc.lng])
        }

        onChange(userLoc)
        setLoadingGps(false)
        toast.success('Ubicación GPS obtenida con éxito.')
      },
      (error) => {
        console.warn('Error getting location', error)
        setLoadingGps(false)
        if (error.code === 1) {
          toast.error('Permiso de ubicación denegado. Habilita los permisos en tu navegador.')
        } else {
          toast.error('No se pudo obtener tu ubicación actual.')
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '10px' }}>
      
      {/* Search Input and GPS buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '13px', color: 'rgba(255,255,255,0.35)' }}>
            <Search size={16} />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder={apiKey ? "Buscar tu calle, plaza o referencia..." : "Escribe dirección y presiona Enter..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '42px',
              padding: '0 40px 0 38px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'all 0.2s',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (!apiKey) {
                  handleSearchAddress()
                }
              }
            }}
          />
          {!apiKey && searchQuery.trim() && (
            <button
              onClick={handleSearchAddress}
              disabled={searching}
              style={{
                position: 'absolute',
                right: '12px',
                top: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--color-bc-orange)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search size={16} className={searching ? 'animate-spin' : ''} />
            </button>
          )}
        </div>

        <button
          onClick={handleGetCurrentLocation}
          disabled={loadingGps}
          style={{
            height: '42px',
            padding: '0 16px',
            borderRadius: '12px',
            background: loadingGps ? 'rgba(255,255,255,0.05)' : 'rgba(0, 74, 143, 0.15)',
            border: '1px solid rgba(0, 74, 143, 0.3)',
            color: 'var(--color-bc-blue)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.25s',
          }}
          className="hover:bg-bc-blue/20 hover:border-bc-blue/50 active:scale-97"
        >
          <Navigation size={14} className={loadingGps ? 'animate-spin' : ''} />
          {loadingGps ? 'Localizando...' : 'Mi ubicación actual'}
        </button>
      </div>

      {/* Map Element */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '320px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#010711',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
          zIndex: 10
        }}
      >
        {((apiKey && !googleLoaded) || (!apiKey && !leafletLoaded)) && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'rgba(2,11,24,0.8)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '12px',
            zIndex: 100
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '2px solid rgba(255,255,255,0.1)',
              borderTopColor: 'var(--color-bc-orange)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Cargando mapa...
          </div>
        )}
      </div>

      {/* Selected Coordinates Status */}
      {lat && lng ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(220,120,40,0.05)',
          border: '1px solid rgba(220,120,40,0.15)',
          padding: '8px 14px',
          borderRadius: '10px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.7)',
        }}>
          <MapPin size={14} color="var(--color-bc-orange)" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: 'white', marginRight: '4px' }}>Ubicación fijada:</strong>
            Lat: <span style={{ fontFamily: 'monospace', color: '#ffb076' }}>{Number(lat).toFixed(6)}</span>, 
            Lng: <span style={{ fontFamily: 'monospace', color: '#ffb076', marginLeft: '6px' }}>{Number(lng).toFixed(6)}</span>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '8px 14px',
          borderRadius: '10px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.4)',
        }}>
          <MapPin size={14} style={{ flexShrink: 0 }} />
          <span>Fija tu ubicación exacta en el mapa arrastrando el pin o haciendo clic.</span>
        </div>
      )}

      {/* Leaflet Custom Pin CSS Overwrite */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .custom-leaflet-pin {
          background: none !important;
          border: none !important;
        }
        .leaflet-control-container .leaflet-routing-container {
          display: none !important;
        }
      `}</style>

    </div>
  )
}
