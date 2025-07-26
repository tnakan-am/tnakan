# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (runs on port 4100, not 4200)
npm start

# Build for production
npm run build

# Run tests
npm test

# Watch mode for development builds
npm run watch
```

## Project Architecture

This is an Angular 19 e-commerce application called "Tnakan" that integrates with Firebase for backend services.

### Tech Stack

- **Frontend**: Angular 19 with Angular Material, TailwindCSS, and SCSS
- **Backend**: Firebase (Firestore, Authentication, Storage, Analytics)
- **Testing**: Karma + Jasmine
- **State Management**: RxJS observables with services
- **Internationalization**: ngx-translate with support for English, Armenian, and Russian
- **UI Components**: Angular Material, ngx-owl-carousel-o, animate.css

### Key Application Structure

The application follows a modular Angular architecture with these main areas:

#### User Types & Access Control

- **Customer**: Regular users who can browse and purchase products
- **Business**: Sellers who can manage products, orders, and advertisements
- **Admin**: System administrators who approve products and ads

Routes are protected using `AuthGuard` and `permissionsGuard(Type)` based on user type.

#### Core Features

- **Product Management**: Full CRUD for products with approval workflow
- **Order Management**: Order creation, tracking, and management for both customers and businesses
- **Authentication**: Firebase Auth with email verification
- **Shopping Cart**: Basket functionality with product availability tracking
- **Reviews & Ratings**: Product review system with average ratings
- **Advertisement System**: Business users can create ads that require admin approval

#### Service Architecture

- **ProductsService** (`src/app/shared/services/products.service.ts`): Handles all product operations including CRUD, approval, availability updates, and querying by various criteria
- **FirebaseAuthService** (`src/app/shared/services/firebase-auth.service.ts`): Manages authentication, registration, login/logout
- **UsersService**: User profile management and data persistence
- **BasketService**: Shopping cart functionality
- **OrderService**: Order processing and management

#### Routing Structure

- `/` - Home page with product carousels
- `/product/:id` - Individual product pages
- `/seller/:id` - Seller profile pages
- `/basket` - Shopping cart
- `/profile/customer` - Customer dashboard with order history
- `/profile/business` - Business dashboard with products, orders, and ad management
- `/admin` - Admin panel for approving products and ads
- `/settings` - User settings and profile management

### Firebase Configuration

The application uses multiple Firebase services:

- **Firestore**: Product, user, and order data
- **Authentication**: User management with email verification
- **Storage**: Image uploads for products and user profiles
- **Analytics**: Usage tracking
- **Realtime Database**: Additional real-time features

Firebase config is in `src/app/app.config.ts` with project ID `tnakan-23490`.

### Development Notes

- The dev server runs on port 4100 (configured in package.json)
- Uses Angular standalone components with lazy loading for most routes
- Implements responsive design with TailwindCSS and Angular Material
- Supports multiple languages through ngx-translate
- Uses Prettier and Husky for code formatting and git hooks
- Product availability can be set to "unlimited" or specific quantities
- The application includes an admin approval workflow for products and advertisements

### Testing

Run tests with `npm test` which uses Karma and Jasmine. The test configuration includes Angular Material theming and proper asset handling.

### Deployment

The application is configured for Firebase Hosting deployment. Use `firebase deploy` after building the project.
