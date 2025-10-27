# Implementation Quick Reference

## What Was Implemented

### ✅ Completed
1. **API Integration** - Profile data loads automatically on page load
2. **Loading State** - Shows spinner while fetching
3. **Error Handling** - Displays error messages if API call fails
4. **Auth Check** - Verifies user is logged in before loading
5. **Data Mapping** - API fields mapped to form state
6. **Preferences Section** - New form section with 6 preference fields
7. **Type Safety** - Full TypeScript support

### Form Fields
**Basic Information**
- Username
- Email
- Avatar (display only)
- Bio
- Location
- Website
- Birthday
- Social Links (Twitter, GitHub, Instagram)

**Preferences (NEW)**
- Preferred Title Language
- Preferred Video Language
- Skip Intro/Outro Duration
- Bookmarks Per Page
- Hide Bookmarks Toggle
- Hide Profile Activities Toggle

## Code Changes Made

### `src/app/profile/edit/page.tsx`

**Imports Added:**
```typescript
import { pageApi } from "@/lib/api/pageApi";
import { useEffect } from "react"; // Added
```

**State Added:**
```typescript
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**useEffect Hook Added:**
```typescript
useEffect(() => {
  const loadProfileData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Please log in to edit your profile");
        return;
      }
      const profileData = await pageApi.getProfilePageData(token);
      // Map API response to form state
      setUserData((prev) => ({
        ...prev,
        username: profileData.username || "",
        email: profileData.email || "",
        // ... other fields
        preferences: {
          ...prev.preferences,
          preferred_title_lang: profileData.preferred_title_lang || "en",
          preferred_video_lang: profileData.preferred_video_lang || "sub",
          skip_seconds: profileData.skip_seconds || 10,
          bookmarks_per_page: profileData.bookmarks_per_page || 25,
          hide_bookmarks: profileData.hide_bookmarks || false,
          hide_profile_activities: profileData.hide_profile_activities || false,
        },
      }));
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  loadProfileData();
}, []);
```

**Updated handleInputChange:**
```typescript
const handleInputChange = (
  field: string,
  value: string | boolean | number,  // Added number type
  category?: string
) => {
  // ... implementation
};
```

**UI Changes:**
- Added loading spinner while `isLoading === true`
- Added error message display when error exists
- Wrapped form with loading check: `{!isLoading && (...)}`
- Added Preferences section with new fields

## API Integration

**API Function Used:**
```typescript
pageApi.getProfilePageData(token)
```

**Endpoint:**
```
GET /account/profile/
Authorization: Bearer {token}
```

**Response Fields Used:**
```typescript
{
  username: string;
  email: string;
  avatar: string | null;
  preferred_title_lang: "en" | "jp";
  preferred_video_lang: "sub" | "dub";
  skip_seconds: number;
  bookmarks_per_page: number;
  hide_bookmarks: boolean;
  hide_profile_activities: boolean;
}
```

## Usage in Components

### Basic Usage
```typescript
import { pageApi } from "@/lib/api/pageApi";

// Get profile data
const profileData = await pageApi.getProfilePageData(token);
```

### With Error Handling
```typescript
try {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No token");
  const data = await pageApi.getProfilePageData(token);
  // Process data
} catch (error) {
  console.error("Error:", error);
  // Show error to user
}
```

## Next Steps to Complete

### 1. Save Profile Updates
```typescript
// Add this function to pageApi
updateProfilePageData: async (token: string, data: Partial<UserData>) => {
  return fetchFromApi('/account/profile/', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}
```

### 2. Update Save Handler
```typescript
const handleSave = async () => {
  setIsSaving(true);
  const token = localStorage.getItem("access_token");
  
  try {
    await pageApi.updateProfilePageData(token, userData);
    setSaved(true);
  } catch (err) {
    setError("Failed to save profile. Please try again.");
  } finally {
    setIsSaving(false);
  }
};
```

### 3. Connect Avatar Upload
```typescript
const handleAvatarUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  // Upload to API
};
```

### 4. Connect Password Change
```typescript
// In password modal handler
const handlePasswordSave = async () => {
  const token = localStorage.getItem("access_token");
  // Call API to change password
  await pageApi.changePassword(token, {
    old_password: passwordData.oldPassword,
    new_password: passwordData.newPassword,
  });
};
```

## Testing Checklist

- [ ] Page loads with spinner
- [ ] Profile data appears after loading
- [ ] All API fields are displayed correctly
- [ ] Preferences section shows all options
- [ ] Form inputs are editable
- [ ] Error message shows if not logged in
- [ ] Error message shows if API fails
- [ ] Responsive design works on mobile
- [ ] Console shows "Profile data loaded" message

## Common Issues & Fixes

### Issue: "No access token found"
**Fix:** Ensure user is logged in before visiting edit page

### Issue: Profile data not loading
**Fix:** Check browser console for API errors, verify token is valid

### Issue: Form fields not updating
**Fix:** Verify API response structure matches expected fields

### Issue: Preferences not showing
**Fix:** Ensure `preferred_*` fields are in API response

## Files Created/Modified

### Created
- `PROFILE_EDIT_API_INTEGRATION.md` - Full integration documentation
- `PROFILE_EDIT_SUMMARY.md` - Implementation summary
- `PROFILE_EDIT_VISUAL_GUIDE.md` - Visual structure guide
- `Implementation Quick Reference.md` - This file

### Modified
- `src/app/profile/edit/page.tsx` - Main implementation

## Quick API Reference

```typescript
// Get profile data
const profileData = await pageApi.getProfilePageData(token);

// Response structure
{
  id: number;
  username: string;
  email: string;
  role: string;
  avatar: string | null;
  notifications: Array;
  preferred_title_lang: "en" | "jp";
  preferred_video_lang: "sub" | "dub";
  skip_seconds: number;
  bookmarks_per_page: number;
  hide_bookmarks: boolean;
  hide_profile_activities: boolean;
  user: number;
}
```

## Environment Variables

```bash
# Required for API calls
API_BASE_URL=https://serverloader1.yukiwatch.fr/api/v1
```

## Browser Storage

```typescript
// Access token stored in localStorage
localStorage.getItem('access_token')

// Language preference (already in use)
localStorage.getItem('yuki-language')  // 'en' or 'jp'
```
