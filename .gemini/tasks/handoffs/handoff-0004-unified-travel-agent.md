# Design Handoff: Unified Travel Agent (MVP)

- **Feature ID**: 0004
- **PRD**: [tasks/prd/0004-prd-unified-travel-agent.md](../prd/0004-prd-unified-travel-agent.md)
- **Design Principles**: Adhere strictly to `.gemini/design-inspo.md` and `.gemini/ui-library.md`.

---

## 1. Primary Component: `PackageResultCard`

This component is the core of the UI. It displays a combined flight and hotel option. It must be data-heavy but clean, adhering to the "Modern Professional" aesthetic.

### Structure & Tailwind Classes

```jsx
// web/src/components/PackageResultCard.js

const PackageResultCard = ({ package }) => {
  // package object contains flight and hotel details
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      
      {/* Header with Price Trend */}
      <div className="p-4 bg-gray-50/75 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">{package.name || 'Weekend in Napa'}</h3>
        {/* Price Trend Indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-green-600">Good time to buy!</span>
          {/* Simple graph icon placeholder */}
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 2 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
      </div>

      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flight Details Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Flight</h4>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">{package.flight.airline}</div>
            <div>
              <p className="font-semibold text-gray-900">{package.flight.from} → {package.flight.to}</p>
              <p className="text-sm text-gray-600">{package.flight.flightNumber}</p>
            </div>
          </div>
        </div>

        {/* Hotel Details Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Hotel</h4>
           <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-gray-900">{package.hotel.name}</p>
              <p className="text-sm text-gray-600">{package.hotel.rating}-star property</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Pricing and CTA */}
      <div className="p-4 bg-gray-50/75 border-t border-gray-200 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Total package price</p>
          <p className="font-mono text-2xl font-bold text-gray-900">${package.totalPrice}</p>
        </div>
        <button className="bg-brand-accent hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md focus:ring-4 focus:ring-yellow-300">
          Book Package
        </button>
      </div>
    </div>
  );
};
```

---

## 2. State-Specific Designs

### Loading State
-   **Action**: While the backend searches for packages, the `Chatbot.js` component should render 2-3 instances of a "Skeleton" `PackageResultCard`.
-   **Implementation**: Use the `animate-pulse` class. Replace text and image placeholders with `bg-gray-200` divs of appropriate sizes, as defined in `.gemini/ui-library.md`.

### Empty & Error States
-   **Action**: If no packages are found or an API error occurs, the agent should return a standard text message in a normal chat bubble.
-   **Example (Empty)**: "I couldn't find any flight and hotel packages for those dates. Would you like to try searching for just flights?"
-   **Example (Error)**: "Sorry, I'm having trouble connecting to one of our booking partners. Please try again in a few minutes."
