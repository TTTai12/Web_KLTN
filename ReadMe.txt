# 🛒 ShopAI — E-Commerce Platform with AI Chatbot (Frontend)

> A modern e-commerce web application with an integrated OpenAI-powered chatbot for real-time customer support and product recommendations.

🔗 **Live Demo:** [web-kltn.vercel.app](https://web-kltn.vercel.app)
🔗 **Backend Repository:** [github.com/TTTai12/Web_BE_KLTN](https://github.com/TTTai12/Web_BE_KLTN)

---

## 📸 Screenshots

> *(Add screenshots of your homepage, product page, and chatbot here)*

---

## ✨ Features

- 🛍️ **Product Catalog** — Browse, filter, and search products with a responsive UI
- 🛒 **Shopping Cart & Checkout** — Full cart management and checkout flow
- 🤖 **AI Chatbot** — Real-time customer support powered by OpenAI API, trained on product data
- 💬 **Smart Recommendations** — Chatbot answers product questions based on pre-loaded datasets
- 📱 **Responsive Design** — Optimized for both desktop and mobile
- 🔐 **User Authentication** — Login, register, and session management

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React.js |
| Styling | CSS3, SCSS, Ant Design |
| HTTP Client | Axios |
| State Management | React Context / useState |
| Build Tool | Vite |
| Deployment | Vercel |

---

## 📁 Project Structure

```
Web_KLTN/
├── public/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components
│   ├── services/        # API call logic
│   ├── context/         # Global state management
│   └── assets/          # Images, icons
├── DemoCode-Backend/    # Local backend demo (see Web_BE_KLTN for full backend)
├── .env
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn
- Backend server running (see [Web_BE_KLTN](https://github.com/TTTai12/Web_BE_KLTN))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/TTTai12/Web_KLTN.git
cd Web_KLTN

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your API URL and OpenAI key
```

### Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_OPENAI_API_KEY=your_openai_key_here
```

### Running the App

```bash
# Start the backend first (in a separate terminal)
cd DemoCode-Backend
npm install
npm start

# Then start the frontend
npm start
```

App runs at `http://localhost:3000`

---

## 🤖 AI Chatbot

The chatbot is integrated via the OpenAI API and uses pre-loaded product data as context. It can:

- Answer questions about products (specs, pricing, availability)
- Guide users through the shopping process
- Provide personalized product recommendations

---

## 👤 Author

**Nguyễn Tất Thành** — [github.com/TTTai12](https://github.com/TTTai12)

> *Capstone project — Nov 2024 to Apr 2025*
