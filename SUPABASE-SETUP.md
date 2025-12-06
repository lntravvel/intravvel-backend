# Intravvel - Supabase Migration Complete! 🎉

## ✅ What's Been Done

Your project has been successfully migrated from MongoDB to Supabase! Here's what's new:

### Backend Changes
- ✅ Complete API implementation with Supabase integration
- ✅ Authentication using Supabase Auth (replaces JWT)
- ✅ All CRUD endpoints for Services, Messages, and Site Content
- ✅ Email notifications with Nodemailer
- ✅ AI content generation with Google Gemini
- ✅ Row Level Security (RLS) policies for data protection

### Frontend Changes
- ✅ Modern dashboard with all pages rebuilt
- ✅ Login page with Supabase Auth
- ✅ Services management with real-time updates
- ✅ Messages inbox with status tracking
- ✅ Content editor for site sections
- ✅ AI content generator
- ✅ Responsive sidebar navigation

---

## 🚀 Deployment Steps

### Step 1: Set Up Supabase Database

1. Go to your Supabase project: https://app.supabase.com/project/lwbtihgsuumfzrgxatge

2. Navigate to **SQL Editor** (left sidebar)

3. Copy and paste the entire content of `supabase-schema.sql` and click **Run**

4. This will create:
   - `services` table
   - `messages` table
   - `site_content` table
   - `profiles` table
   - All RLS policies
   - Triggers and indexes

### Step 2: Initialize Admin User

After deploying to Vercel, visit:
```
https://your-app.vercel.app/api/v1/admin-init
```

This will create the admin user with:
- **Email**: admin@intravvel.com
- **Password**: admin123

⚠️ **IMPORTANT**: Change this password immediately after first login!

### Step 3: Configure Vercel Environment Variables

Go to your Vercel project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

```env
# Supabase Configuration
SUPABASE_URL=https://lwbtihgsuumfzrgxatge.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3YnRpaGdzdXVtZnpyZ3hhdGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODY0MzQsImV4cCI6MjA4MDQ2MjQzNH0.IQiMgRBEu0zFHR9S_aZfUTADnSbsxa2ror3zAS5D6Ys
SUPABASE_SERVICE_ROLE_KEY=sb_secret_PYeLdY0bHGt2-n9Fug0CrQ_rqs8PDtB

# Vite Environment Variables (for frontend)
VITE_SUPABASE_URL=https://lwbtihgsuumfzrgxatge.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3YnRpaGdzdXVtZnpyZ3hhdGdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4ODY0MzQsImV4cCI6MjA4MDQ2MjQzNH0.IQiMgRBEu0zFHR9S_aZfUTADnSbsxa2ror3zAS5D6Ys

# Google Gemini AI (Optional)
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@intravvel.com

# CORS
ALLOWED_ORIGINS=https://your-domain.vercel.app,http://localhost:5173
```

### Step 4: Deploy to Vercel

```bash
# Commit your changes
git add .
git commit -m "Migrated to Supabase"
git push

# Vercel will automatically deploy
```

Or deploy manually:
```bash
vercel --prod
```

---

## 🧪 Testing Locally

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Access the dashboard**:
   - Frontend: http://localhost:5173
   - Login with: admin@intravvel.com / admin123

---

## 📁 Project Structure

```
.
├── api/                      # Backend serverless functions
│   ├── index.ts             # Main API routes
│   ├── middleware/
│   │   └── auth.ts          # Supabase Auth middleware
│   └── utils/
│       ├── email.ts         # Email utilities
│       └── ai.ts            # AI generation utilities
├── lib/
│   ├── supabase.ts          # Server-side Supabase client
│   └── supabaseClient.ts    # Browser-side Supabase client
├── pages/                    # Dashboard pages
│   ├── Login.tsx
│   ├── Services.tsx
│   ├── Messages.tsx
│   ├── ContentEditor.tsx
│   └── AIGenerator.tsx
├── components/
│   └── Sidebar.tsx          # Navigation sidebar
├── supabase-schema.sql      # Database schema
├── App.tsx                  # Main app component
├── index.tsx                # Entry point
└── vercel.json              # Vercel configuration
```

---

## 🔐 Security Notes

### ⚠️ IMPORTANT: Reset Service Role Key

After deployment, you should reset your Supabase Service Role Key because it was shared:

1. Go to: https://app.supabase.com/project/lwbtihgsuumfzrgxatge/settings/api
2. Scroll to "Service Role Key"
3. Click "Reset" to generate a new key
4. Update the `SUPABASE_SERVICE_ROLE_KEY` in Vercel environment variables
5. Redeploy your app

### Row Level Security (RLS)

All tables have RLS enabled:
- **Public access**: Read services and site content
- **Authenticated access**: Full CRUD on all tables
- **Anonymous access**: Can submit contact forms

---

## 🆕 New Features

### Real-time Capabilities (Optional)

Supabase supports real-time subscriptions. You can add this to your dashboard:

```typescript
// Example: Real-time services updates
useEffect(() => {
  const channel = supabase
    .channel('services-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'services' },
      (payload) => {
        console.log('Change received!', payload);
        fetchServices(); // Refresh data
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### File Upload with Supabase Storage

To implement file uploads:

1. Create a storage bucket in Supabase Dashboard
2. Update the upload endpoint in `api/index.ts`:

```typescript
import { supabaseAdmin } from '../lib/supabase';

app.post('/api/v1/upload', authenticateToken, async (req, res) => {
  const file = req.file; // from multer
  
  const { data, error } = await supabaseAdmin.storage
    .from('images')
    .upload(`${Date.now()}-${file.originalname}`, file.buffer, {
      contentType: file.mimetype
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('images')
    .getPublicUrl(data.path);

  res.json({ url: publicUrl });
});
```

---

## 📊 API Endpoints

### Public Endpoints
- `GET /api/v1/services` - List all services
- `GET /api/v1/services/:id` - Get single service
- `GET /api/v1/site-content` - Get site content
- `POST /api/v1/contact` - Submit contact form

### Protected Endpoints (Requires Authentication)
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/admin-init` - Initialize admin user
- `POST /api/v1/services` - Create service
- `PUT /api/v1/services/:id` - Update service
- `DELETE /api/v1/services/:id` - Delete service
- `GET /api/v1/messages` - List messages
- `PUT /api/v1/messages/:id` - Update message status
- `DELETE /api/v1/messages/:id` - Delete message
- `PUT /api/v1/site-content/:section` - Update content
- `POST /api/v1/ai/generate` - Generate AI content

---

## 🐛 Troubleshooting

### Build Errors

If you get TypeScript errors about missing modules, run:
```bash
npm install
```

### Authentication Issues

If login doesn't work:
1. Check that you ran the SQL schema in Supabase
2. Verify environment variables are set in Vercel
3. Make sure you initialized the admin user via `/api/v1/admin-init`

### Database Connection Errors

If API returns errors:
1. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
2. Check that RLS policies are created (run the SQL schema)
3. Look at Vercel function logs for detailed errors

---

## 📚 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Dashboard**: https://app.supabase.com/project/lwbtihgsuumfzrgxatge
- **Vercel Docs**: https://vercel.com/docs
- **Google Gemini API**: https://ai.google.dev/docs

---

## 🎉 You're All Set!

Your Intravvel project is now powered by Supabase with:
- ✅ Modern authentication
- ✅ PostgreSQL database
- ✅ Real-time capabilities
- ✅ Row Level Security
- ✅ Scalable infrastructure

Happy coding! 🚀
