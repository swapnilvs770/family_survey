# 🚀 Quick Start Guide - Family Survey System

## ⚡ Fast Setup (5 Minutes)

### Step 1: Install MySQL (if not installed)
Download and install MySQL from: https://dev.mysql.com/downloads/mysql/

### Step 2: Create Database
Open MySQL command line or MySQL Workbench and run:
```sql
CREATE DATABASE family_survey_db;
```

Or simply import the provided SQL file:
```bash
mysql -u root -p < database_setup.sql
```

### Step 3: Configure Backend
Navigate to backend folder and create/edit `.env` file:
```bash
cd backend
```

Edit `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=family_survey_db
```

### Step 4: Install Backend Dependencies
```bash
npm install
```

### Step 5: Start Backend Server
```bash
npm start
```

You should see:
```
✅ Database connected successfully
✅ Table "family_members" created/verified successfully
✅ Sample data inserted successfully
🚀 Server running on port 5000
```

### Step 6: Install Frontend Dependencies
Open a NEW terminal window:
```bash
cd frontend
npm install
```

### Step 7: Start Frontend
```bash
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 8: Access Application
Open your browser and go to:
```
http://localhost:3000
```

## ✅ Verify Installation

1. **Dashboard** should show statistics
2. **Add Record** form should be functional
3. **View Records** should display 25 sample records
4. **Families** should show 5 families

## 🎯 Test Features

### Add a New Member
1. Click "Add Record" in sidebar
2. Fill the form:
   - Family ID: 6
   - Name: तुमचं नाव
   - Gender: Male/Female
   - Relation: प्रमुख
   - DOB: Select date
3. Click "Save Record"

### Filter Records
1. Go to "View Records"
2. Try quick filters:
   - Click "Infants (0-1)" - shows babies
   - Click "Children (0-5)" - shows young children
   - Click "Girls (10-18)" - shows teenage girls
3. Use custom filters:
   - Set Age Min: 18, Age Max: 60
   - Gender: Male
   - Click apply

### Export PDF
1. Apply some filters
2. Click "Export PDF" button
3. PDF will download automatically

### View Families
1. Click "Families" in sidebar
2. Click on any family to expand
3. See all members in that family
4. Export family-wise PDF

## 🔧 Common Issues

### MySQL Connection Failed
**Error:** `Database connection failed`
**Solution:** 
- Check MySQL is running: `sudo service mysql status` (Linux) or check Task Manager (Windows)
- Verify credentials in `.env` file
- Test connection: `mysql -u root -p`

### Port Already in Use
**Error:** `Port 5000 is already in use`
**Solution:** 
- Change port in `backend/.env`: `PORT=5001`
- Update API URL in `frontend/src/services/api.js`

### Frontend Not Loading
**Error:** Blank page or errors in console
**Solution:**
- Check backend is running: `http://localhost:5000/api/health`
- Clear browser cache
- Check console for errors (F12)

## 📊 Default Data

The system comes with 25 sample records:
- 5 Families (IDs: 1-5)
- Different age groups (0-60 years)
- Both genders
- Various relations

## 🎨 Features to Try

✅ Auto-age calculation from DOB
✅ Real-time filtering
✅ Family grouping
✅ PDF export with custom filters
✅ Smooth animations
✅ Responsive design (try on mobile)
✅ Pagination (works with 200+ records)

## 📞 Need Help?

1. Check backend terminal for errors
2. Check frontend terminal for errors
3. Open browser console (F12) for frontend errors
4. Verify MySQL is running and accessible

## 🎉 You're Ready!

Your Family Survey Management System is now running!

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

Enjoy managing family survey data! 🚀
