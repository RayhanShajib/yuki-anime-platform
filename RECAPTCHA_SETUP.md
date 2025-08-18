# Google reCAPTCHA v3 Setup Instructions

This project## Features

### Invisible Security

- **reCAPTCHA v3**: Works invisibly in the background
- **No user interaction required**: Seamless user experience
- **Risk analysis**: Google analyzes user behavior and assigns risk scores
- **Automatic protection**: Blocks suspicious activities automatically

### Login Form Security

- reCAPTCHA v3 verification runs automatically when login is attempted
- Score-based verification (0.0 = bot, 1.0 = human)
- Prevents automated bot attacks without user friction

### Forgot Password Security

- reCAPTCHA v3 verification runs automatically when password reset is requested
- Prevents spam and abuse of password reset functionality
- Maintains user experience while providing securityle reCAPTCHA v3 for enhanced security on the login and forgot password forms. reCAPTCHA v3 is invisible and works in the background without user interaction.

## Getting Started

### 1. Create a Google reCAPTCHA Account

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Click "Create" to register a new site

### 2. Configure reCAPTCHA Settings

1. **Label**: Enter a name for your site (e.g., "Yuki Anime Platform")
2. **reCAPTCHA type**: Select "reCAPTCHA v3"
3. **Domains**: Add your domains:
   - For development: `localhost` or `127.0.0.1`
   - For production: your actual domain (e.g., `yourdomain.com`)
4. **Owners**: Add additional Google accounts if needed
5. **Accept the reCAPTCHA Terms of Service**
6. Click "Submit"

### 3. Get Your Keys

After creating the site, you'll receive:

- **Site Key** (public key): Used in the frontend
- **Secret Key** (private key): Used in the backend for verification

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_actual_site_key_here
   RECAPTCHA_SECRET_KEY=your_actual_secret_key_here
   ```

### 5. Testing

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to the login page (`/login`)
3. You should see the reCAPTCHA checkbox
4. Complete the reCAPTCHA challenge
5. Submit the form to test verification

## Features

### Login Form Security

- reCAPTCHA verification required before login
- Shows image recognition challenges (cars, bikes, traffic lights, etc.)
- Prevents automated bot attacks

### Forgot Password Security

- reCAPTCHA verification required before sending reset emails
- Prevents spam and abuse of password reset functionality

### Error Handling

- Clear error messages for failed verifications
- Automatic reCAPTCHA reset on errors
- Form validation with visual feedback

## Advanced Configuration

### reCAPTCHA v2 (Alternative)

If you prefer the visible checkbox version:

1. Create a new reCAPTCHA v2 site in the admin console (select "I'm not a robot" Checkbox)
2. Update the component to use the react-google-recaptcha package
3. Users will see challenges like selecting cars, bikes, traffic lights, etc.

### Custom Themes

reCAPTCHA v3 is invisible, but you can customize the loading and status indicators in the component.

### Score Threshold

The API route is configured with a score threshold of 0.5. You can adjust this in `/src/app/api/verify-recaptcha/route.ts` based on your security requirements:

- Higher scores (0.7-1.0): More strict, may block some legitimate users
- Lower scores (0.3-0.5): More lenient, may allow more automated traffic

## Troubleshooting

### Common Issues

1. **"Invalid site key"**: Check that your site key is correct and matches your domain
2. **"Invalid secret key"**: Verify your secret key in the environment variables
3. **Domain mismatch**: Ensure your domain is added to the reCAPTCHA configuration
4. **HTTPS requirement**: reCAPTCHA requires HTTPS in production

### Testing on Localhost

For local development, make sure to add `localhost` or `127.0.0.1` to your reCAPTCHA domains in the Google Admin Console.

## Security Best Practices

1. **Never expose your secret key**: Keep it in environment variables only
2. **Validate on server-side**: Always verify reCAPTCHA tokens on your backend
3. **Implement rate limiting**: Add additional protection against brute force attacks
4. **Monitor scores**: Keep track of reCAPTCHA scores to adjust thresholds
5. **Regular updates**: Keep the reCAPTCHA library updated

## Support

For issues with reCAPTCHA itself, refer to the [Google reCAPTCHA documentation](https://developers.google.com/recaptcha/docs/display).

For project-specific issues, check the console for error messages and ensure all environment variables are properly configured.
