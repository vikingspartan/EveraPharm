# EveraPharma Development Guide

## 🎯 Quick Start for Frontend Changes

### 1. Start Development Server
```bash
# Easy setup (recommended)
./scripts/dev-setup.sh

# Manual setup
npm run dev --workspace=apps/web
# Then open: http://localhost:3000
```

### 2. Main Page Content Location
**File**: `apps/web/app/page.tsx`

## 📝 Editable Content Sections

### Hero Section (Lines 118-140)
```typescript
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
  Welcome to EveraPharm  {/* ← Main heading */}
</h1>
<p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
  We are a leading global pharmaceutical and healthcare manufacturer. {/* ← Subtitle */}
</p>
<div className="space-y-4">
  <p className="text-lg text-blue-200">
    We manufacture and distribute more than 4,000 medical products globally {/* ← Stat 1 */}
  </p>
  <p className="text-lg text-blue-200">
    We excel at getting our products to those that need them most {/* ← Stat 2 */}
  </p>
</div>
```

### Products Section (Lines 150-160)
```typescript
<h2 className="text-4xl font-bold text-gray-900 mb-4">Products</h2>
<p className="text-xl text-gray-600">
  We have an extensive and diverse portfolio of superior quality, affordable products. {/* ← Description */}
</p>
```

### Product Categories (Lines 165-230)
Each category has:
- **Title**: `<h3>Category Name</h3>`
- **Description**: `<p>Category description</p>`
- **Link**: `href="/products/category-slug"`

Example:
```typescript
<h3 className="text-xl font-semibold text-gray-900 mb-2">Pharmaceuticals</h3>
<p className="text-gray-600 mb-4">Therapies to cure diseases and intervene in chronic illnesses</p>
```

### "Become a Distributor" Section (Lines 240-265)
```typescript
<h2 className="text-4xl font-bold mb-4">Become a Distributor Today</h2>
<p className="text-xl text-blue-100 mb-8">Let's transform the standards of healthcare</p>
<p className="text-lg max-w-3xl mx-auto mb-8 text-blue-200">
  We provide the best value to our partners... {/* ← Long description */}
</p>
```

### "Why EveraPharm?" Section (Lines 270-320)
Six feature boxes with titles and descriptions:
```typescript
<h3 className="text-xl font-semibold text-gray-900 mb-2">High Quality Affordable Products</h3>
```

### Customer Testimonials (Lines 330-400)
Three testimonial cards with:
- **Quote**: Customer feedback text
- **Name**: Customer name
- **Title**: Customer title/position

Example:
```typescript
<p className="text-gray-600 mb-6">
  For us, building relationships is the most important aspect... {/* ← Testimonial text */}
</p>
<div>
  <p className="font-semibold text-gray-900">J. Boadu</p> {/* ← Customer name */}
  <p className="text-sm text-gray-600">CEO Institutional Procurement West Africa Region</p> {/* ← Title */}
</div>
```

### Contact Section (Lines 410-441)
```typescript
<h2 className="text-4xl font-bold mb-4">Contact Us</h2>
<p className="text-xl text-blue-100">
  Talk with a sales advisor to create a customized quotation. Here's how you can reach us... {/* ← Description */}
</p>
```

## 🎨 Layout Components

### Header Navigation
**File**: `apps/web/components/layout/Header.tsx`
- Logo and company name
- Navigation menu items
- Contact information

### Footer
**File**: `apps/web/components/layout/Footer.tsx`
- Company information
- Links and contact details
- Social media links

## 🔧 Development Workflow

### 1. Real-Time Editing
1. Start dev server: `./scripts/dev-setup.sh` → Choose option 1
2. Open browser: http://localhost:3000
3. Edit `apps/web/app/page.tsx`
4. **Save file** → Page refreshes automatically
5. See changes instantly!

### 2. Common Edits

#### Change Main Heading
```typescript
// Find line ~120
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
  Your New Company Name Here
</h1>
```

#### Update Company Description
```typescript
// Find line ~125
<p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
  Your new company mission statement and description.
</p>
```

#### Modify Product Categories
```typescript
// Find around line 180
<h3 className="text-xl font-semibold text-gray-900 mb-2">Your Product Type</h3>
<p className="text-gray-600 mb-4">Description of your products and services</p>
```

#### Update Customer Testimonials
```typescript
// Find around line 350
<p className="text-gray-600 mb-6">
  "Your customer's testimonial about your great service and products..."
</p>
<p className="font-semibold text-gray-900">Customer Name</p>
<p className="text-sm text-gray-600">Customer Title, Company</p>
```

### 3. Styling Classes

The project uses **Tailwind CSS**. Common classes:
- `text-4xl font-bold` - Large bold heading
- `text-xl text-gray-600` - Medium gray text  
- `bg-blue-900 text-white` - Blue background, white text
- `mb-4` - Margin bottom
- `px-4 py-8` - Padding horizontal/vertical

### 4. Adding New Sections

To add a new section, follow this pattern:
```typescript
{/* Your New Section */}
<section className="py-16 bg-gray-50"> {/* Background color */}
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> {/* Container */}
    <div className="text-center mb-12"> {/* Header */}
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Section Title</h2>
      <p className="text-xl text-gray-600">Your section description</p>
    </div>
    
    {/* Your content here */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Content items */}
    </div>
  </div>
</section>
```

## 🚀 Deployment

After making changes locally:

1. **Test locally**: Ensure everything looks good
2. **Commit changes**: `git add . && git commit -m "Update homepage content"`
3. **Push to production**: `git push origin main`
4. **Deploy**: Follow the deployment guide or use automated deployment

## 🔍 Troubleshooting

### Development Server Won't Start
```bash
# Clean install
rm -rf node_modules
npm install
npm run dev --workspace=apps/web
```

### Changes Not Showing
1. Check the file is saved
2. Look for console errors in browser (F12)
3. Restart dev server: Ctrl+C, then `npm run dev --workspace=apps/web`

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Then restart
npm run dev --workspace=apps/web
```

## 📱 Responsive Design

The site is responsive across devices:
- **Mobile**: `sm:` classes (640px+)
- **Tablet**: `md:` classes (768px+)  
- **Desktop**: `lg:` classes (1024px+)

Example:
```typescript
<h1 className="text-4xl sm:text-5xl lg:text-6xl">
  {/* 4xl on mobile, 5xl on tablet, 6xl on desktop */}
</h1>
```

## 🎨 Color Scheme

Primary colors used:
- **Blue**: `bg-blue-900`, `text-blue-600`
- **Gray**: `bg-gray-50`, `text-gray-600` 
- **White**: `bg-white`, `text-white`

## 📞 Need Help?

1. Check browser console for errors (F12)
2. Refer to this guide for common edits
3. Use the development script: `./scripts/dev-setup.sh` 