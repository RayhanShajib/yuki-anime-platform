# Profile Edit Page - API Integration

## Overview
The profile edit page (`src/app/profile/edit/page.tsx`) now loads user profile data from the API using the `getProfilePageData()` function when the page loads.

## Implementation Details

### Data Loading Flow

```
Component Mount (useEffect)
    ↓
Check localStorage for access token
    ↓
Call pageApi.getProfilePageData(token)
    ↓
Map API response to form state
    ↓
Display data in form fields
```

### API Response Structure

The profile API returns the following structure:

```typescript
{
  id: number;
  username: string;
  email: string;
  role: string;
  avatar: string | null;
  notifications: Array<{
    source: string;
    content: string;
    created_at: string;
    is_read: boolean;
  }>;
  preferred_title_lang: "en" | "jp";  // Language preference for anime titles
  preferred_video_lang: "sub" | "dub"; // Video language preference
  skip_seconds: number;                // Intro/outro skip duration
  bookmarks_per_page: number;          // Items per page in bookmarks
  hide_bookmarks: boolean;             // Hide bookmarks from profile
  hide_profile_activities: boolean;    // Hide activity from profile
  user: number;
}
```

### Mapped Form Fields

The form now includes:

#### Basic Information
- **Username** - From API `username`
- **Email** - From API `email`
- **Avatar** - From API `avatar` (with fallback to placeholder)

#### Preferences Section (NEW)
- **Preferred Title Language** - From API `preferred_title_lang`
  - Options: English, Japanese (Romaji)
- **Preferred Video Language** - From API `preferred_video_lang`
  - Options: Subtitled, Dubbed
- **Skip Intro/Outro** - From API `skip_seconds` (0-120 seconds)
- **Bookmarks Per Page** - From API `bookmarks_per_page`
  - Options: 10, 25, 50, 100
- **Hide Bookmarks** - Toggle from API `hide_bookmarks`
- **Hide Profile Activities** - Toggle from API `hide_profile_activities`

### Loading States

1. **Loading**: Shows spinner while fetching data
2. **Error**: Displays error message if fetch fails
3. **Success**: Form displays with loaded data

### Error Handling

- If no access token is found: Shows "Please log in to edit your profile"
- If API call fails: Shows "Failed to load profile data. Please try again."
- Errors are logged to console for debugging

## Usage

### For Users
1. Navigate to the Edit Profile page
2. Page automatically loads profile data from API
3. Users can modify their preferences
4. Click "Save Changes" to persist updates

### For Developers

#### Current Functionality
- Profile data loads automatically on component mount
- Form fields are pre-populated with API data
- Type-safe state management with TypeScript

#### Extending the Form
To add new fields:

1. Add to `defaultUserData`:
```typescript
const defaultUserData = {
  // ... existing fields
  newField: defaultValue,
};
```

2. Map API response in `loadProfileData`:
```typescript
setUserData((prev) => ({
  ...prev,
  newField: profileData.newField || defaultValue,
}));
```

3. Add form field in JSX:
```tsx
<div>
  <label>New Field Label</label>
  <input
    value={userData.newField}
    onChange={(e) => handleInputChange("newField", e.target.value)}
  />
</div>
```

## State Management

### Form State Structure
```typescript
{
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  birthday: string;
  gender: string;
  socialLinks: {
    twitter: string;
    github: string;
    instagram: string;
  };
  preferences: {
    profileVisibility: string;
    showEmail: boolean;
    showBirthday: boolean;
    showLocation: boolean;
    allowMessages: boolean;
    showActivity: boolean;
    showFavorites: boolean;
    showStats: boolean;
    preferred_title_lang: "en" | "jp";
    preferred_video_lang: "sub" | "dub";
    skip_seconds: number;
    bookmarks_per_page: number;
    hide_bookmarks: boolean;
    hide_profile_activities: boolean;
  };
}
```

## Next Steps

To complete the implementation:

1. **Save Functionality**
   - Update `handleSave()` to send modified data back to API
   - Add POST/PUT request to update preferences endpoint

2. **Avatar Upload**
   - Implement file upload for avatar change
   - Add preview before upload

3. **Password Change**
   - Connect password change modal to API endpoint
   - Add password validation on backend

4. **Form Validation**
   - Add client-side validation for email format
   - Validate preference values

5. **Success/Error Messages**
   - Show specific error messages from API
   - Display success confirmation with saved data

## API Endpoint

- **Function**: `pageApi.getProfilePageData(token)`
- **Endpoint**: `GET /account/profile/`
- **Auth**: Requires Bearer token in Authorization header
- **Cache**: Not cached (revalidate: 0) for security

## Console Logging

The page logs loaded profile data to console for debugging:
```
Profile data loaded: {...}
```

## Files Modified

- `src/app/profile/edit/page.tsx` - Added API integration and preferences section
