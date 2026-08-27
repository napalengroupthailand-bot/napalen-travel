import { supabase } from '@/lib/supabase'

const BUCKET = 'site-images'

/**
 * อัปโหลดไฟล์ไป Supabase Storage แล้วคืน public URL
 * ถ้าล้มเหลว (ยังไม่มี bucket / policy) จะ throw เพื่อให้ caller fallback
 */
export async function uploadImageToStorage(file: File, folder = 'uploads'): Promise<string> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || `image/${ext}`,
  })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  if (!data?.publicUrl) throw new Error('no public url')
  return data.publicUrl
}

export { BUCKET as SITE_IMAGES_BUCKET }
