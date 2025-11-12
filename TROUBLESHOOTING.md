# Troubleshooting Guide

## Issue: 3D Lab Not Showing

### React DevTools Error (Safe to Ignore)

```
Uncaught Error: Invalid argument not valid semver ('' received)
```

**Cause**: React 19 compatibility issue with browser React DevTools extension  
**Impact**: This is just a warning - it does NOT break your app  
**Solution**: You can safely ignore this error OR disable React DevTools browser extension

---

## Checklist for 3D Lab Rendering

### 1. Check Browser Console

Open browser DevTools (F12) and look for actual errors (not the DevTools warning)

### 2. Verify Canvas is Rendering

The center panel should show:

- Gray gradient background
- Mouse control instructions at bottom
- 3D scene with lab bench and equipment

### 3. Check if Welcome Screen is Blocking

- If you see a welcome modal, click "Start Lab Tour" or "Skip & Enter Lab"
- This closes the welcome overlay

### 4. Verify Technique Selection

- Look at left panel
- Click on "Filtration" or "Distillation / Evaporation"
- 3D equipment should appear in center view

### 5. Check WebGL Support

Open console and type:

```javascript
document.createElement("canvas").getContext("webgl2");
```

Should return a WebGL context object (not null)

---

## Common Issues

### Issue: Blank Gray Area (No 3D Objects)

**Possible Causes**:

1. Welcome screen is showing (click to dismiss)
2. WebGL not supported in browser
3. GPU acceleration disabled

**Solutions**:

- Dismiss welcome screen
- Try a different browser (Chrome, Edge, Firefox)
- Enable GPU acceleration in browser settings

### Issue: Welcome Screen Won't Close

**Solution**: Open browser console and type:

```javascript
localStorage.clear();
location.reload();
```

### Issue: Equipment Not Showing After Selecting Technique

**Check**:

1. Is the technique button highlighted in blue?
2. Look for any red error messages in browser console
3. Try refreshing the page (Ctrl+R or F5)

---

## Quick Test Steps

1. **Open** http://localhost:5173/
2. **Dismiss** welcome screen if it appears
3. **Click** "Filtration" button in left panel
4. **Wait** 1-2 seconds for 3D models to load
5. **Look** for glass funnel and flask in center
6. **Try** mouse controls:
   - Left drag = rotate view
   - Scroll = zoom
   - Right drag = pan

---

## Still Not Working?

### Get Debug Info

Open browser console (F12) and run:

```javascript
// Check if React is loaded
console.log("React version:", React.version);

// Check if Three.js is loaded
console.log("Three.js loaded:", typeof THREE !== "undefined");

// Check current technique
console.log(
  "Current technique:",
  document.querySelector('[class*="border-blue-500"]')?.textContent
);

// Check for Canvas element
console.log("Canvas exists:", document.querySelector("canvas") !== null);
```

### Check Network Tab

1. Open DevTools → Network tab
2. Refresh page
3. Look for any failed requests (red text)
4. Check if all JavaScript modules loaded successfully

---

## Force Fresh Start

If nothing works, try:

```powershell
# Stop dev server (Ctrl+C)
# Then:
npm install
npm run dev
```

Then clear browser cache:

- Chrome: Ctrl+Shift+Delete → Clear cache
- Or hard refresh: Ctrl+Shift+R

---

## Expected Behavior

### When Working Correctly:

1. ✅ Welcome screen appears first (dismissible)
2. ✅ Three panels visible: left (controls), center (3D), right (observations)
3. ✅ Center panel shows gray background with 3D lab bench
4. ✅ Clicking "Filtration" shows glass funnel + flask + beaker
5. ✅ Clicking "Distillation" shows round flask + condenser + burner
6. ✅ Mouse controls work smoothly
7. ✅ Equipment is clearly visible (not transparent)

### Visual Markers:

- **Lab bench**: Brown wooden surface
- **Floor**: Gray tile
- **Filtration**: Clear blue-tinted glass funnel above flask
- **Distillation**: Round bottom flask with tubing to condenser

---

## Contact Info for Specific Errors

If you see specific error messages, they likely indicate:

**"Cannot find module"** → Missing import, file path issue  
**"undefined is not a function"** → Dependency version mismatch  
**"WebGL not supported"** → Browser/GPU issue  
**"Failed to fetch"** → Network/firewall blocking dev server

Run `npm ls` to check all dependencies are installed correctly.
