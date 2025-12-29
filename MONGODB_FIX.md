# 🗄️ Complete MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account (2 minutes)

1. **Open browser** and go to: https://www.mongodb.com/cloud/atlas/register
2. **Sign up** using:
   - Email + Password, OR
   - Google account, OR
   - GitHub account
3. Click **"Create an account"**
4. Check your email and **verify** your account

---

## Step 2: Create Free Cluster (3 minutes)

1. After login, you'll see **"Welcome to Atlas"** page
2. Click green button **"+ Create"** or **"Build a Database"**
3. Choose deployment type:
   - Select **"M0 FREE"** (says "Shared" or "FREE")
   - This gives you 512MB free storage
4. **Choose Cloud Provider & Region:**
   - Provider: **AWS** (recommended)
   - Region: Pick closest to you:
     - USA: **us-east-1 (N. Virginia)**
     - Europe: **eu-west-1 (Ireland)**
     - Asia: **ap-south-1 (Mumbai)**
5. **Cluster Name:** Keep default **"Cluster0"** or name it **"userManagement"**
6. Click **"Create Cluster"** button (bottom right)
7. Wait 1-3 minutes for cluster creation ⏳

---

## Step 3: Create Database User (1 minute)

While cluster is creating:

1. You'll see **"Security Quickstart"** popup or:
   - Click **"Database Access"** in left sidebar
2. Click **"+ ADD NEW DATABASE USER"**
3. Fill in:
   ```
   Authentication Method: Password
   Username: amith-018
   Password: 1234567890
   ```
   (Or click **"Autogenerate Secure Password"** and copy it)
4. **Database User Privileges:**
   - Select: **"Read and write to any database"**
5. Click **"Add User"** button

---

## Step 4: Allow Network Access (1 minute)

1. Click **"Network Access"** in left sidebar (under SECURITY)
2. Click **"+ ADD IP ADDRESS"**
3. Choose one option:
   
   **Option A: Allow from anywhere (for development)**
   - Click **"ALLOW ACCESS FROM ANYWHERE"**
   - IP Address will show: `0.0.0.0/0`
   - Comment: "Development access"
   - Click **"Confirm"**
   
   **Option B: Add your current IP (more secure)**
   - Click **"ADD CURRENT IP ADDRESS"**
   - Your IP will be auto-filled
   - Click **"Confirm"**

---

## Step 5: Get Connection String (2 minutes)

1. Click **"Database"** in left sidebar (under DEPLOYMENT)
2. Wait until cluster status shows **"Active"** (green dot)
3. Click **"Connect"** button next to your cluster name
4. Choose **"Connect your application"**
5. Make sure selected:
   - Driver: **Node.js**
   - Version: **5.5 or later**
6. **Copy the connection string** - looks like:
   ```
   mongodb+srv://amith-018:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
7. **IMPORTANT MODIFICATIONS:**
   - Replace `<password>` with your actual password: `1234567890`
   - Add database name `/userManagement` before `?`
   
   **Final format should be:**
   ```
   mongodb+srv://amith-018:1234567890@cluster0.abc123.mongodb.net/userManagement?retryWrites=true&w=majority
   ```

---

## Step 6: Update Your .env File

1. **Open file:** `backend\.env` in VS Code
2. **Find line:** `MONGODB_URI=...`
3. **Replace with your connection string from Step 5**

**Example:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://amith-018:1234567890@cluster0.abc123.mongodb.net/userManagement?retryWrites=true&w=majority
JWT_SECRET=purple_merit_super_secret_jwt_key_2024_production_12345678
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. **Save the file** (Ctrl + S)

---

## Step 7: Test Connection

Open **PowerShell** in VS Code and run:

```powershell
cd backend
node createAdmin.js
```

**✅ Success looks like:**
```
✅ Connected to MongoDB
✅ Admin user created successfully
Email: admin@example.com
Password: admin123
```

**❌ If you see errors:**

**Error: "MongoServerError: bad auth"**
→ Wrong password. Go back to Step 3 and reset user password

**Error: "querySrv ENOTFOUND"**
→ Wrong cluster URL. Go back to Step 5 and copy correct URL

**Error: "MongoServerError: user is not allowed"**
→ Go to Step 4 and allow network access

---

## Step 8: Start Your Application

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend (NEW terminal):**
```powershell
cd frontend
npm run dev
```

**Open browser:** http://localhost:5173

**Login with:**
- Email: `admin@example.com`
- Password: `admin123`

---

## 🎯 Quick Checklist

Before running the app, verify:

- [ ] MongoDB Atlas cluster is **ACTIVE** (green dot)
- [ ] Database user created with username: `amith-018`
- [ ] Network access allows `0.0.0.0/0` or your IP
- [ ] Connection string copied from Atlas dashboard
- [ ] `backend\.env` updated with correct MONGODB_URI
- [ ] Password in connection string is NOT `<password>` placeholder
- [ ] Database name `/userManagement` is in connection string
- [ ] File saved (Ctrl + S)

---

## 📸 Visual Guide

**What to look for in MongoDB Atlas:**

1. **Dashboard → Database:**
   - Should see cluster name (Cluster0)
   - Status: Active ✅
   - Connect button visible

2. **Database Access:**
   - User: amith-018
   - Role: readWrite@admin

3. **Network Access:**
   - IP: 0.0.0.0/0 (Comment: Anywhere)
   - Status: Active

---

## 🔄 Alternative: Use MongoDB Compass (GUI)

If you prefer visual database management:

1. Download **MongoDB Compass**: https://www.mongodb.com/try/download/compass
2. Install and open Compass
3. Use same connection string from Step 5
4. Click **"Connect"**
5. You'll see databases visually

---

## ❓ Common Questions

**Q: Do I need to pay for MongoDB Atlas?**
A: No! M0 FREE tier gives 512MB forever free.

**Q: Can I use local MongoDB instead?**
A: Yes! Install from https://www.mongodb.com/try/download/community
Then update .env: `MONGODB_URI=mongodb://localhost:27017/userManagement`

**Q: Where do I find my cluster URL?**
A: MongoDB Atlas → Database → Click "Connect" → Drivers → Copy string

**Q: What if I forgot my password?**
A: MongoDB Atlas → Database Access → Edit user → Reset password

---

## 🎉 You're Done!

Once `node createAdmin.js` shows success, your database is ready!

Continue with:
```powershell
npm run dev
```

Check the complete project guide in: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
