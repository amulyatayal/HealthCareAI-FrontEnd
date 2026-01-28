# Founder Photos

Place the founder profile photos in this directory:

- `amulya-tayal.jpg` - Photo of Amulya Tayal
- `shweta-aggarwal.jpg` - Photo of Ms. Shweta Aggarwal

## Quick Method to Download from LinkedIn:

### Option 1: Manual Download (Easiest)
1. Visit: https://www.linkedin.com/in/amulya-tayal-931976a/
2. Right-click on the profile photo
3. Select "Open image in new tab"
4. Right-click the image > "Save image as..."
5. Save as `amulya-tayal.jpg` in this folder
6. Repeat for: https://www.linkedin.com/in/shweta-aggarwal-b7198123/
7. Save as `shweta-aggarwal.jpg`

### Option 2: Using the Download Script
1. Visit the LinkedIn profiles and copy the image URLs:
   - Right-click profile photo > "Copy image address"
2. Run the script:
   ```bash
   node scripts/download-linkedin-images.js [amulya-image-url] [shweta-image-url]
   ```

### Option 3: Browser Extension
Use a browser extension like "Download Image" to download LinkedIn profile photos directly.

## Image Requirements:

- Format: JPG or PNG
- Recommended size: 400x400px or larger (square)
- The images will be automatically cropped to circles
- File names must match exactly: `amulya-tayal.jpg` and `shweta-aggarwal.jpg`

## Note:

LinkedIn profile images are protected and require authentication to access programmatically. The easiest method is to manually download them from the browser.
