# Website Testing Guide

## Local Testing with Query Parameters

The simplest way to test the website locally is using query parameters.

### Test the anvega.ai Website
```
http://localhost:3000?domain=anvega
```

### Test the MyTara.Care App (default)
```
http://localhost:3000
```
or
```
http://localhost:3000?domain=tara
```

## Available Website Pages

When testing with `?domain=anvega`, you can navigate to:

- `/` - Home page
- `/about` - About page
- `/services` - Services page
- `/founders` - Founders page
- `/contact` - Contact page

Example: `http://localhost:3000?domain=anvega/about`

## Domain Detection Priority

The domain detector checks in this order:
1. Query parameter (`?domain=anvega` or `?domain=tara`)
2. Environment variable (`VITE_FORCE_DOMAIN`)
3. Hostname (anvega.ai or mytara.care)
4. Default (tara)

## Production Deployment

In production, the domain is automatically detected from the hostname:
- `anvega.ai` → Shows website
- `mytara.care` → Shows app

Both domains serve from the same build directory via nginx configuration.
