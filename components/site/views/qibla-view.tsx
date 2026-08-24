'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Compass, MapPin, RefreshCw } from 'lucide-react'
import { useNav } from '../nav'

/** พิกัดกะอ์บะฮ์ มักกะฮ์ */
const KAABA = { lat: 21.4225, lng: 39.8262 }

function toRad(d: number) {
  return (d * Math.PI) / 180
}
function toDeg(r: number) {
  return (r * 180) / Math.PI
}

/** คำนวณทิศกิบลัต (องศาจากเหนือจริง) */
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
      setError('อุปกรณ์ไม่รองรับ GPS')
      // fallback กรุงเทพ
      setQibla(qiblaBearing(13.7563, 100.5018))
      setPlace('กรุงเทพฯ (โดยประมาณ)')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setQibla(qiblaBearing(latitude, longitude))
        setPlace(`${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°`)
      },
      () => {
        setQibla(qiblaBearing(13.7563, 100.5018))
        setPlace('กรุงเทพฯ (โดยประมาณ)')
        setError('ใช้ตำแหน่งโดยประมาณ — อนุญาต GPS จะแม่นยำกว่า')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  useEffect(() => {
    locate()
  }, [locate])

  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      // iOS ใช้ webkitCompassHeading, Android ใช้ alpha
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
      // iOS 13+ ต้องขอ permission
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
    qibla != null && heading != null && Math.abs(((qibla - heading + 540) % 360) - 180) < 8

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <button
        type="button"
        onClick={() => navigate('home')}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-royal-blue"
      >
        <ArrowLeft className="size-4" />
        กลับหน้าแรก
      </button>

      <div className="soft-card overflow-hidden">
        <div className="bg-gradient-to-br from-deep-blue to-royal-blue px-5 py-4 text-bright-sky">
          <h1 className="flex items-center gap-2 text-lg font-bold">
            <Compass className="size-5 text-luxury-gold" />
            ทิศกิบลัต
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-bright-sky/75">
            <MapPin className="size-3.5" />
            {place}
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 p-6">
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
              className="w-full rounded-full bg-royal-blue px-4 py-2.5 text-sm font-semibold text-white"
            >
              อนุญาตการใช้เข็มทิศ
            </button>
          )}

          {/* Compass dial */}
          <div className="relative size-64">
            <div
              className="absolute inset-0 rounded-full border-4 border-royal-blue/20 bg-gradient-to-b from-bright-sky to-white shadow-inner"
              style={{
                transform: heading != null ? `rotate(${-heading}deg)` : undefined,
                transition: 'transform 0.15s linear',
              }}
            >
              {/* degree marks */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-2 h-3 w-0.5 -translate-x-1/2 origin-[center_120px] bg-deep-blue/30"
                  style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
                />
              ))}
              <span className="absolute left-1/2 top-4 -translate-x-1/2 text-xs font-bold text-deep-blue">
                N
              </span>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-deep-blue/50">
                S
              </span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-deep-blue/50">
                E
              </span>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-deep-blue/50">
                W
              </span>
            </div>

            {/* Qibla needle (points toward Kaaba relative to device) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `rotate(${needle}deg)`,
                transition: 'transform 0.15s linear',
              }}
            >
              <div className="flex flex-col items-center">
                <div className="h-20 w-1 rounded-full bg-gradient-to-t from-luxury-gold to-red-500 shadow" />
                <div className="-mt-1 flex size-8 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-bold text-deep-blue shadow">
                  ك
                </div>
              </div>
            </div>
          </div>

          {aligned ? (
            <p className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              ✓ ตรงทิศกิบลัตแล้ว
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {qibla != null ? `ทิศกิบลัต ${qibla.toFixed(1)}° จากเหนือ` : 'กำลังคำนวณ...'}
            </p>
          )}

          {error && <p className="text-center text-xs text-amber-600">{error}</p>}

          <button
            type="button"
            onClick={locate}
            className="flex items-center gap-2 rounded-full border border-royal-blue/30 px-4 py-2 text-sm font-medium text-royal-blue hover:bg-soft-mint"
          >
            <RefreshCw className="size-4" />
            รีเฟรชตำแหน่ง
          </button>

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            ถือเครื่องในแนวระนาบ หมุนตัวจนเข็มทองชี้ขึ้นด้านบน
            <br />
            บน iPhone อาจต้องอนุญาตเข็มทิศก่อนใช้งาน
          </p>
        </div>
      </div>
    </div>
  )
}
