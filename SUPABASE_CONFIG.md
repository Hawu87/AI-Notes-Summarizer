# Supabase Configuration Guide

## Production Domain
**Your Vercel App URL:** `https://ai-notes-summarizer-alpha.vercel.app/`

---

## Required Updates

### 1. Vercel Environment Variables

Add the following environment variable in your Vercel project settings:

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project: `ai-note-summarizer`
3. Go to **Settings** → **Environment Variables**
4. Add/Update the following variable:

```
Name: NEXT_PUBLIC_SITE_URL
Value: https://ai-notes-summarizer-alpha.vercel.app
```

**Important:** Make sure to add this to **Production**, **Preview**, and **Development** environments.

After adding, **redeploy your application** for the changes to take effect.

---

### 2. Supabase Dashboard Configuration

Go to your Supabase Dashboard and update the authentication settings:

1. **Navigate to:** Authentication → URL Configuration
   - URL: https://app.supabase.com/project/YOUR_PROJECT_ID/auth/url-configuration
   - (Replace `YOUR_PROJECT_ID` with your actual Supabase project ID)

2. **Update Site URL:**
   ```
   https://ai-notes-summarizer-alpha.vercel.app
   ```

3. **Update Redirect URLs:** Add the following URLs (one per line):
   ```
   https://ai-notes-summarizer-alpha.vercel.app/login
   https://ai-notes-summarizer-alpha.vercel.app/auth/callback
   ```

4. **Remove localhost URLs (Recommended):**
   - Remove any entries containing `localhost` or `127.0.0.1`
   - This ensures users never see localhost in verification links

5. **Save the changes**

---

## Verification Checklist

After making the updates:

- [ ] `NEXT_PUBLIC_SITE_URL` is set in Vercel environment variables
- [ ] Vercel deployment has been triggered after adding the environment variable
- [ ] Supabase Site URL is set to: `https://ai-notes-summarizer-alpha.vercel.app`
- [ ] Supabase Redirect URLs include:
  - `https://ai-notes-summarizer-alpha.vercel.app/login`
  - `https://ai-notes-summarizer-alpha.vercel.app/auth/callback`
- [ ] Localhost URLs have been removed from Supabase Redirect URLs

---

## Testing the Configuration

1. **Test Signup:**
   - Go to: https://ai-notes-summarizer-alpha.vercel.app/signup
   - Create a new account
   - Check your email for verification link
   - **Verify:** The email link should point to `https://ai-notes-summarizer-alpha.vercel.app/login?code=...`
   - **Verify:** No localhost URLs should appear

2. **Test Email Verification:**
   - Click the verification link in your email
   - **Verify:** You should be redirected to `/login`
   - **Verify:** If code exchange succeeds, you should be redirected to `/dashboard`
   - **Verify:** If already authenticated, login should redirect to `/dashboard`

---

## Important Notes

- The code changes have already been made to your application
- You only need to update:
  1. Vercel environment variables
  2. Supabase Dashboard URL configuration
- After updating, trigger a new deployment in Vercel to ensure the environment variable is picked up
- The application will throw an error if `NEXT_PUBLIC_SITE_URL` is missing, preventing any localhost redirects

