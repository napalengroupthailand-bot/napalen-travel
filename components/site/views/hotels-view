'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, MapPin, Phone, Navigation, ExternalLink } from 'lucide-react'
import { useNav } from '../nav'
import { useStore } from '../store'
import { type Hotel } from '@/lib/site-data'
import { playSuccess, tapFeedback } from '@/lib/sfx'

function toRad(d: number) {
  return (d * Math.PI) / 180
}
function toDeg(r: number) {
  return (r * 180) / Math.PI
}

function bearingTo(lat1: number, lng1: number, lat2: number, lng2: number) {
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δλ = toRad(lng2 - lng1)
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

function openMaps(h: Hotel) {
  playSuccess()
  const dest =
    h.lat != null && h.lng != null
      ? `${h.lat},${h.lng}`
      : encodeURIComponent(h.address || h.name)
  const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=walking`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function HotelsView() {
  const { navigate } = useNav()
  const { settings } = useStore()
  const hotels = settings.hotels || []
  const [selected, setSelected] = useState<Hotel | null>(null)
  const [mapMode, setMapMode] = useState<'map' | 'street'>('map')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [heading, setHeading] = useState<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (p) => setUserPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setUserPos(null),
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }, [])

  useEffect(() => {
    if (!selected) return
    const onOrient = (e: DeviceOrientationEvent) => {
      const anyE = e as DeviceOrientationEvent & { webkitCompassHeading?: number }
      if (typeof anyE.webkitCompassHeading === 'number') setHeading(anyE.webkitCompassHeading)
      else if (e.alpha != null) setHeading((360 - e.alpha) % 360)
    }
    const start = async () => {
      const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
      if (typeof DOE.requestPermission === 'function') {
        try {
          await DOE.requestPermission()
        } catch {
          /* ignore */
        }
      }
      window.addEventListener('deviceorientation', onOrient, true)
    }
    void start()
    return () => window.removeEventListener('deviceorientation', onOrient, true)
  }, [selected])

  const targetBearing = useMemo(() => {
    if (!selected?.lat || !selected?.lng || !userPos) return null
    return bearingTo(userPos.lat, userPos.lng, selected.lat, selected.lng)
  }, [selected, userPos])

  const needle =
    targetBearing != null && heading != null
      ? (targetBearing - heading + 360) % 360
      : targetBearing ?? 0

  if (selected) {
    const mapEmbed =
      selected.lat != null && selected.lng != null
        ? mapMode === 'street'
          ? `https://www.google.com/maps?q=&layer=c&cbll=${selected.lat},${selected.lng}&cbp=11,0,0,0,0&output=svembed`
          : `https://maps.google.com/maps?q=${selected.lat},${selected.lng}&z=17&hl=th&output=embed`
        : `https://maps.google.com/maps?q=${encodeURIComponent(selected.address || selected.name)}&z=17&hl=th&output=embed`

    return (
      <div className="app-page page-enter max-w-lg">
        <div className="app-header-bar">
          <button
            type="button"
            onClick={(e) => {
              tapFeedback(e)
              setSelected(null)
            }}
            className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="size-4 text-deep-blue" />
          </button>
          <h1 className="flex-1 truncate text-center text-base font-bold text-deep-blue">
            {selected.name}
          </h1>
          <div className="w-9" />
        </div>

        <div className="soft-card overflow-hidden">
          {selected.image ? (
            <img src={selected.image} alt={selected.name} className="h-36 w-full object-cover" />
          ) : null}
          <div className="space-y-3 p-4">
            {selected.city ? (
              <span className="rounded-full bg-royal-blue/10 px-2.5 py-0.5 text-xs font-semibold text-royal-blue">
                {selected.city}
              </span>
            ) : null}
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-royal-blue" />
              {selected.address}
            </p>
            {selected.phone ? (
              <a
                href={`tel:${selected.phone}`}
                className="flex items-center gap-2 text-sm font-medium text-deep-blue"
              >
                <Phone className="size-4 text-royal-blue" />
                {selected.phone}
              </a>
            ) : null}

            {selected.lat != null && selected.lng != null ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-soft-mint py-4">
                <p className="text-xs font-medium text-muted-foreground">ทิศทางไปโรงแรม</p>
                <div className="relative size-28">
                  <div className="absolute inset-0 rounded-full border-4 border-royal-blue/15 bg-white" />
                  <div
                    className="absolute inset-0 flex items-start justify-center pt-3 transition-transform duration-100"
                    style={{ transform: `rotate(${needle}deg)` }}
                  >
                    <div className="h-10 w-1 rounded-full bg-gradient-to-t from-royal-blue to-red-500" />
                  </div>
                  <span className="absolute left-1/2 top-1 -translate-x-1/2 text-[10px] font-bold">N</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {targetBearing != null
                    ? `${targetBearing.toFixed(0)}° จากทิศเหนือ`
                    : 'รอตำแหน่ง GPS...'}
                </p>
              </div>
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="mb-0 flex gap-2 p-2">
                <button
                  type="button"
                  onClick={() => setMapMode('map')}
                  className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
                    mapMode === 'map' ? 'bg-royal-blue text-white' : 'bg-soft-mint text-deep-blue'
                  }`}
                >
                  แผนที่ถนน
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('street')}
                  className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
                    mapMode === 'street' ? 'bg-royal-blue text-white' : 'bg-soft-mint text-deep-blue'
                  }`}
                >
                  มุมถนน (Street)
                </button>
              </div>
              <iframe
                title="map"
                src={mapEmbed}
                className="h-52 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <button
              type="button"
              onClick={() => openMaps(selected)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-royal-blue py-3.5 text-sm font-bold text-white shadow-lg shadow-royal-blue/25 active:scale-[0.98]"
            >
              <Navigation className="size-4" />
              นำทางด้วย Google Maps
              <ExternalLink className="size-3.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-page page-enter max-w-lg">
      <div className="app-header-bar">
        <button
          type="button"
          onClick={(e) => {
            tapFeedback(e)
            navigate('home')
          }}
          className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="size-4 text-deep-blue" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-deep-blue">กลับโรงแรม</h1>
        <div className="w-9" />
      </div>

      <p className="mb-4 text-center text-xs text-muted-foreground">
        เลือกโรงแรมแล้วกดนำทาง — ระบบจะเปิดแผนที่ไปยังที่พัก
      </p>

      {hotels.length === 0 ? (
        <div className="soft-card p-8 text-center text-sm text-muted-foreground">
          ยังไม่มีข้อมูลโรงแรม — ผู้ดูแลเพิ่มได้ที่ Admin
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {hotels.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={(e) => {
                tapFeedback(e)
                setSelected(h)
              }}
              className="soft-card lift flex w-full gap-3 overflow-hidden p-0 text-left"
            >
              <img
                src={h.image || '/placeholder.svg'}
                alt={h.name}
                className="h-24 w-24 shrink-0 object-cover"
              />
              <div className="flex flex-1 flex-col justify-center py-2 pr-3">
                <p className="font-bold text-deep-blue">{h.name}</p>
                {h.city ? <p className="text-xs text-royal-blue">{h.city}</p> : null}
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{h.address}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
