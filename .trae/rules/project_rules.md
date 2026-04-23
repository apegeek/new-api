# Project Development Rules

## Dark/Light Mode Support (Required)

All new UI components and styles MUST support both dark and light modes.

### CSS Implementation Pattern

```css
/* Light mode (default) */
.component-name {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(99, 102, 241, 0.1);
  color: #0f172a;
}

/* Dark mode override */
html.dark .component-name {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #fff;
}
```

### Color Guidelines

**Light Mode:**
- Background: `rgba(248, 250, 252, 0.98)` or `rgba(255, 255, 255, 0.7)`
- Text primary: `#0f172a`
- Text secondary: `rgba(71, 85, 105, 0.8)`
- Borders: `rgba(99, 102, 241, 0.1)` to `0.15`
- Shadows: `rgba(15, 23, 42, 0.15)`

**Dark Mode:**
- Background: `rgba(15, 23, 42, 0.95)` or `rgba(255, 255, 255, 0.03)`
- Text primary: `#fff`
- Text secondary: `rgba(148, 163, 184, 0.8)`
- Borders: `rgba(255, 255, 255, 0.06)` to `0.1`
- Shadows: `rgba(0, 0, 0, 0.5)`

### Accent Colors (Both Modes)
- Indigo: Light `#6366f1` / Dark `#818cf8`
- Cyan: Light `#0891b2` / Dark `#22d3ee`
- Emerald: Light `#059669` / Dark `#34d399`
- Violet: Light `#7c3aed` / Dark `#a78bfa`

### Checklist Before Committing

- [ ] Test component in light mode
- [ ] Test component in dark mode
- [ ] Verify all text colors have sufficient contrast
- [ ] Check borders are visible in both modes
- [ ] Ensure hover states work in both modes
- [ ] Verify shadows look appropriate in both modes

### Testing

Toggle dark mode by adding/removing the `dark` class on the `html` element:
```javascript
// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');
```
