# Project Development Rules

## Project Structure

- **Frontend Code Location**: All frontend code modifications should be made in `d:\Workspace\Go\new-api-customize\web-customize` directory
- **Design Philosophy**: Advanced Flat Design (高级扁平化设计)

---

## Design System - Advanced Flat Design

### Core Principles

1. **No 3D Effects**: Remove all shadows, gradients that create depth, and glassmorphism effects
2. **Clean Borders**: Use thin, subtle borders (`1px solid`) instead of shadows for separation
3. **Solid Colors**: Use flat solid colors or very subtle backgrounds
4. **Consistent Spacing**: Maintain generous whitespace and consistent padding
5. **Minimal Animation**: Avoid transform animations that create depth perception

### CSS Implementation Pattern

```css
/* Flat Design - Light Mode */
.component-name {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  color: #0f172a;
  box-shadow: none;
}

.component-name:hover {
  border-color: rgba(15, 23, 42, 0.15);
  background: #f5f5f5;
  /* No transform, no box-shadow */
}

/* Flat Design - Dark Mode */
html.dark .component-name {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f1f5f9;
}

html.dark .component-name:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: #1e293b;
}
```

### Color Palette

**Light Mode:**
- Background: `#fafafa`
- Card Background: `#ffffff`
- Text Primary: `#0f172a`
- Text Secondary: `rgba(15, 23, 42, 0.6)`
- Borders: `rgba(15, 23, 42, 0.08)` to `0.15`
- Accent: `#3b82f6`, `#6366f1`, `#06b6d4`

**Dark Mode:**
- Background: `#0a0a0a`
- Card Background: `#0f172a`
- Text Primary: `#f1f5f9`
- Text Secondary: `rgba(241, 245, 249, 0.6)`
- Borders: `rgba(255, 255, 255, 0.08)` to `0.15`
- Accent: `#60a5fa`, `#818cf8`, `#22d3ee`

### What to AVOID

❌ **Glassmorphism Effects**:
```css
/* DON'T USE */
backdrop-filter: blur(14px);
background: rgba(255, 255, 255, 0.6);
```

❌ **Shadows for Depth**:
```css
/* DON'T USE */
box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
```

❌ **Gradient Backgrounds on Cards**:
```css
/* DON'T USE */
background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(239,246,255,0.92));
background: radial-gradient(circle at 20% 20%, rgba(37,99,235,0.14), rgba(255,255,255,0.98));
```

❌ **3D Transform Effects**:
```css
/* DON'T USE */
transform: translateY(-4px);
transform: scale(1.02);
```

### What to USE

✅ **Flat Solid Backgrounds**:
```css
background: #ffffff;
background: var(--story-panel-bg);
```

✅ **Subtle Borders**:
```css
border: 1px solid rgba(15, 23, 42, 0.08);
border: 1px solid var(--story-border);
```

✅ **Color State Changes**:
```css
.component:hover {
  border-color: var(--story-border-strong);
  background: var(--story-bg-2);
}
```

✅ **Consistent Border Radius**:
```css
border-radius: 12px; /* Cards */
border-radius: 8px;  /* Buttons */
```

---

## Dark/Light Mode Support (Required)

All new UI components and styles MUST support both dark and light modes.

### CSS Variables

```css
.story-home {
  --story-text: #0f172a;
  --story-sub: rgba(15, 23, 42, 0.6);
  --story-border: rgba(15, 23, 42, 0.08);
  --story-border-strong: rgba(15, 23, 42, 0.15);
  --story-bg: #fafafa;
  --story-bg-2: #f5f5f5;
  --story-panel-bg: #ffffff;
}

html.dark .story-home {
  --story-text: #f1f5f9;
  --story-sub: rgba(241, 245, 249, 0.6);
  --story-border: rgba(255, 255, 255, 0.08);
  --story-border-strong: rgba(255, 255, 255, 0.15);
  --story-bg: #0a0a0a;
  --story-bg-2: #111111;
  --story-panel-bg: #0f172a;
}
```

### Checklist Before Committing

- [ ] Component uses flat design (no shadows, no glassmorphism)
- [ ] Test component in light mode
- [ ] Test component in dark mode
- [ ] Verify all text colors have sufficient contrast
- [ ] Check borders are visible in both modes
- [ ] Ensure hover states use border/background color changes only
- [ ] No 3D transform effects on hover
- [ ] No gradient backgrounds on cards

### Testing

Toggle dark mode by adding/removing the `dark` class on the `html` element:
```javascript
// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');
```
