# MyKitchen - Figma Design Brief & App Prototype

## 📱 Prosjekt Overview

**App navn**: MyKitchen  
**Platform**: iOS/Android (Mobile-first app)  
**Formål**: Smart kjøleskapsapp som hjelper deg planlegge middag basert på det du har hjemme  
**Følelse**: Varm, leken, hjemmekjølig - som å åpne kjøleskapet hos en venn

---

## 🎯 Kjerneappet Flow

```
Splash Screen (1-2 sek)
    ↓
Hjem / Kjøleskap (Main Screen)
    ↓ (swipe eller meny)
    ├─ Oppskrifter (Recipes)
    ├─ Handleliste (Shopping List) 
    └─ Innstillinger (Settings)
```

---

## 🎨 Design System

### Fargepalett
```
Primær (Varm):
  - Orange: #FF9F43
  - Amber: #FFA500
  - Coral: #FF6B5B (accent for varsel)

Sekundær:
  - Cream/Off-white: #FFFBF7
  - Light Orange: #FFE5CC

Neutrals:
  - Dark: #2C3E50
  - Gray: #95A5A6
  - Light Gray: #ECF0F1
  - Background: #FAFAF8 (warm off-white)
```

### Typografi
```
Font: SF Pro Display (iOS) / Roboto (Android)

Heading XL: 32px, Bold, #2C3E50
Heading L: 24px, Bold, #2C3E50
Heading M: 18px, Semi-bold, #2C3E50
Body: 16px, Regular, #2C3E50
Caption: 12px, Regular, #95A5A6
```

### Spacing & Grid
```
Base unit: 8px
Padding: 16px (mobile), 24px (tablet)
Corner radius: 12px (standard), 20px (pills), 24px (large)
Shadow: soft (0 2px 8px rgba(0,0,0,0.08))
```

---

## 📲 Skjerm 1: Splash Screen

**Varighet**: 1-2 sekunder  
**Animasjon**: Logo slides down, text fades in

```
[Midten av skjermen]
  🧊 logo (stor, 120px)
     ↓ (slides down)
  "MyKitchen" (tekst fades in)
  "Hva skal vi lage i dag?" (subtitle)

[Background]: Gradient from cream (#FFFBF7) to light orange (#FFE5CC)
```

---

## 📲 Skjerm 2: HOME / KJØLESKAP (Main Screen)

**Innhold**: Kjøleskapet ditt med ingredienser organisert i hyller

### Layout (Top to Bottom):

#### A. Header
```
[Hamburgermeny] 🧊 MyKitchen [Innstillinger ⚙️]
─────────────────────────────────
"Kjøleskapet ditt"
[Search bar] 🔍
```

#### B. Fridge Sections (Scrollable vertikal list)

Tre seksjoner, hver som et "etagekort":

**Øverste hylle** 🧈
┌─────────────────────────────────┐
│ 🧈 Øverste hylle        (4)     │
├─────────────────────────────────┤
│ [melk ✕] [ost ✕] [smør ✕]      │
│ [egg ✕]                         │
└─────────────────────────────────┘

**Midthylle** 🥛
┌─────────────────────────────────┐
│ 🥛 Midthylle            (3)     │
├─────────────────────────────────┤
│ [juice ✕] [yoghurt ✕]          │
│ [melk ✕]                        │
└─────────────────────────────────┘

**Grønnsakskuff** 🥬
┌─────────────────────────────────┐
│ 🥬 Grønnsakskuff        (5)     │
├─────────────────────────────────┤
│ [tomat ✕] [salat ✕] [løk ✕]    │
│ [paprika ✕] [agurk ✕]          │
└─────────────────────────────────┘

**Design detaljer:**
- Card: background: cream (#FFFBF7), border: 1px orange (#FFD4A3)
- Hver vare: pill med gradient (cream → light orange)
- Icons er emoji (🧈 🥛 🥬)
- Tap på ✕ → item slides out & disappears (animation 300ms)

#### C. Add Item Button (Floating eller bottom)

```
┌─────────────────────────────────┐
│ + Legg til vare                 │
│ [Input: "f.eks. melk..."]       │
│ [Dropdown: Hylle/Midt/Grønt]    │
│ [Legg tilButton - Orange]      │
└─────────────────────────────────┘

Animation: Input slides up, focus ring pulses orange
```

#### D. Bottom Stats

```
Du har 12 varer i kjøleskapet
[Button: "Foreslå middager →"]
```

### Animasjoner på denne skjermen:
- Screen load: Fridge sections slide in from bottom (staggered, 100ms between)
- Add item: Input field slides up from bottom
- Item delete: Fade out + slide left (200ms)
- Navigation: Smooth fade transition (300ms)

---

## 📲 Skjerm 3: OPPSKRIFTER (Recipes)

**Innhold**: 3 AI-genererte oppskrifter basert på dine ingredienser

### Layout:

#### A. Header
```
👨‍🍳 Middagsforslag
"Basert på det du har - prioriterer varer som snart går ut"
[Refresh button] 🔄
```

#### B. Recipe Cards (Scrollable)

Hver oppskrift er ett stort card som du kan scrolle gjennom:

```
┌─────────────────────────────────────────────┐
│ 1. Klassisk omelett med tomat               │
│ En enkel og rask omelett...                 │
│                                             │
│ ⏰ Bruker opp: melk, egg, tomat            │
│    (rødt highlight - snart ut på dato)    │
│                                             │
│ Ingredienser du har:                       │
│ [egg] [melk] [tomat]                       │
│                                             │
│ Må kjøpes:                                  │
│ [salt] [pepper] [smør] [olje]              │
│                                             │
│ Framgangsmåte:                              │
│ 1. Visp sammen egg med melk...              │
│ 2. Smelt smør i panne...                    │
│ ... (5-6 steg kort og praktisk)             │
│                                             │
│ [❤️ Lagre] [🛒 Legg til handleliste]      │
└─────────────────────────────────────────────┘

[Scroll til neste oppskrift]
```

**Design detaljer:**
- Card shadow: større (0 4px 16px) - løftet følelse
- Ingredienser du har: orange pills
- Må kjøpes: gray pills
- "Bruker opp" (expiring): rød banner med warning icon
- Tekst er lett leselig (16px body)

### Animasjoner:
- Card load: Slide up + fade in (400ms ease-out)
- Scroll transition: Smooth parallax effect
- Button hover: Scale 1.05, shadow increase
- Like/save: Heart animates (pulse effect)

---

## 📲 Skjerm 4: HANDLELISTE (Shopping List)

**Innhold**: Automatisk generert handleliste fra manglende ingredienser

### Layout:

```
┌─────────────────────────────────────────────┐
│ 🛒 Handleliste                              │
│ [Sortér: Butikk] [Sortér: Kategori] ▼      │
├─────────────────────────────────────────────┤
│                                             │
│ REMA 1000 (5 varer)                         │
│ ☐ Salt (kr 25)                              │
│ ☐ Pepper (kr 35)                            │
│ ☐ Smør (kr 89)                              │
│                                             │
│ BUNNPRIS (3 varer)                          │
│ ☐ Melk 1L (kr 22)                           │
│ ☐ Brød (kr 35)                              │
│                                             │
│ [Totalpris: kr 206]                         │
│                                             │
│ [✓ Kjøp alt] [📤 Del liste]                │
└─────────────────────────────────────────────┘

Animation: 
  - List items slide in when checked (swipe left)
  - Store names accordion expand/collapse
  - Price updates when item checked
```

---

## 📲 Skjerm 5: INNSTILLINGER (Settings)

```
┌─────────────────────────────────────────────┐
│ ⚙️ Innstillinger                            │
├─────────────────────────────────────────────┤
│                                             │
│ 👤 Profil                                   │
│ [Navn] [Avatar]                             │
│                                             │
│ 🍽️ Preferanser                              │
│ [Allergier/Preferanser]                     │
│ [Matvaner: Vegetar/Veganer/Omnivore]       │
│                                             │
│ 🔔 Notifikasjoner                           │
│ [Toggle: Varer går snart ut]                │
│ [Toggle: Oppskrift-forslag]                 │
│                                             │
│ 📱 App                                      │
│ [Versjon 1.0]                               │
│ [Feedback] [Om oss]                         │
│                                             │
│ [Logg ut]                                   │
└─────────────────────────────────────────────┘
```

---

## 🎬 Navigation & Transitions

### Bottom Tab Bar (iOS style)
```
┌────────────────────────────────────────────┐
│ 🏠 Hjem   👨‍🍳 Oppskrifter   🛒 Liste   ⚙️ Meny │
└────────────────────────────────────────────┘

Active tab: Orange highlight, slight scale increase
Inactive: Gray

Transition between tabs: Fade + slide (200ms ease-out)
```

### Animasjon Guidelines:
```
Standard transitions: 200-300ms
Easing: ease-out (smooth deceleration)
Entrance: Fade + slide up (from bottom)
Exit: Fade out + slide down
Micro-interactions: 100-150ms (button press, toggles)
```

---

## 🎭 Key Interactions

### 1. Legg til vare (on home screen)
```
User taps [+ Legg til vare]
  → Input field slides up from bottom (300ms)
  → Focus ring pulses orange (pulse animation 1s loop)
  → User types "melk"
  → Selects shelf from dropdown
  → Taps [Legg til]
  → Input clears, varen slides inn i riktig shelf (200ms)
```

### 2. Slett vare
```
User taps [✕] på item
  → Item background changes to light red (100ms)
  → Item slides out left + fades (300ms)
  → Item removed from shelf
```

### 3. Generate Recipes
```
User taps [Foreslå middager]
  → Button animates (scale 0.95 on press)
  → Loading spinner appears (smooth rotating animation)
  → Text: "Tenker på gode oppskrifter..." (pulsing text)
  → ~3-5 sek waiting
  → Recipe cards slide up in (staggered, 100ms between)
```

### 4. Tab Navigation
```
User swipes left/right OR taps tab
  → Current screen fades out (150ms)
  → New screen fades in (150ms)
  → Tab indicator slides to new tab (200ms)
```

---

## 📐 Component Library (for Figma)

Create these reusable components:

1. **Button**
   - Variant: Primary (orange), Secondary (outline), Tertiary (text)
   - States: Default, Hover, Pressed, Disabled

2. **Card**
   - Background: cream
   - Border: light orange
   - Shadow: soft
   - Padding: 16px

3. **Ingredient Pill**
   - Shape: Rounded (20px)
   - Has: [icon] [text] [close button]
   - Colors: Orange gradient, Gray (for "to buy")

4. **Input Field**
   - Border: 2px orange on focus
   - Placeholder: gray text
   - Icon: inside field

5. **Shelf Card** (for fridge items)
   - Title + emoji
   - Item count badge
   - Scrollable pill list inside

6. **Recipe Card**
   - Large, full-width
   - Multiple sections (title, description, ingredients, steps)
   - Buttons at bottom

7. **Bottom Tab Bar**
   - 4 tabs
   - Active state: orange highlight
   - Smooth transition between tabs

---

## 🌈 Visual Vibes - Reference

Think of this app as:
- **Color**: Warm kitchen aesthetic (orange, cream, natural light)
- **Movement**: Smooth, intentional animations (not bouncy)
- **Typography**: Clean, readable, Norwegian-friendly
- **Spacing**: Generous, breathing room
- **Icons**: Mix of emoji (for warmth) + minimal icons (for clarity)
- **Shadows**: Soft, subtle (not harsh)

---

## ✅ Prototype Checklist for Figma

- [ ] Create color style library (6 main colors)
- [ ] Create typography styles (6 variants)
- [ ] Design splash screen (1-2 second animation)
- [ ] Design home/fridge screen (all 3 shelves)
- [ ] Design recipe screen (1 full recipe card)
- [ ] Design shopping list screen
- [ ] Design settings screen
- [ ] Create bottom tab bar component
- [ ] Design all buttons (primary, secondary, tertiary)
- [ ] Create ingredient pill component
- [ ] Design micro-interactions:
  - [ ] Add item flow
  - [ ] Delete item animation
  - [ ] Tab navigation transition
  - [ ] Loading state
- [ ] Test flow: Home → Recipes → Shopping List → Settings → Home

---

## 🎬 How to Use This Brief in Figma

1. **Create a new Figma file** called "MyKitchen Prototype"
2. **Set up design system**:
   - Colors (create color library)
   - Typography (create text styles)
   - Spacing/Grid (create constraints)
3. **Create frames for each screen** (iPhone 14 template, 390x844px)
4. **Design screens in order**:
   - Splash
   - Home/Fridge
   - Recipes
   - Shopping List
   - Settings
5. **Create interactive prototypes**:
   - Link screens together
   - Add micro-interactions (animations)
   - Test the flow
6. **Add annotations** describing animations/interactions
7. **Export and share** for handoff to development

---

## 💡 Extra Ideas (Optional)

- Swipe gestures on recipe cards (left to reject, right to like)
- Animated ingredient counter (numbers count up when loaded)
- Pull-to-refresh on recipes
- Haptic feedback on button press (if native)
- Dark mode toggle (optional)
- Onboarding flow (first time user)

---

## 🚀 Next Steps

1. **Design this prototype in Figma** (use this brief as guide)
2. **Validate the flow** - Does it feel smooth?
3. **Get feedback** - Show it to friends
4. **Hand off to development** - Use Figma's dev mode for handoff
5. **Build the real app** - React Native or Flutter

Good luck! 🧊✨
