export type PackageType = 'hajj' | 'umrah'

export type SubBlock = {
  id: string
  title: string
  content: string
  images: string[]
}

export type Package = {
  id: string
  type: PackageType
  name: string
  price: string
  duration: string
  hotel: string
  distance: string
  /** ภาพหลัก (แรกสุด) + ภาพเพิ่มเติม */
  images: string[]
  highlights: string[]
  featured?: boolean
  subBlocks: SubBlock[]
}

export type Article = {
  id: string
  title: string
  category: string
  excerpt: string
  /** ภาพหลัก + ภาพเพิ่มเติม */
  images: string[]
  date: string
  content: string
  subBlocks: SubBlock[]
}

export type RegStatus = 'pending' | 'contacted' | 'confirmed' | 'cancelled'

export type Registration = {
  id: string
  name: string
  phone: string
  email: string
  pax: number
  packageName: string
  type: PackageType
  note: string
  status: RegStatus
  createdAt: string
}

export type CompanyInfo = {
  name: string
  nameEn: string
  address: string
  phone: string
  email: string
  lineLink: string
  mapEmbed: string
}

export type Testimonial = {
  id: string
  name: string
  role: string
  text: string
  image: string
}

export type StaffContact = {
  id: string
  name: string
  role: string
  phone: string
}

export type SiteStats = {
  umrahCount: string
  hajjCount: string
  totalCustomers: string
}

export type SiteSettings = {
  /** YouTube video ID หรือ full URL สำหรับหน้าปก */
  youtubeHeroUrl: string
  gallery: string[]
  testimonials: Testimonial[]
  staffContacts: StaffContact[]
  stats: SiteStats
}

export const STATUS_LABELS: Record<RegStatus, string> = {
  pending: 'รอดำเนินการ',
  contacted: 'ติดต่อแล้ว',
  confirmed: 'ยืนยันแล้ว',
  cancelled: 'ยกเลิก',
}

export const defaultCompany: CompanyInfo = {
  name: 'หจก. นาปาเลน แทรเวิล แอนด์ ทัวร์',
  nameEn: 'NAPALEN TRAVEL & TOUR LTD., PART.',
  address: '128/9 หมู่ 4 ตำบลควนลัง อำเภอหาดใหญ่ จังหวัดสงขลา 90110',
  phone: '074-123-456',
  email: 'info@napalentravel.com',
  lineLink: 'https://line.me/R/ti/p/@napalentravel',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.6!2d100.474!3d7.006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMjEuNiJOIDEwMMKwMjgnMjYuNCJF!5e0!3m2!1sth!2sth!4v1700000000000',
}

export const defaultStats: SiteStats = {
  umrahCount: '3,200+',
  hajjCount: '1,800+',
  totalCustomers: '5,000+',
}

export const defaultSettings: SiteSettings = {
  youtubeHeroUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  gallery: [
    '/images/hero-kaaba.png',
    '/images/grand-mosque.png',
    '/images/medina-mosque.png',
    '/images/hajj-arafat.png',
  ],
  testimonials: [
    {
      id: 't1',
      name: 'ฮัจยีย์ สุไลมาน',
      role: 'ผู้แสวงบุญฮัจญ์ 2567',
      text: 'ประทับใจมากครับ ทีมงานดูแลดีทุกขั้นตอน ที่พักใกล้มัสยิด อาหารอร่อย ขอบคุณนาปาเลนที่ทำให้ฝันเป็นจริง',
      image: '/images/person-1.png',
    },
    {
      id: 't2',
      name: 'คุณนูรีดา',
      role: 'ผู้แสวงบุญอุมเราะห์',
      text: 'เดินทางสะดวกสบาย แซะหฺใจดีคอยแนะนำตลอด ราคาคุ้มค่ามากค่ะ จะกลับมาใช้บริการอีกแน่นอน',
      image: '/images/person-2.png',
    },
    {
      id: 't3',
      name: 'ครอบครัวอาแว',
      role: 'อุมเราะห์รอมฎอน',
      text: 'ไปกันทั้งครอบครัว 6 คน จัดการทุกอย่างเรียบร้อย ประทับใจในความเอาใจใส่ เป็นทริปที่อบอุ่นและศรัทธาที่สุด',
      image: '/images/person-3.png',
    },
  ],
  staffContacts: [
    { id: 's1', name: 'แซะหฺ อิสมาแอล', role: 'หัวหน้าคณะฮัจญ์', phone: '081-111-1111' },
    { id: 's2', name: 'แซะหฺ อับดุลรอฮ์มาน', role: 'ผู้ดูแลคณะอุมเราะห์', phone: '082-222-2222' },
    { id: 's3', name: 'คุณซากีนะฮ์', role: 'ฝ่ายลูกค้าสัมพันธ์', phone: '083-333-3333' },
  ],
  stats: defaultStats,
}

export const defaultPackages: Package[] = [
  {
    id: 'hajj-vip',
    type: 'hajj',
    name: 'ฮัจญ์ VIP พรีเมียม 2568',
    price: '฿395,000',
    duration: '40 วัน',
    hotel: 'โรงแรม 5 ดาว',
    distance: 'ใกล้มัสยิดหะรอม 300 ม.',
    images: ['/images/hero-kaaba.png'],
    highlights: [
      'ที่พักระดับ 5 ดาว ใกล้มัสยิดอัลหะรอม',
      'อาหารฮาลาลครบ 3 มื้อ บุฟเฟต์นานาชาติ',
      'แซะหฺนำคณะตลอดการเดินทาง',
      'รถปรับอากาศ VIP รับส่งทุกจุด',
    ],
    featured: true,
    subBlocks: [],
  },
  {
    id: 'hajj-standard',
    type: 'hajj',
    name: 'ฮัจญ์ ประหยัด อุ่นใจ 2568',
    price: '฿285,000',
    duration: '35 วัน',
    hotel: 'โรงแรม 4 ดาว',
    distance: 'ใกล้มัสยิดหะรอม 800 ม.',
    images: ['/images/grand-mosque.png'],
    highlights: [
      'ที่พักสะอาดสะดวก ระดับ 4 ดาว',
      'อาหารฮาลาลตามหลักศาสนา',
      'ทีมงานดูแลใกล้ชิดตลอด 24 ชั่วโมง',
      'ตั๋วเครื่องบินสายการบินชั้นนำ',
    ],
    subBlocks: [],
  },
  {
    id: 'umrah-ramadan',
    type: 'umrah',
    name: 'อุมเราะห์ รอมฎอน สุดพิเศษ',
    price: '฿89,000',
    duration: '12 วัน',
    hotel: 'โรงแรม 5 ดาว',
    distance: 'ใกล้มัสยิดหะรอม 250 ม.',
    images: ['/images/medina-mosque.png'],
    highlights: [
      'ละหมาดตะรอเวียห์ในมัสยิดอัลหะรอม',
      'เยือนมะดีนะฮ์ 4 คืน',
      'ที่พักหรูใจกลางเมือง',
      'ของว่างละศีลอดทุกวัน',
    ],
    featured: true,
    subBlocks: [],
  },
  {
    id: 'umrah-economy',
    type: 'umrah',
    name: 'อุมเราะห์ ประหยัด เดินทางสบาย',
    price: '฿55,000',
    duration: '9 วัน',
    hotel: 'โรงแรม 3 ดาว',
    distance: 'ใกล้มัสยิดหะรอม 1 กม.',
    images: ['/images/hajj-arafat.png'],
    highlights: [
      'ราคาประหยัด เหมาะสำหรับครอบครัว',
      'บริการรถรับส่งครบทุกจุด',
      'แซะหฺนำการประกอบพิธี',
      'ประกันการเดินทางตลอดทริป',
    ],
    subBlocks: [],
  },
]

export const defaultArticles: Article[] = [
  {
    id: 'art-prep',
    title: 'เตรียมตัวก่อนเดินทางประกอบพิธีฮัจญ์',
    category: 'ความรู้ฮัจญ์',
    excerpt: 'สิ่งที่ควรเตรียมทั้งด้านร่างกาย จิตใจ และเอกสารก่อนออกเดินทางสู่นครมักกะฮ์',
    images: ['/images/article-prep.png'],
    date: '15 มกราคม 2568',
    content:
      'การเดินทางไปประกอบพิธีฮัจญ์เป็นหนึ่งในเสาหลักทั้งห้าของศาสนาอิสลาม ผู้ที่มีความสามารถควรเตรียมตัวอย่างรอบคอบ ทั้งด้านสุขภาพร่างกายให้แข็งแรง ฝึกเดินและอดทนต่อสภาพอากาศ ด้านจิตใจควรศึกษาขั้นตอนการประกอบพิธีให้เข้าใจ ตั้งเจตนา (นียะฮ์) ให้บริสุทธิ์เพื่ออัลลอฮ์เพียงผู้เดียว\n\nด้านเอกสารควรเตรียมหนังสือเดินทางที่มีอายุมากกว่า 6 เดือน วีซ่าฮัจญ์ สมุดวัคซีน และเอกสารสุขภาพ พร้อมทั้งเตรียมเสื้อผ้าอิห์รอม ยาประจำตัว และของใช้จำเป็น การเตรียมตัวที่ดีจะช่วยให้การประกอบพิธีเป็นไปอย่างราบรื่นและได้รับผลบุญอย่างสมบูรณ์',
    subBlocks: [],
  },
  {
    id: 'art-umrah',
    title: 'ขั้นตอนการประกอบพิธีอุมเราะห์',
    category: 'ความรู้อุมเราะห์',
    excerpt: 'ทำความเข้าใจขั้นตอนการทำอุมเราะห์ ตั้งแต่การครองอิห์รอมจนถึงการตัดผม',
    images: ['/images/article-ihram.png'],
    date: '2 กุมภาพันธ์ 2568',
    content:
      'อุมเราะห์คือการเยือนบัยตุลลอฮ์เพื่อประกอบศาสนกิจ ซึ่งสามารถทำได้ตลอดทั้งปี ขั้นตอนเริ่มจากการครองอิห์รอมและตั้งเจตนา ณ จุดมีก็อต ตามด้วยการเฏาะวาฟรอบกะอ์บะฮ์ 7 รอบ จากนั้นละหมาด 2 ร็อกอะฮ์หลังมะกอมอิบรอฮีม\n\nต่อด้วยการสะแอระหว่างเนินเขาซอฟาและมัรวะฮ์ 7 เที่ยว และสิ้นสุดด้วยการตัดผม (ตะฮัลลุล) เป็นอันเสร็จสิ้นพิธี ผู้แสวงบุญควรรักษาความสำรวมและระลึกถึงอัลลอฮ์ตลอดการประกอบพิธี',
    subBlocks: [],
  },
  {
    id: 'art-health',
    title: 'ดูแลสุขภาพระหว่างพำนักที่ซาอุดีอาระเบีย',
    category: 'สุขภาพ',
    excerpt: 'เคล็ดลับการดูแลสุขภาพในสภาพอากาศร้อนแห้งเพื่อให้พร้อมตลอดการเดินทาง',
    images: ['/images/article-health.png'],
    date: '20 กุมภาพันธ์ 2568',
    content:
      'สภาพอากาศที่มักกะฮ์และมะดีนะฮ์มักร้อนและแห้ง ผู้แสวงบุญควรดื่มน้ำให้เพียงพอ พกน้ำดื่มติดตัวเสมอ หลีกเลี่ยงแสงแดดจัดในช่วงกลางวัน สวมหมวกหรือใช้ร่ม และพักผ่อนให้เพียงพอ\n\nควรพกยาประจำตัวและยาสามัญ เช่น ยาแก้ปวด ยาแก้แพ้ และครีมกันแดด ล้างมือบ่อยๆ เพื่อป้องกันการติดเชื้อในสถานที่ที่มีผู้คนหนาแน่น หากมีอาการผิดปกติควรแจ้งทีมงานหรือแซะหฺทันที',
    subBlocks: [],
  },
]

export const defaultRegistrations: Registration[] = [
  {
    id: 'reg-1',
    name: 'อับดุลเลาะห์ หมัดหลี',
    phone: '081-234-5678',
    email: 'abdullah@example.com',
    pax: 2,
    packageName: 'ฮัจญ์ VIP พรีเมียม 2568',
    type: 'hajj',
    note: 'ขอห้องพักติดกัน',
    status: 'confirmed',
    createdAt: '2568-01-10',
  },
  {
    id: 'reg-2',
    name: 'ฟาติมะฮ์ ยูโซ๊ะ',
    phone: '089-876-5432',
    email: 'fatimah@example.com',
    pax: 4,
    packageName: 'อุมเราะห์ รอมฎอน สุดพิเศษ',
    type: 'umrah',
    note: 'เดินทางพร้อมครอบครัว',
    status: 'contacted',
    createdAt: '2568-02-05',
  },
  {
    id: 'reg-3',
    name: 'มูฮัมหมัด สาและ',
    phone: '086-111-2222',
    email: 'muhammad@example.com',
    pax: 1,
    packageName: 'อุมเราะห์ ประหยัด เดินทางสบาย',
    type: 'umrah',
    note: '',
    status: 'pending',
    createdAt: '2568-02-18',
  },
]

/** ดึง YouTube video ID จาก URL หรือคืนค่าถ้าเป็น ID อยู่แล้ว */
export function extractYoutubeId(input: string): string {
  if (!input) return ''
  const trimmed = input.trim()
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
  ]
  for (const p of patterns) {
    const m = trimmed.match(p)
    if (m) return m[1]
  }
  return trimmed
}

export function youtubeEmbedUrl(
  input: string,
  muted: boolean,
  options?: { controls?: boolean },
): string {
  const id = extractYoutubeId(input)
  if (!id) return ''
  const params = new URLSearchParams({
    autoplay: '1',
    mute: muted ? '1' : '0',
    loop: '1',
    playlist: id,
    controls: options?.controls ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
    fs: '0',
    iv_load_policy: '3',
    cc_load_policy: '0',
  })
  if (typeof window !== 'undefined' && window.location?.origin) {
    params.set('origin', window.location.origin)
  }
  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}
export const COMPANY_LOGO = 'https://ibb.co/4g4HQnx0'

/** ช่วย migrate ข้อมูลเก่า */
export function normalizePackage(p: Partial<Package> & { image?: string }): Package {
  const images =
    p.images && p.images.length > 0
      ? p.images
      : p.image
        ? [p.image]
        : ['/images/grand-mosque.png']
  return {
    id: p.id || `pkg-${Date.now()}`,
    type: p.type || 'hajj',
    name: p.name || '',
    price: p.price || '',
    duration: p.duration || '',
    hotel: p.hotel || '',
    distance: p.distance || '',
    images,
    highlights: p.highlights || [],
    featured: p.featured,
    subBlocks: p.subBlocks || [],
  }
}

export function normalizeArticle(a: Partial<Article> & { image?: string }): Article {
  const images =
    a.images && a.images.length > 0
      ? a.images
      : a.image
        ? [a.image]
        : ['/images/grand-mosque.png']
  return {
    id: a.id || `art-${Date.now()}`,
    title: a.title || '',
    category: a.category || 'ความรู้ทั่วไป',
    excerpt: a.excerpt || '',
    images,
    date: a.date || '',
    content: a.content || '',
    subBlocks: a.subBlocks || [],
  }
}
