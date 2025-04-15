# EmployWise - Employee Management System

![EmployWise Logo](https://img.shields.io/badge/EmployWise-User%20Management-6366F1)

A modern, responsive React application for managing employee information with a beautiful UI that supports both light and dark modes.

## 🌟 Features

### Authentication
- **Secure Login System**
  - JWT-based authentication
  - Demo user credentials easily accessible
  - Loading state during authentication
  - User session management

### User Management
- **View Users**
  - Display users in responsive grid cards
  - Beautiful card UI with hover effects
  - User avatars and details clearly presented
  - Card animations on load and hover

- **Search Functionality**
  - Real-time search by name or email
  - Dedicated search bar with clear button
  - Search results counter
  - Empty state for no results

- **Pagination**
  - Server-side pagination support
  - First/Last page navigation
  - Current page indicator
  - Smooth transitions between pages

- **CRUD Operations**
  - Create new users (via API)
  - Update existing user information
  - Delete users with confirmation dialog
  - Loading indicators for all operations

### Navigation
- **Responsive Sidebar**
  - Desktop permanent sidebar
  - Mobile collapsible drawer
  - Elegant sidebar header with avatar
  - Active item highlighting

- **Multiple Views**
  - Dashboard view with system overview
  - Users management view
  - Settings view for theme configuration

### UI/UX Enhancements
- **Theme Support**
  - Toggle between light and dark modes
  - Theme-specific color schemes
  - Persistent theme preference
  - Smooth transitions between themes

- **Responsive Design**
  - Mobile-first approach
  - Adapts to all screen sizes
  - Optimized for both desktop and mobile
  - Touch-friendly interface

- **Visual Feedback**
  - Loading indicators for async operations
  - Success/error notifications
  - Hover effects on interactive elements
  - Animations for better user experience

- **Enhanced UI Components**
  - Custom styled Material-UI components
  - Gradient backgrounds and shadows
  - Animated icons and transitions
  - Consistent design language

## 🚀 Technical Highlights

### Frontend Architecture
- **React with TypeScript**
  - Type-safe component development
  - Interface definitions for data models
  - Strongly typed props and state

- **Material UI**
  - Comprehensive component library
  - Custom theme extensions
  - Responsive grid system
  - Icon integration

- **State Management**
  - Context API for global state
  - Local state for component-specific data
  - Custom hooks for shared logic
  - Optimized rendering

### Performance Optimization
- **Efficient Rendering**
  - Component memoization
  - Conditional rendering
  - Optimized list rendering
  - Transition animations

- **API Integration**
  - RESTful API consumption
  - Axios for HTTP requests
  - Error handling
  - Loading state management

## 🛠️ Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/employwise-app.git
cd employwise-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open the application
```
http://localhost:3000
```

### Demo Credentials
```
Email: eve.holt@reqres.in
Password: cityslicka
```

## 🎨 Design Decisions

### Color Palette
- **Light Mode**
- **Dark Mode**
  
### Layout
- Sidebar navigation with main content area
- Card-based UI for user management
- Clean, minimalist dashboard
- Modal dialogs for edit/delete operations

## 📱 Responsive Behavior
- **Desktop**: Full sidebar, multi-column grid
- **Tablet**: Collapsible sidebar, reduced columns
- **Mobile**: Drawer navigation, single column layout

## 🔄 Future Enhancements
- Advanced filtering options
- User role management
- Export data functionality
- Bulk operations
- More detailed analytics dashboard

---

Developed with ❤️ for EmployWise 
