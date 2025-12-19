# 🎨 Design Inspiration & Brand Guidelines

## 🌟 Visual Identity & "Vibe"
*This section defines the core personality of the Travel Assistant.*

* **Core Aesthetic**: **Modern Professional** — Clean lines, high whitespace, subtle shadows, and a focus on clarity over decoration. 
* **Design Anchors**: 
    * **Trust**: Use rounded corners (`rounded-xl`) and soft borders to feel approachable and safe for financial transactions.
    * **Speed**: Use motion-safe transitions and skeleton loaders to feel performant and responsive.
    * **Transparency**: No hidden information; use clear "Total Price" labels and explicit breakdown tooltips to build user confidence.

---

## 📍 Competitive North Stars
*Websites the Design Architect should audit using Playwright to gather layout and UX inspiration.*

| Platform | What to Emulate | Why it Works |
| :--- | :--- | :--- |
| **Airbnb** | Search & Filters | Excellent use of white space and intuitive category icons for easy navigation. |
| **Linear.app** | Professional UI | High-density information that remains readable, fast, and keyboard-accessible. |
| **Kayak** | Comparison Logic | Clear hierarchy of "Cheapest" vs "Fastest" vs "Best" flight options. |
| **Claude** | Chat experience | Intuitive chat experience that feels like a companion. |
| **Tripsy** | Itinerary logic | Ability to build itineraries for trips. |
---

## 🛠️ Design System Tokens
*Specific Tailwind-friendly constraints to ensure visual consistency across all agents.*

* **Primary Palette**: 
    * `brand-primary`: `#1E40AF` (Deep Travel Blue) - Represents stability and trust.
    * `brand-accent`: `#F59E0B` (Sunset Orange) - High visibility for primary CTAs like "Book Now."
* **Typography**: 
    * **Headings**: Sans-serif (Inter/Geist), bold, tight tracking for a premium feel.
    * **Data/Prices**: Tabular numbers (monospaced) for easy price comparison in vertical lists.
* **Layout**: 
    * **Mobile-First**: All components must be designed for a `375px` width before scaling to desktop.
    * **The Grid**: Use a 4px/8px baseline grid for all padding/margin (Tailwind’s default spacing scale).

---

## 💡 UX Laws & Heuristics
*Core psychological rules the Design Architect must follow during the Design Lifecycle.*

1.  **Hick’s Law**: Reduce the number of choices during the flight booking flow. If there are too many options, use "Recommended" tags to guide the user.
2.  **Peak-End Rule**: The final confirmation screen should be the most visually rewarding part of the app (use success icons and celebratory colors).
3.  **Doherty Threshold**: Provide visual feedback (spinners/shimmers) within 400ms of any user action to maintain the "flow" state.

---

## 📸 Capture & Audit Instructions
*Instructions for the Design Architect on how to process external inspiration.*

* **Audit Protocol**: "When provided with a URL, run `screenshot(fullPage=true)` and extract the computed CSS for primary buttons, card containers, and navigation. Map these to our local Tailwind config."
* **Consistency Check**: "Before proposing a new UI element, verify it fits the 'Modern Professional' aesthetic defined in this file. Reject any designs that feel cluttered or use inconsistent color palettes."