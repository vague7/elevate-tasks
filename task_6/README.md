# Contact Form with Advanced Validation

A modern, responsive contact form with comprehensive client-side validation, built using vanilla HTML, CSS, and JavaScript. Features real-time validation, smooth animations, and an intuitive user experience.

## 🚀 Features

- **Comprehensive Validation**: Real-time validation for all form fields
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Character Counter**: Real-time character counting for message field
- **Loading States**: Visual feedback during form submission
- **Error Handling**: Detailed error messages with visual indicators
- **Success Feedback**: Confirmation message after successful submission
- **Phone Formatting**: Automatic phone number formatting (US format)
- **Dark Mode Support**: Automatic dark mode detection and styling

## 📸 Screenshots

### Desktop View
<img src="/desktop.jpg">
*Clean, professional desktop layout with gradient background*

### Validation States
<img src="/states1.jpg">

<img src="/states2.jpg">
*Real-time validation with error and success states*

### Success Message
<img src="/success.jpg">
*Animated success confirmation*

## 🛠️ Technical Implementation

### File Structure
```
contact-form/
├── index.html          # Main HTML structure
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript validation logic
└── README.md          # Project documentation
```

### Key Components

#### HTML Structure (`index.html`)
- Semantic HTML5 form elements
- ARIA accessibility attributes
- Structured form groups with labels and error containers
- Modern form controls (select dropdown, checkboxes, textarea)

#### CSS Styling (`styles.css`)
- CSS Grid and Flexbox layouts
- CSS custom properties for theming
- Smooth transitions and animations
- Responsive breakpoints
- Dark mode support via `prefers-color-scheme`
- Modern glassmorphism design elements

#### JavaScript Validation (`script.js`)
- Object-oriented validation class
- Real-time validation on blur/input events
- Comprehensive validation rules:
  - **Name**: Required, minimum 2 characters, letters only
  - **Email**: Required, valid email format, length limits
  - **Phone**: Optional, 10-15 digits when provided
  - **Subject**: Required selection
  - **Message**: Required, 10-500 characters
  - **Terms**: Required agreement checkbox
- Character counting with color indicators
- Form submission with loading states
- Error handling and user feedback

## 🎯 Validation Rules

| Field | Validation Rules |
|-------|------------------|
| **Name** | Required, min 2 chars, letters/spaces/hyphens/apostrophes only |
| **Email** | Required, valid email format, max 254 characters |
| **Phone** | Optional, 10-15 digits when provided, auto-formatting |
| **Subject** | Required selection from dropdown |
| **Message** | Required, 10-500 characters with live counter |
| **Terms** | Required checkbox agreement |

## 🎨 Design Features

- **Gradient Background**: