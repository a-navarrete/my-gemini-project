# 📚 UI Component Library: Travel Assistant

## 🎯 Purpose
This library defines the atomic and molecular components of the AI Travel Assistant. All agents must prioritize using these patterns to maintain a **High-Trust, Professional** aesthetic. This document ensures the Implementer uses the exact classes approved by the Design Architect.

---

## 🔘 1. Core Actions (Buttons & Links)

| Component | Tailwind Classes | Usage Context |
| :--- | :--- | :--- |
| **Primary CTA** | `bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md focus:ring-4 focus:ring-blue-300` | "Book Now," "Search Flights," "Confirm Payment" |
| **Secondary** | `bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg focus:ring-4 focus:ring-gray-100` | "View Details," "Modify Search," "Back" |
| **Ghost/Text** | `text-blue-600 hover:text-blue-800 hover:underline font-medium p-2 transition-colors` | "See more flights," "Terms & Conditions" |

---

## 💳 2. Data Display (The Travel Card)
*The fundamental building block for results and itineraries.*

### **Flight Result Card**
- **Container**: `bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer`
- **Typography Hierarchy**:
    - **Price**: `text-2xl font-bold text-gray-900` (Always prominent)
    - **Times**: `text-lg font-semibold text-gray-800`
    - **Duration/Stops**: `text-sm text-gray-500 font-medium`
- **Sub-elements**:
    - **Badge**: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`
    - **Badge-Cheapest**: `bg-green-100 text-green-800`
    - **Badge-Fastest**: `bg-blue-100 text-blue-800`

---

## 🔍 3. Inputs & Filters
*Designed for mobile-friendly interactions.*

- **Location Input**: `w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`
- **Date Picker Trigger**: `flex items-center space-x-2 text-gray-700 border border-gray-300 rounded-lg p-3 hover:border-blue-400 bg-white`
- **Filter Chip (Active)**: `px-4 py-1.5 bg-blue-100 border border-blue-600 rounded-full text-sm text-blue-700 font-medium`
- **Filter Chip (Inactive)**: `px-4 py-1.5 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 bg-white`

---

## ⏳ 4. Feedback & State Components
*Ensuring stability and user confidence during API latency.*

### **The Skeleton Loader**
- **Animation**: `animate-pulse`
- **Shapes**:
    - **Text line**: `h-4 bg-gray-200 rounded w-3/4 mb-4`
    - **Icon Placeholder**: `h-10 w-10 bg-gray-200 rounded-full`
    - **Main Card Block**: `h-40 bg-gray-100