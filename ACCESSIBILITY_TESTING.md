# Accessibility Testing Guide

This guide provides step-by-step instructions for testing the accessibility improvements made to the GrooveRooster web application.

## Quick Testing Checklist

Use this checklist to verify all accessibility features are working correctly:

### Keyboard Navigation Testing

- [ ] Press Tab when page loads - "Skip to main content" link should appear
- [ ] Press Enter on skip link - focus should jump to main content area
- [ ] Tab through navigation menu - all items should be reachable
- [ ] Click hamburger menu, then press Escape - menu should close
- [ ] Tab through event cards - each should be focusable
- [ ] Press Enter or Space on event card - modal should open
- [ ] Press Tab in modal - focus should stay within modal
- [ ] Press Escape in modal - modal should close
- [ ] Verify focus returns to event card after closing modal

### Screen Reader Testing

#### Using NVDA (Windows)

1. Download NVDA from https://www.nvaccess.org/download/
2. Start NVDA (Ctrl+Alt+N)
3. Navigate to localhost:3000
4. Use down arrow to read through page content
5. Verify:
   - Skip link is announced
   - All images have alt text announced
   - Form labels are announced correctly
   - Modal dialog is announced as "dialog"
   - Event cards have descriptive labels

#### Using VoiceOver (Mac)

1. Enable VoiceOver (Cmd+F5)
2. Navigate to localhost:3000
3. Use VO+Right Arrow to navigate
4. Verify same items as NVDA above

### Color Contrast Testing

1. Open Chrome DevTools
2. Run Lighthouse audit
3. Check for contrast issues
4. Verify all text meets WCAG AA (4.5:1 ratio)

---

## Detailed Testing Procedures

### 1. Skip Navigation Link

**Purpose:** Allow keyboard users to bypass navigation

**Test Steps:**

1. Load the home page
2. Press Tab key once
3. **Expected:** A "Skip to main content" link appears at the top-left
4. Press Enter
5. **Expected:** Focus jumps to main content, bypassing navigation

**Pass Criteria:**

- Link is visible when focused
- Link is hidden when not focused
- Pressing Enter moves focus to #main-content
- Focus indicator is clearly visible

---

### 2. Modal Accessibility

**Purpose:** Ensure modals are accessible via keyboard and screen reader

**Test Steps:**

1. Navigate to an events page
2. Tab to an event card
3. Press Enter to open modal
4. **Expected:** Modal opens and close button receives focus
5. Press Tab repeatedly
6. **Expected:** Focus stays within modal (focus trap)
7. Press Escape
8. **Expected:** Modal closes and focus returns to event card
9. With screen reader on, verify dialog role is announced

**Pass Criteria:**

- Close button receives focus when modal opens
- Tab key cycles through modal elements only
- Shift+Tab cycles backwards through modal
- Escape key closes modal
- Focus returns to trigger element
- Screen reader announces "dialog" or "modal dialog"

---

### 3. Menu Overlay Navigation

**Purpose:** Ensure navigation menu is keyboard accessible

**Test Steps:**

1. Tab to hamburger menu icon
2. Press Enter to open menu
3. **Expected:** Menu slides in, close button receives focus
4. Press Tab to navigate menu items
5. **Expected:** All menu items are reachable
6. Press Escape
7. **Expected:** Menu closes
8. Press Enter on a menu item
9. **Expected:** Navigation occurs, menu closes

**Pass Criteria:**

- Menu opens with keyboard
- Close button is focused when menu opens
- All menu items are keyboard accessible
- Escape key closes menu
- Menu has proper ARIA attributes

---

### 4. EventCard Keyboard Access

**Purpose:** Event cards are interactive via keyboard

**Test Steps:**

1. Navigate to events page
2. Tab through event cards
3. **Expected:** Each card receives visible focus
4. Press Enter on focused card
5. **Expected:** Event details modal opens
6. Close modal, press Space on another card
7. **Expected:** Event details modal opens

**Pass Criteria:**

- Cards receive focus with Tab
- Enter key opens modal
- Space key opens modal
- Focus indicator is clearly visible
- Screen reader announces descriptive label

---

### 5. Form Accessibility

**Purpose:** Forms are accessible and provide clear feedback

**Test Steps:**

1. Navigate to login or signup page
2. Tab through form fields
3. **Expected:** Each label is clearly associated
4. With screen reader, verify labels are announced
5. Submit form with errors
6. **Expected:** Error messages are clear and announced
7. Verify password requirements are announced
8. Check that required fields are marked with aria-required

**Pass Criteria:**

- All inputs have associated labels
- Labels are announced by screen reader
- Error messages are visible and announced
- aria-required is set on required fields
- aria-describedby links inputs to help text

---

## Automated Testing

### Using Lighthouse

1. Open Chrome DevTools (F12)
2. Navigate to "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Analyze page load"
5. Review results and fix any issues scoring below 90

**Expected Score:** 95+ for accessibility

### Using axe DevTools

1. Install axe DevTools extension
2. Open DevTools and find "axe DevTools" tab
3. Click "Scan ALL of my page"
4. Review and fix any critical or serious issues

**Expected Result:** 0 critical or serious violations

### Using WAVE

1. Install WAVE extension
2. Navigate to a page
3. Click WAVE icon
4. Review summary of errors, alerts, and features
5. Fix any errors (red icons)

**Expected Result:** 0 errors, minimal alerts

---

## Testing Specific Components

### SkipLink Component

```bash
Location: components/SkipLink/SkipLink.tsx
Target: #main-content in components/layout.js
```

- Appears on first Tab
- Hidden by default (sr-only class)
- Visible on focus
- Links to main content area

### Modal Component

```bash
Location: components/Modal/Modal.js
```

- Focus trap works
- Escape key handler works
- Auto-focus on close button
- ARIA attributes present:
  - role="dialog"
  - aria-modal="true"
  - aria-labelledby="modal-title"

### MenuOverlay Component

```bash
Location: components/ui/MenuOverlay.jsx
```

- Focus management works
- Escape key handler works
- ARIA attributes present:
  - role="dialog"
  - aria-modal="true"
  - aria-label="Navigation menu"
- Uses semantic <nav> element

### LiveRegion Component

```bash
Location: components/Accessibility/LiveRegion.tsx
```

Not actively used yet, but available for:

- Form validation messages
- Success/error notifications
- Dynamic content announcements

---

## Common Issues and Solutions

### Issue: Focus not visible

**Solution:** Ensure focus styles are defined and not removed with `outline: none`

### Issue: Modal doesn't trap focus

**Solution:** Check that modal ref is correctly set and focus trap logic is working

### Issue: Screen reader not announcing changes

**Solution:** Use LiveRegion component with appropriate aria-live value

### Issue: Skip link not working

**Solution:** Verify #main-content id exists on main element

### Issue: Keyboard navigation broken

**Solution:** Check for event.preventDefault() calls that might be blocking default behavior

---

## Browser Compatibility

Test in the following browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Test with these screen readers:

- NVDA (Windows) with Chrome/Firefox
- JAWS (Windows) with Chrome/IE
- VoiceOver (Mac) with Safari
- VoiceOver (iOS) with Safari
- TalkBack (Android) with Chrome

---

## Resources

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Keyboard Testing](https://webaim.org/articles/keyboard/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Chrome Accessibility DevTools](https://developer.chrome.com/docs/devtools/accessibility/)

---

## Report Issues

If you find accessibility issues during testing:

1. Document the issue with:
   - Browser and version
   - Screen reader (if applicable)
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshot/recording if possible

2. Check if it's already documented in ACCESSIBILITY.md

3. Create an issue or update existing accessibility tasks

---

## Sign-off Checklist

Before considering accessibility complete, verify:

- [ ] All keyboard navigation tests pass
- [ ] Screen reader testing completed
- [ ] Lighthouse accessibility score is 95+
- [ ] No critical or serious axe violations
- [ ] WAVE shows no errors
- [ ] Color contrast meets WCAG AA
- [ ] Form validation is accessible
- [ ] Modals and overlays work with keyboard
- [ ] Focus management is correct
- [ ] Documentation is up to date
