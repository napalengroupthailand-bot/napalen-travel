'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, MapPin, RefreshCw } from 'lucide-react'
import { useNav } from '../nav'

const KAABA = { lat: 21.4225, lng: 39.8262 }

function toRad(d: number) {
  return (d * Math.PI) / 180
}
function toDeg(r: number) {
  return (r * 180) / Math.PI
}

function qiblaBearing(lat: number, lng: number): number {
  const φ1 = toRad(lat)
  const φ2 = toRad(KAABA.lat)
  const Δλ = toRad(KAABA.lng - lng)
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

export function QiblaView() {
  const { navigate } = useNav()
  const [heading, setHeading] = useState<number | null>(null)
  const [qibla, setQibla] = useState<number | null>(null)
  const [place, setPlace] = useState('กำลังหาตำแหน่ง...')
  const [error, setError] = useState('')
  const [permissionHint, setPermissionHint] = useState(false)

  const locate = useCallback(() => {
    setError('')
    if (!navigator.geolocation) {
      setQibla(qiblaBearing(13.7563, 100.5018))
      setPlace('กรุงเทพมหานคร, ประเทศไทย')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setQibla(qiblaBearing(latitude, longitude))
        setPlace('ตำแหน่งปัจจุบัน')
      },
      () => {
        setQibla(qiblaBearing(13.7563, 100.5018))
        setPlace('กรุงเทพมหานคร, ประเทศไทย')
        setError('ใช้ตำแหน่งโดยประมาณ')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  useEffect(() => {
    locate()
  }, [locate])

  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      let h: number | null = null
      const anyE = e as DeviceOrientationEvent & { webkitCompassHeading?: number }
      if (typeof anyE.webkitCompassHeading === 'number') {
        h = anyE.webkitCompassHeading
      } else if (e.alpha != null) {
        h = (360 - e.alpha) % 360
      }
      if (h != null) setHeading(h)
    }

    const start = async () => {
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>
      }
      if (typeof DOE.requestPermission === 'function') {
        try {
          const p = await DOE.requestPermission()
          if (p !== 'granted') {
            setPermissionHint(true)
            return
          }
        } catch {
          setPermissionHint(true)
          return
        }
      }
      window.addEventListener('deviceorientation', onOrient, true)
    }
    start()
    return () => window.removeEventListener('deviceorientation', onOrient, true)
  }, [])

  const needle =
    qibla != null && heading != null ? ((qibla - heading + 360) % 360) : qibla ?? 0
  const aligned =
    qibla != null &&
    heading != null &&
    Math.min(
      Math.abs(((qibla - heading + 360) % 360)),
      360 - Math.abs(((qibla - heading + 360) % 360)),
    ) < 8

  return (
    <div className="app-page page-enter min-h-[70vh]">
      <div className="app-header-bar">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
          aria-label="กลับ"
        >
          <ArrowLeft className="size-5 text-deep-blue" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-deep-blue">ทิศกิบลัต</h1>
        <button
          type="button"
          onClick={locate}
          className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
          aria-label="รีเฟรช"
        >
          <RefreshCw className="size-4 text-royal-blue" />
        </button>
      </div>

      <p className="mb-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-3.5 text-royal-blue" />
        {place}
      </p>

      {permissionHint && (
        <button
          type="button"
          onClick={async () => {
            const DOE = DeviceOrientationEvent as unknown as {
              requestPermission?: () => Promise<string>
            }
            if (DOE.requestPermission) {
              const p = await DOE.requestPermission()
              if (p === 'granted') setPermissionHint(false)
            }
          }}
          className="mb-4 w-full rounded-full bg-royal-blue py-3 text-sm font-semibold text-white shadow-lg"
        >
          อนุญาตการใช้เข็มทิศ
        </button>
      )}

      {/* Large compass card — Salaam style */}
      <div className="soft-card mx-auto flex max-w-sm flex-col items-center px-6 py-10">
        <div className="relative size-56 sm:size-64">
          <div
            className="absolute inset-0 rounded-full border-[6px] border-royal-blue/15 bg-gradient-to-b from-white to-soft-mint shadow-inner"
            style={{
              transform: heading != null ? `rotate(${-heading}deg)` : undefined,
              transition: 'transform 0.12s linear',
            }}
          >
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute left-1/2 top-3 origin-[center_104px] -translate-x-1/2"
                style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
              >
                <div
                  className={`mx-auto ${deg % 90 === 0 ? 'h-3 w-0.5 bg-deep-blue' : 'h-2 w-px bg-deep-blue/25'}`}
                />
              </div>
            ))}
            <span className="absolute left-1/2 top-5 -translate-x-1/2 text-sm font-bold text-deep-blue">
              N
            </span>
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm font-bold text-deep-blue/40">
              S
            </span>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-deep-blue/40">
              E
            </span>
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-deep-blue/40">
              W
            </span>
          </div>

          <div
            className="absolute inset-0 flex items-start justify-center pt-8"
            style={{
              transform: `rotate(${needle}deg)`,
              transition: 'transform 0.12s linear',
            }}
          >
            <div className="flex flex-col items-center">
              <div className="h-16 w-1.5 rounded-full bg-gradient-to-t from-royal-blue to-red-500 shadow-md" />
              <div className="-mt-1 flex size-9 items-center justify-center rounded-full bg-luxury-gold text-xs font-bold text-deep-blue shadow-md ring-2 ring-white">
                ك
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full">
          {aligned ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">
                ✓
              </span>
              ตรงทิศกิบลัตแล้ว!
            </div>
          ) : (
            <div className="rounded-2xl bg-soft-mint px-4 py-3 text-center text-sm text-deep-blue">
              {qibla != null
                ? `ทิศกิบลัต ${qibla.toFixed(1)}° จากทิศเหนือ`
                : 'กำลังคำนวณ...'}
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-center text-xs text-amber-600">{error}</p>}
        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
          ถือเครื่องระนาบ หมุนตัวจนเข็มชี้ขึ้นด้านบน
        </p>
      </div>
    </div>
  )
}
