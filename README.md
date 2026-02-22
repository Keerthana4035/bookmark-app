# 🔖 Smart Bookmark App

A simple and real-time bookmark manager built using **Next.js**, **Supabase**, and deployed on **Vercel**.

## 🚀 Live Demo

🌐 https://bookmark-app-ykdv.vercel.app/

---

## ✨ Features

- ➕ Add new bookmarks
- 🗑️ Delete bookmarks
- 🔄 Real-time updates using Supabase
- ⚡ Fast and responsive UI
- ☁️ Deployed on Vercel

---

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- React
- Supabase (Database + Realtime)
- Vercel (Deployment)

---

## 📂 Project Structure

```
smart-bookmark-app/
│
├── app/
│   └── page.tsx
│
├── lib/
│   └── supabaseClient.ts
│
├── .env.local
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Keerthana4035/bookmark-app.git
cd bookmark-app
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env.local` file and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4️⃣ Run the development server

```bash
npm run dev
```

Open: http://localhost:3000

---

## 🗄️ Supabase Table Structure

Create a table named **bookmarks**:

| Column | Type |
|--------|------|
| id     | int8 (Primary Key, Auto Increment) |
| url    | text |

Enable **Realtime** for the table.

---

## 📦 Deployment

This project is deployed using:

- GitHub (Version Control)
- Vercel (Hosting)

Every push to the `main` branch automatically triggers deployment.

---

## 📸 Preview

Smart Bookmark App UI with add and delete functionality.

---

## 👩‍💻 Author

Keerthana

---

## 📜 License

This project is for learning and practice purposes.