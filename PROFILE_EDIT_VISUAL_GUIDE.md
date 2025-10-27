# Profile Edit Page - Visual Structure

## Form Layout

```
┌─────────────────────────────────────────┐
│  EDIT PROFILE PAGE                      │
│  ← Back to Profile | Save Changes       │
├─────────────────────────────────────────┤
│                                         │
│  ✓ Profile updated successfully!        │ ← Success message
│                                         │
├─────────────────────────────────────────┤
│  📸 PROFILE PICTURE                     │
│  ┌────────┐                             │
│  │ Avatar │  Upload a new profile pic   │
│  │  Image │  Recommended: 400x400       │
│  │        │  [Choose File] (disabled)   │
│  └────────┘                             │
├─────────────────────────────────────────┤
│  👤 BASIC INFORMATION                   │
│  ┌───────────────────┬─────────────────┐│
│  │ Username:         │ email:          ││
│  │ [Input]           │ [Input]         ││
│  └───────────────────┴─────────────────┘│
│  ┌───────────────────┬─────────────────┐│
│  │ Birthday:         │ Location:       ││
│  │ [Date Picker]     │ [Input]         ││
│  └───────────────────┴─────────────────┘│
│  Website:                               │
│  [URL Input]                            │
│  Bio:                                   │
│  [Text Area - 4 rows] (0/500 chars)     │
├─────────────────────────────────────────┤
│  ⚙️  PREFERENCES (NEW)                  │
│  ┌───────────────────┬─────────────────┐│
│  │ Title Language:   │ Video Language: ││
│  │ [English ▼]       │ [Subtitled ▼]   ││
│  └───────────────────┴─────────────────┘│
│  ┌───────────────────┬─────────────────┐│
│  │ Skip Duration:    │ Bookmarks/Page: ││
│  │ [10 seconds]      │ [25 per page ▼] ││
│  └───────────────────┴─────────────────┘│
│  ☑ Hide Bookmarks                       │
│  ☑ Hide Profile Activities              │
├─────────────────────────────────────────┤
│  🔗 SOCIAL LINKS                        │
│  Twitter:   [Input - username]          │
│  GitHub:    [Input - username]          │
│  Instagram: [Input - username]          │
└─────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────────┐
│  Component Load  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  Check access_token      │
│  in localStorage         │
└────────┬─────────────────┘
         │
         ├─ No token ──────────────────────┐
         │                                  ▼
         │                           Error: "Please log in"
         │
         └─ Token found ───────────────────┐
                                           ▼
                          ┌────────────────────────────┐
                          │ Call API                   │
                          │ pageApi.getProfilePageData │
                          │ (token)                    │
                          └────────┬───────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
              ✓ Success                    ✗ Error
                    │                             │
                    ▼                             ▼
            ┌──────────────┐          Error: "Failed to load
            │ Map Response │          profile data"
            │ to Form      │
            └──────┬───────┘
                   ▼
         ┌─────────────────────┐
         │ Display Form with   │
         │ Pre-filled Data     │
         │                     │
         │ • username          │
         │ • email             │
         │ • avatar            │
         │ • preferences       │
         │ • social links      │
         └─────────────────────┘
```

## API Request/Response

### Request
```
GET /account/profile/
Authorization: Bearer {token}
Content-Type: application/json
```

### Response (200 OK)
```json
{
  "id": 1,
  "username": "testuser",
  "email": "user@example.com",
  "role": "user",
  "avatar": null,
  "notifications": [
    {
      "source": "Admin",
      "content": "Notification text",
      "created_at": "2025-10-21T13:42:41.244711+06:00",
      "is_read": false
    }
  ],
  "preferred_title_lang": "en",
  "preferred_video_lang": "sub",
  "skip_seconds": 10,
  "bookmarks_per_page": 25,
  "hide_bookmarks": false,
  "hide_profile_activities": false,
  "user": 1
}
```

## State Structure

```typescript
userData = {
  // Basic Info
  username: "testuser",
  email: "user@example.com",
  avatar: "https://avatar-url.jpg",
  bio: "User bio text",
  location: "City, Country",
  website: "https://example.com",
  joinDate: "2023-01-15",
  birthday: "1995-03-15",
  gender: "prefer-not-to-say",
  
  // Social Links
  socialLinks: {
    twitter: "username",
    github: "username",
    instagram: "username"
  },
  
  // Preferences
  preferences: {
    // Display preferences
    profileVisibility: "public",
    showEmail: false,
    showBirthday: false,
    showLocation: true,
    allowMessages: true,
    showActivity: true,
    showFavorites: true,
    showStats: true,
    
    // Anime preferences (from API)
    preferred_title_lang: "en",        // "en" or "jp"
    preferred_video_lang: "sub",       // "sub" or "dub"
    skip_seconds: 10,                  // 0-120
    bookmarks_per_page: 25,            // 10, 25, 50, 100
    hide_bookmarks: false,
    hide_profile_activities: false
  }
}
```

## Field Mapping: API → Form

| API Field | Form Field | Type | Component |
|-----------|-----------|------|-----------|
| `username` | Username | string | text input |
| `email` | Email | string | email input |
| `avatar` | Avatar | string/null | image display |
| `preferred_title_lang` | Title Language | enum | dropdown |
| `preferred_video_lang` | Video Language | enum | dropdown |
| `skip_seconds` | Skip Duration | number | number input |
| `bookmarks_per_page` | Bookmarks/Page | number | dropdown |
| `hide_bookmarks` | Hide Bookmarks | boolean | checkbox |
| `hide_profile_activities` | Hide Activities | boolean | checkbox |

## Loading States

### 1. Loading State (Initial)
```
┌─────────────────┐
│   ◌ Loading...  │  ← Spinner visible
│                 │
└─────────────────┘
```

### 2. Error State
```
┌─────────────────────────────────────────┐
│ ⚠ Failed to load profile data.          │
│   Please try again.                     │
└─────────────────────────────────────────┘
```

### 3. Success State
```
┌─────────────────────────────────────────┐
│ ✓ Profile updated successfully!         │  ← Auto-dismisses after 3s
└─────────────────────────────────────────┘
```

## Form Input Types

```
Text Input
├─ Username
├─ Email
├─ Location
└─ Website

Number Input
├─ Skip Seconds (0-120)

Date Input
└─ Birthday

Dropdown/Select
├─ Title Language
├─ Video Language
└─ Bookmarks Per Page

Checkbox
├─ Hide Bookmarks
└─ Hide Profile Activities

Text Area
└─ Bio

Image Display
└─ Avatar
```

## Responsive Breakpoints

```
Mobile (< 768px)
├─ Single column form
├─ Full width inputs
└─ Stacked preferences

Tablet (768px - 1024px)
├─ Single column form
├─ Full width inputs
└─ Stacked preferences

Desktop (> 1024px)
├─ 2-column grid for basic info
├─ 2-column grid for preferences
└─ Full width single fields
```
