# Napalen Travel Website

เว็บไซต์ฮัจญ์–อุมเราะห์ สำหรับ หจก. นาปาเลน แทรเวิล แอนด์ ทัวร์

## Deploy บน Vercel

1. อัปโหลดโฟลเดอร์นี้ไปที่ GitHub หรือใช้ Vercel CLI
2. Import project บน [vercel.com](https://vercel.com) → Framework: **Next.js**
3. Deploy (ไม่ต้องตั้ง Environment Variables)

```bash
# หรือใช้ CLI
npm i -g vercel
vercel
```

## รันในเครื่อง

```bash
pnpm install   # หรือ npm install
pnpm dev       # หรือ npm run dev
```

เปิด http://localhost:3000

## ระบบแอดมิน

- เข้าเมนู **Admin** (หรือ path ตาม nav)
- Username: `napalen` / Password: `1234`

### สิ่งที่แก้ได้ในแอดมิน

| แท็บ | รายละเอียด |
|------|------------|
| สถิติแดชบอร์ด | จำนวนผู้ไปอุมเราะห์ / ฮัจญ์ / รวม |
| วิดีโอหน้าปก | ลิงก์ YouTube (เล่นวน + ปุ่มเปิด/ปิดเสียง) |
| แกลเลอรี / สไลด์ | อัปโหลดภาพหลายภาพ → สไลด์หน้าแรก |
| แพ็กเกจ | อัปโหลดหลายภาพ + บล็อกย่อยพร้อมภาพ |
| คลังความรู้ | อัปโหลดหลายภาพ + บล็อกย่อยพร้อมภาพ |
| ความประทับใจ | รูป + ข้อความผู้แสวงบุญ |
| เบอร์ติดต่อ | ชื่อ / ตำแหน่ง / เบอร์ |
| ข้อมูลบริษัท | ชื่อ ที่อยู่ แผนที่ ไลน์ ฯลฯ |

**หมายเหตุ:** รูปที่อัปโหลดเก็บเป็น base64 ใน localStorage ของเบราว์เซอร์ (ไม่มี backend)  
ถ้าต้องการเก็บถาวรข้ามเครื่อง แนะนำเชื่อม Blob Storage / CMS ภายหลัง

## Tech

- Next.js 16 + React 19 + Tailwind CSS 4
- Client-side store (localStorage)
