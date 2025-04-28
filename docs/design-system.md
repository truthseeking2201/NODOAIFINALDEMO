# Nodo AI Yield Vault Design System

This document provides guidelines for maintaining design consistency across the Nodo AI Yield Vault application.

## Color System

### Brand Colors

| Color Name | Hex Value | Description | Usage |
|------------|-----------|-------------|-------|
| Nova | `#EC6F05` | Main brand orange | Primary CTAs, highlights, AI features |
| Nova Light | `#FF9320` | Lighter brand orange | Gradients, hover states |
| Nova Dark | `#B45004` | Darker brand orange | Gradients, active states |
| Nova Deep | `#5A2702` | Deepest orange | Special emphasis |
| Orion | `#F59E0B` | Secondary amber | Medium risk level, secondary CTAs |
| Emerald | `#10B981` | Success green | Success states, low risk level |
| Violet | `#3E1672` | Deep purple | Accent color, backgrounds |

### Interface Colors

| Color Name | Hex Value | Description |
|------------|-----------|-------------|
| Background | `#0B0C10` | Main app background |
| Card Background | `#121620` | Card backgrounds |
| Text Primary | `#E5E7EB` | Primary text color |
| Text Secondary | `#9CA3AF` | Secondary text color |

## Typography

### Font Families

- **DM Sans**: Primary font for UI text
- **IBM Plex Mono**: Monospace font for code, addresses, and numerical data

### Font Sizes

| Class | Size | Usage |
|-------|------|-------|
| text-xs | 0.75rem | Helper text, labels |
| text-sm | 0.875rem | Secondary text |
| text-base | 1rem | Body text |
| text-lg | 1.125rem | Card titles |
| text-xl | 1.25rem | Section titles |
| text-2xl | 1.5rem | Page headings |
| text-3xl | 1.875rem | Hero text |

## Spacing

### Standard Spacing Scale

| Class | Size | Usage |
|-------|------|-------|
| space-xs | 0.25rem (4px) | Minimal spacing |
| space-sm | 0.5rem (8px) | Close elements |
| space-md | 1rem (16px) | Standard spacing |
| space-lg | 1.5rem (24px) | Section spacing |
| space-xl | 2rem (32px) | Large section spacing |
| space-2xl | 2.5rem (40px) | Page section spacing |
| space-3xl | 3rem (48px) | Major section dividers |

### Component Spacing

| Class | Description |
|-------|-------------|
| card-padding | Standard card padding (`p-6`) |
| card-padding-compact | Compact card padding (`p-4`) |
| component-spacing | Vertical spacing between components (`space-y-6`) |
| flex-row-space | Flex row with space between (`flex justify-between gap-4`) |

## Border Radius

| Class | Size | Usage |
|-------|------|-------|
| rounded-none | 0 | No border radius |
| rounded-sm | 0.25rem (4px) | Minimal rounding |
| rounded-md | 0.5rem (8px) | Buttons, small components |
| rounded-lg | 0.75rem (12px) | Medium components |
| rounded-xl | 1rem (16px) | Cards, larger components |
| rounded-2xl | 1.5rem (24px) | Featured components |
| rounded-3xl | 2rem (32px) | Hero elements |
| rounded-full | 50% | Circles, pills |

## Shadows & Elevation

| Class | Description | Usage |
|-------|-------------|-------|
| shadow-glass | `0 8px 32px rgba(0, 0, 0, 0.12)` | Card shadow |
| shadow-brand | `0 4px 8px -2px rgba(236, 111, 5, .35)` | Button shadow |
| shadow-brand-hover | `0 8px 16px -8px rgba(236, 111, 5, .25)` | Button hover shadow |
| shadow-elevation-1 | Light shadow | Subtle elements |
| shadow-elevation-2 | Medium shadow | Cards, interactive elements |
| shadow-elevation-3 | Heavy shadow | Elevated components |

## Animations

### Duration

- **Micro interactions**: 0.2s
- **UI transitions**: 0.3s
- **Emphasis animations**: 0.5s
- **Background effects**: 1-3s

### Standard Easing

- Standard easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` (ease-out)
- Emphasis easing: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (elastic)

### Animation Classes

| Class | Description | Usage |
|-------|-------------|-------|
| animate-pulse | Subtle pulsing | Draw attention |
| glow-animation | Temporary glow | Success confirmation |
| animate-fade-in | Fade in | New elements |
| animate-float | Floating effect | Decorative elements |
| brand-glow | Nova color glow | AI elements |
| transform-3d | 3D hover effect | Interactive cards |

## Component Patterns

### Cards

Use `glass-card` class with the following structure:

```jsx
<Card className="glass-card rounded-xl overflow-hidden">
  <CardHeader className="card-header">
    <CardTitle className="card-title">Title</CardTitle>
    <CardDescription className="card-description">Description</CardDescription>
  </CardHeader>
  <CardContent className="card-content">
    Content
  </CardContent>
</Card>
```

### Buttons

Use the Button component with appropriate variants:

```jsx
<Button variant="nova">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
```

Variants include: `default`, `nova`, `orion`, `emerald`, `outline`, `secondary`, `ghost`, `link`

### Focus States

All interactive elements should have consistent focus states using:

```jsx
.focus-ring:focus-visible {
  @apply outline-none ring-2 ring-brand-500/60 ring-offset-2 ring-offset-background;
}
```

## Responsive Design

Use the following breakpoints consistently:

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1400px

For container width:

```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

## Accessibility

- Maintain a minimum contrast ratio of 4.5:1 for normal text
- Use semantic HTML elements (`<button>`, `<a>`, etc.)
- Include focus styles for all interactive elements
- Support reduced motion with `prefers-reduced-motion` media query
- Ensure all interactive elements have appropriate ARIA attributes

## File Structure

- `src/styles/base.css`: Base styles and CSS variables
- `src/styles/typography.css`: Typography styles
- `src/styles/spacing.css`: Spacing utilities
- `src/styles/components.css`: Component-specific styles
- `src/styles/animations.css`: Animation definitions
- `src/styles/gradients.css`: Gradient utilities
- `src/styles/theme.css`: Theme-specific overrides
