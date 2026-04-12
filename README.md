# कुटुंब सर्वे डेटा व्यवस्थापन प्रणाली
# Family Survey Data Management System

A premium full-stack web application for managing family survey records with advanced filtering, PDF export, and a beautiful black + gold themed UI.

## 🌟 Features

### Backend (Node.js + Express + MySQL)
- ✅ RESTful API with Express.js
- ✅ MySQL database with optimized schema
- ✅ Auto-calculate age from DOB
- ✅ Advanced filtering (age range, gender, relation)
- ✅ Family-wise grouping
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Statistics and analytics
- ✅ Sample data pre-loaded

### Frontend (React + Tailwind + Framer Motion)
- ✅ Premium black + gold themed UI
- ✅ Smooth animations with Framer Motion
- ✅ Responsive design (mobile-friendly)
- ✅ Dashboard with statistics
- ✅ Add/Edit/Delete family members
- ✅ Advanced filtering system
- ✅ Family-wise grouping view
- ✅ Search functionality
- ✅ Pagination (200+ families supported)
- ✅ PDF export with custom formatting
- ✅ Marathi language support

### Advanced Filtering
- 🔍 Age range filters (0-1, 0-5, 10-18, custom)
- 🔍 Gender filters (Male/Female)
- 🔍 Relation filters
- 🔍 Search by name or family ID
- 🔍 Combine multiple filters
- 🔍 Quick filter presets

## 📁 Project Structure

```
family-survey-system/
├── backend/
│   ├── config/
│   │   ├── database.js          # MySQL connection
│   │   └── initDb.js            # Database initialization
│   ├── routes/
│   │   └── members.js           # API routes
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env                     # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx      # Navigation sidebar
    │   │   └── StatCard.jsx     # Statistics card
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Main dashboard
    │   │   ├── AddRecord.jsx    # Add new member
    │   │   ├── ViewRecords.jsx  # View/filter records
    │   │   └── Families.jsx     # Family-wise view
    │   ├── services/
    │   │   └── api.js           # API service
    │   ├── utils/
    │   │   └── pdfExport.js     # PDF export utility
    │   ├── App.jsx              # Main app component
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Step 1: Clone/Download the Project
```bash
cd family-survey-system
```

### Step 2: Setup MySQL Database

1. Start MySQL server
2. Create database:
```sql
CREATE DATABASE family_survey_db;
```

3. Update database credentials in `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=family_survey_db
```

### Step 3: Setup Backend

```bash
cd backend
npm install
npm start
```

The server will run on `http://localhost:5000`

### Step 4: Setup Frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:3000`

## 📊 Database Schema

```sql
CREATE TABLE family_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  family_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender ENUM('Male', 'Female') NOT NULL,
  relation VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_family_id (family_id),
  INDEX idx_age (age),
  INDEX idx_gender (gender)
);
```

## 🔌 API Endpoints

### Members
- `GET /api/members` - Get all members
- `GET /api/members/filter?ageMin=0&ageMax=5&gender=Female` - Filter members
- `GET /api/families` - Get family-wise grouped data
- `GET /api/members/:id` - Get single member
- `POST /api/members` - Add new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Statistics
- `GET /api/members/stats/overview` - Get statistics

### Example API Request
```javascript
// Add new member
POST /api/members
Content-Type: application/json

{
  "family_id": 1,
  "name": "अमित पाटील",
  "gender": "Male",
  "relation": "मुलगा",
  "dob": "2010-05-15"
}
```

## 🎨 UI Features

### Navigation
- Dashboard (मुख्यपृष्ठ)
- Add Record (नोंदणी)
- View Records (नोंदी)
- Families (कुटुंबे)

### Dashboard Statistics
- Total Families
- Total Members
- Male/Female Count
- Children Count (≤18 years)
- Infants Count (≤1 year)

### Filtering Options
**Quick Filters:**
- All
- Infants (0-1)
- Children (0-5)
- Girls (10-18)
- Males
- Females

**Custom Filters:**
- Age range (Min/Max)
- Gender selection
- Name/Family ID search

## 📄 PDF Export

Export filtered data or family-wise reports to PDF with:
- Professional table formatting
- Gold & black theme
- Applied filters information
- Page numbers
- Generation timestamp

## 🎯 Sample Data

The system includes 25 pre-loaded sample records across 5 families:
- Family 1: पाटील (5 members)
- Family 2: देशमुख (5 members)
- Family 3: शिंदे (5 members)
- Family 4: कांबळे (5 members)
- Family 5: जाधव (5 members)

## 🔧 Configuration

### Backend Port
Edit `backend/.env`:
```env
PORT=5000
```

### Frontend Port
Edit `frontend/vite.config.js`:
```javascript
server: {
  port: 3000
}
```

### API Base URL
Edit `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🌐 Features for Non-Technical Users

- ✅ Simple, intuitive interface
- ✅ Clear navigation with icons
- ✅ Bilingual labels (English + Marathi)
- ✅ Form validation
- ✅ Success/Error messages
- ✅ Responsive design for tablets/phones
- ✅ One-click PDF export
- ✅ No complex settings

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Accent**: Gold (#FFD700, #FFC107, #FFA000)
- **Background**: Gray gradients
- **Text**: White/Light gray

### Typography
- **English**: Inter
- **Marathi**: Noto Sans Devanagari

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Future Enhancements (Optional)

- [ ] Admin authentication
- [ ] Bulk CSV/Excel import
- [ ] Advanced analytics charts
- [ ] Export to Excel
- [ ] Multi-language support
- [ ] Role-based access control
- [ ] Data backup/restore

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials in `.env`
- Ensure port 5000 is not in use

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check API_BASE_URL in `frontend/src/services/api.js`
- Check browser console for CORS errors

### Database errors
- Ensure MySQL server is running
- Check database exists: `SHOW DATABASES;`
- Verify user permissions

## 📞 Support

For issues or questions, check:
1. Console logs (F12 in browser)
2. Backend terminal output
3. MySQL error logs

## 📝 License

This project is created for family survey data management purposes.

## 👨‍💻 Tech Stack

**Backend:**
- Node.js
- Express.js
- MySQL2
- CORS
- dotenv

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- Framer Motion
- Axios
- jsPDF + jsPDF-AutoTable
- React Icons
- Vite

---

Made with ❤️ for efficient family survey management
