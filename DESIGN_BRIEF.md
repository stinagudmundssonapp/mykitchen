# MyKitchen Design Brief

## Visual Identity

### Overall Feel
**Varm, leken, og clean** — en app som føles som å åpne et kjøleskap hjemme hos en venn. Ikke stiv eller kald, men heller ikke for kaotisk. Balanse mellom funksjonalitet og personlighet.

---

## Color Palette

### Primary Colors
- **Warm Orange/Amber**: `#FF9F43` eller `#FFA500`
  - Brukes for: Call-to-action buttons, highlights, varme elementer
  - Følelse: Energi, appetitt, varme
  
- **Soft Blue**: `#5B9BD5` eller `#4A90E2`
  - Brukes for: Secondary actions, informasjon
  - Følelse: Trust, calm
  
- **Cream/Off-white**: `#FFFBF7` eller `#FFF8F3`
  - Brukes for: Bakgrunn, cards
  - Følelse: Soft, warm, inviting

### Accent Colors
- **Light Green**: `#A8D5BA` (for friske ingredienser)
- **Warm Red**: `#E74C3C` (for varsel/expiring items)
- **Gold**: `#F39C12` (for highlights)

### Neutrals
- **Dark Gray**: `#2C3E50` (for tekst)
- **Medium Gray**: `#95A5A6` (for secondary tekst)
- **Light Gray**: `#ECF0F1` (for borders)

---

## Typography

### Font Choices
- **Heading**: Geist Sans Bold (already in use)
  - Varmt, moderne, litt leken
  
- **Body**: Geist Sans Regular
  - Leselig, vennlig

### Hierarchy
```
H1: 32px - 40px, Bold (app title, main sections)
H2: 24px - 28px, Bold (section headers, recipe titles)
H3: 18px - 20px, Semi-bold (card titles)
Body: 14px - 16px, Regular (content)
Small: 12px - 13px, Regular (labels, secondary info)
```

---

## Component Style Guide

### Cards & Containers
```
- Border-radius: 12px - 16px (not too sharp, not too rounded)
- Shadow: soft, subtle (0 2px 8px rgba(0,0,0,0.08))
- Padding: generous (16px - 24px)
- Background: #FFFBF7 or white
- Border: light gray or none
```

### Buttons
```
Primary Button:
  - Background: #FF9F43 (warm orange)
  - Text color: white
  - Padding: 12px 24px
  - Border-radius: 10px
  - Hover: slightly darker, subtle lift effect
  - Font-weight: 600

Secondary Button:
  - Background: transparent or light background
  - Text color: #FF9F43
  - Border: 2px solid #FF9F43
```

### Input Fields
```
- Border-radius: 10px
- Border: 2px solid #ECF0F1
- Padding: 12px 16px
- Font-size: 16px (mobile friendly)
- Focus state: border color changes to #FF9F43
- Placeholder text: #95A5A6 (lighter gray)
```

### Badges/Pills (for items in fridge)
```
- Border-radius: 20px (fully rounded)
- Padding: 8px 14px
- Background gradient: soft gradient (e.g., from #FFFBF7 to #FFE5CC)
- Text: #2C3E50
- Border: 1px solid #FFD4A3
- Icon size: small, cute
```

---

## Spacing & Layout

### Mobile First
- **Padding**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Margins between sections**: 16px - 24px
- **Gap between items**: 12px - 16px

### Visual Breathing Room
- Don't cram items together
- Use white/cream space intentionally
- Items should feel "floating" not cramped

---

## Tone of Voice in UI

### Language
- **Warm & personal**: "Hva har du i kjøleskapet?" not "Inventory Management"
- **Playful**: Use emojis thoughtfully (🧊 🥛 🧈 🥬 🍳)
- **Encouraging**: "Perfekt! Du har 5 varer" not just "5 items"
- **Norwegian first**: All copy should feel naturally Norwegian

### Microcopy Examples
```
✅ "La AI finne smakfulle middager for deg"
❌ "Generate recipes"

✅ "Opp, kjøleskap! 🧊"
❌ "Loading..."

✅ "Bruker opp disse varene (snart ut på dato)"
❌ "Expiring items"
```

---

## Interactive Elements

### Animations
- **Smooth, not bouncy**: easing-in-out-cubic
- **Duration**: 200-400ms for micro-interactions
- **Entrance animations**: subtle slide/fade (not spinning)
- **Hover states**: 10-15% color shift, slight shadow increase

### Loading States
- Soft spinner (not aggressive)
- Encouraging copy ("Tenker på gode oppskrifter...")
- Pulse/breathing animation, not spinning

### Transitions
- Page transitions: fade or subtle slide
- Drawer: smooth slide from left
- Modals/overlays: fade in/out

---

## Emoji & Icons Usage

### Emojis (used sparingly, with purpose)
- 🧊 App icon/header
- 🧈 Top shelf
- 🥛 Middle shelf
- 🥬 Vegetable drawer
- 👨‍🍳 Recipes section
- 🛒 Shopping list
- ⏰ Expiring items warning

### Icons (Lucide React)
- Keep same visual weight throughout
- Size: 18-24px typically
- Color: match the context (orange for actions, gray for secondary)

---

## Layout Grid

### Desktop (1024px+)
```
[Sidebar 200px] [Main Content 100%]
Main content in 2-column where applicable:
[Fridge 50%] [Recipes 50%]
```

### Tablet (640px - 1024px)
```
Single column, wider cards
Sidebar collapsible
```

### Mobile (< 640px)
```
Single column, full width
Drawer navigation
Bottom safe-area padding for notches
```

---

## Key Design Principles

1. **Warm over cold**: Orange/amber > pure blue
2. **Personal over corporate**: Emojis, friendly language > formal
3. **Clean over cluttered**: White space is your friend
4. **Playful over serious**: Slightly rounded corners, soft shadows
5. **Accessible**: Good contrast, large touch targets (44x44px min)
6. **Performance-aware**: Smooth animations, lazy loading

---

## Example Component: Fridge Item Pill

```
Container:
  - Background: linear-gradient(135deg, #FFFBF7 0%, #FFE5CC 100%)
  - Border: 1px solid #FFD4A3
  - Border-radius: 20px
  - Padding: 8px 14px
  - Box-shadow: 0 2px 6px rgba(255, 159, 67, 0.1)
  
Text:
  - Color: #2C3E50
  - Font-weight: 500
  - Font-size: 14px
  
Icon (delete):
  - Color: #FF9F43
  - Size: 16px
  - Hover: slightly darker
  
Hover state:
  - Shadow increases: 0 4px 12px rgba(255, 159, 67, 0.15)
  - Background: slightly more saturated
```

---

## Color Hex Reference (for Tailwind)

```
Primary Orange: #FF9F43
Secondary Blue: #5B9BD5
Cream: #FFFBF7
Dark Text: #2C3E50
Medium Gray: #95A5A6
Light Gray: #ECF0F1
Light Green: #A8D5BA
Warm Red: #E74C3C
Gold: #F39C12
```

Tailwind approximations:
```
Orange: between amber-400 and orange-500
Blue: sky-600 or blue-600
Cream: slate-50 with warmth
```

---

## Design Checklist

- [ ] All buttons are warm orange or secondary styled
- [ ] Cards have generous padding and subtle shadows
- [ ] Text hierarchy is clear (sizes differ by 4-6px)
- [ ] No element feels cramped or crowded
- [ ] Emojis used purposefully, not overly
- [ ] Animations are smooth and under 400ms
- [ ] Mobile touches are 44x44px minimum
- [ ] Warm color scheme dominates (orange > blue > green)
- [ ] Language is warm and encouraging
- [ ] Icon weights match across the app
