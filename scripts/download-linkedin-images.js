/**
 * Script to download LinkedIn profile images
 * 
 * Usage:
 * 1. Open the LinkedIn profile in your browser
 * 2. Right-click on the profile photo
 * 3. Select "Open image in new tab" or "Copy image address"
 * 4. Copy the full image URL
 * 5. Run this script with the URLs:
 *    node scripts/download-linkedin-images.js [amulya-url] [shweta-url]
 * 
 * Or manually:
 * 1. Visit: https://www.linkedin.com/in/amulya-tayal-931976a/
 * 2. Right-click profile photo > Copy image address
 * 3. Visit: https://www.linkedin.com/in/shweta-aggarwal-b7198123/
 * 4. Right-click profile photo > Copy image address
 * 5. Download both images and save to public/founders/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const foundersDir = path.join(__dirname, '../public/founders');

// Ensure directory exists
if (!fs.existsSync(foundersDir)) {
  fs.mkdirSync(foundersDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(foundersDir, filename));
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${filename}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        file.close();
        fs.unlinkSync(path.join(foundersDir, filename));
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(path.join(foundersDir, filename));
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(path.join(foundersDir, filename))) {
        fs.unlinkSync(path.join(foundersDir, filename));
      }
      reject(err);
    });
  });
}

// Get URLs from command line or use instructions
const args = process.argv.slice(2);

if (args.length === 2) {
  const [amulyaUrl, shwetaUrl] = args;
  
  Promise.all([
    downloadImage(amulyaUrl, 'amulya-tayal.jpg'),
    downloadImage(shwetaUrl, 'shweta-aggarwal.jpg')
  ])
    .then(() => {
      console.log('\n✓ All images downloaded successfully!');
      console.log('Images saved to: public/founders/');
    })
    .catch((err) => {
      console.error('Error downloading images:', err.message);
      console.log('\nManual instructions:');
      console.log('1. Visit the LinkedIn profiles');
      console.log('2. Right-click on profile photos');
      console.log('3. Copy image address');
      console.log('4. Download and save to public/founders/');
    });
} else {
  console.log('LinkedIn Profile Image Downloader');
  console.log('==================================\n');
  console.log('To download images automatically:');
  console.log('1. Visit: https://www.linkedin.com/in/amulya-tayal-931976a/');
  console.log('2. Right-click profile photo > Copy image address');
  console.log('3. Visit: https://www.linkedin.com/in/shweta-aggarwal-b7198123/');
  console.log('4. Right-click profile photo > Copy image address');
  console.log('5. Run: node scripts/download-linkedin-images.js [amulya-url] [shweta-url]\n');
  console.log('Or manually:');
  console.log('1. Download images from LinkedIn');
  console.log('2. Save as: public/founders/amulya-tayal.jpg');
  console.log('3. Save as: public/founders/shweta-aggarwal.jpg');
}
