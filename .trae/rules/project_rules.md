# Project Development Rules

## Project Structure

- **Frontend Code Location**: All frontend code modifications should be made in `d:\Workspace\Go\new-api-customize\web-customize` directory
- **Design Philosophy**: Advanced Flat Design (高级扁平化设计)

---

## Color Preference (Important)

**AVOID using blue colors, especially pure blue and dark blue.**

### Colors to AVOID:
- ❌ Pure blue: `#0000ff`, `#0066ff`
- ❌ Dark blue: `#0f172a`, `#1e3a5f`, `#1e40af`
- ❌ Bright blue: `#3b82f6`, `#2563eb`
- ❌ Blue gradients with dominant blue tones

### Preferred Color Palette:

**Primary Accent Colors (Non-Blue):**
- Purple: `#8b5cf6`, `#a78bfa`, `#c4b5fd`
- Violet: `#7c3aed`, `#8b5cf6`
- Emerald: `#10b981`, `#34d399`, `#6ee7b7`
- Teal: `#14b8a6`, `#2dd4bf`
- Rose: `#f43f5e`, `#fb7185`
- Amber: `#f59e0b`, `#fbbf24`
- Slate (for text/borders): `#475569`, `#64748b`

**Light Mode:**
- Background: `#fafafa` or `#f8fafc`
- Card Background: `#ffffff`
- Text Primary: `#1e293b` (slate-800, not blue)
- Text Secondary: `rgba(30, 41, 59, 0.6)`
- Borders: `rgba(100, 116, 139, 0.1)` to `0.2`
- Accent: `#8b5cf6` (violet), `#10b981` (emerald), `#f59e0b` (amber)

**Dark Mode:**
- Background: `#0f0f0f` or `#111111`
- Card Background: `#1a1a1a`
- Text Primary: `#f8fafc`
- Text Secondary: `rgba(248, 250, 252, 0.6)`
- Borders: `rgba(255, 255, 255, 0.08)` to `0.15`
- Accent: `#a78bfa` (violet), `#34d399` (emerald), `#fbbf24` (amber)

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
/* Flat Design - Light Mode (Purple accent example) */
.component-name {
  background: #ffffff;
  border: 1px solid rgba(100, 116, 139, 0.1);
  border-radius: 12px;
  color: #1e293b;
  box-shadow: none;
}

.component-name:hover {
  border-color: rgba(139, 92, 246, 0.3);
  background: #fafafa;
  /* No transform, no box-shadow */
}

/* Primary Button - Violet instead of Blue */
.btn-primary {
  background: #8b5cf6;
  color: #ffffff;
}

.btn-primary:hover {
  background: #7c3aed;
}

/* Flat Design - Dark Mode */
html.dark .component-name {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f8fafc;
}

html.dark .component-name:hover {
  border-color: rgba(167, 139, 250, 0.3);
  background: #262626;
}
```

### What to AVOID

❌ **Blue Colors**:
```css
/* DON'T USE */
color: #3b82f6;
color: #2563eb;
background: #1e40af;
background: linear-gradient(135deg, #0f172a, #3b82f6);
```

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
```

❌ **3D Transform Effects**:
```css
/* DON'T USE */
transform: translateY(-4px);
transform: scale(1.02);
```

### What to USE

✅ **Violet/Purple Accents** (Preferred):
```css
background: #8b5cf6;
color: #7c3aed;
border-color: rgba(139, 92, 246, 0.2);
```

✅ **Emerald/Green Accents**:
```css
background: #10b981;
color: #059669;
```

✅ **Amber/Orange Accents**:
```css
background: #f59e0b;
color: #d97706;
```

✅ **Flat Solid Backgrounds**:
```css
background: #ffffff;
background: var(--story-panel-bg);
```

✅ **Subtle Borders**:
```css
border: 1px solid rgba(100, 116, 139, 0.1);
border: 1px solid var(--story-border);
```

---

## Dark/Light Mode Support (Required)

All new UI components and styles MUST support both dark and light modes.

### CSS Variables (Non-Blue Palette)

```css
.story-home {
  --story-text: #1e293b;
  --story-sub: rgba(30, 41, 59, 0.6);
  --story-border: rgba(100, 116, 139, 0.1);
  --story-border-strong: rgba(100, 116, 139, 0.2);
  --story-bg: #fafafa;
  --story-bg-2: #f5f5f5;
  --story-panel-bg: #ffffff;
  --story-accent: #8b5cf6;      /* Violet */
  --story-accent-2: #10b981;    /* Emerald */
  --story-accent-3: #f59e0b;    /* Amber */
}

html.dark .story-home {
  --story-text: #f8fafc;
  --story-sub: rgba(248, 250, 252, 0.6);
  --story-border: rgba(255, 255, 255, 0.08);
  --story-border-strong: rgba(255, 255, 255, 0.15);
  --story-bg: #0f0f0f;
  --story-bg-2: #1a1a1a;
  --story-panel-bg: #1a1a1a;
  --story-accent: #a78bfa;      /* Light violet */
  --story-accent-2: #34d399;    /* Light emerald */
  --story-accent-3: #fbbf24;    /* Light amber */
}
```

### Checklist Before Committing

- [ ] No blue colors used (especially #3b82f6, #2563eb, #1e40af)
- [ ] Using violet/purple, emerald, or amber as accent colors
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
