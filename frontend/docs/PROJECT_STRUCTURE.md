# Frontend Source Structure

This React/Vite frontend uses a domain-oriented structure. Keep files close to the feature or responsibility they serve, and prefer lowercase folder names.

```text
src/
  assets/          Static images, icons, and media imported by the app
  components/      Reusable UI components shared by multiple pages
    auth/          Shared authentication UI components
  constants/       Static content, options, labels, and reusable config values
  pages/           Route-level screens grouped by product area
    admin/         Admin management pages and admin-only routes
    auth/          Shared authentication and route-guard pages
    customer/      Customer booking and account pages
    dashboards/    Dashboard pages
    feedback/      Feedback pages
  services/        API access functions grouped by backend domain
    admin/         Admin and management APIs
    auth/          Login, registration, verification, and password APIs
    customer/      Flight search, booking, payment, ticket, and profile APIs
  styles/          Global and page/component CSS files
  App.jsx          Route definitions and top-level app composition
  main.jsx         Vite/React entry point
```

## Conventions

- Put route screens in `pages/<domain>/`.
- Put reusable visual pieces in `components/`.
- Put API calls in `services/<domain>/`; do not call `axios` directly from pages unless there is no existing service boundary.
- Put shared static data in `constants/`.
- Put CSS files in `styles/` and import them from the component or page that owns the styling.
- Use PascalCase for React component filenames and exported component names.
- Keep route protection in `pages/auth/ProtectedRoute.jsx` so role behavior remains centralized.
