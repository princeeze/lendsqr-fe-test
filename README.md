# Lendsqr Frontend Test

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Architecture

- **Next.js 15** with App Router
- **React 19**
- **TypeScript**
- **SCSS** for styling

## Key Dependencies

- `@tanstack/react-query` for data fetching and caching
- `react-hook-form` with `zod` for form handling
- `clsx` for conditional class names
- `lucide-react` for icons

## Features

- Loading states with skeletons
- Local storage caching of user data
- Responsive design

## Configuration

- **SCSS Variables**: Imported globally via `next.config.ts` using `additionalData` option

```ts
const nextConfig = {
  sassOptions: {
    additionalData: `@use "@/styles/_variables.scss" as *;`,
  },
};
```

- **CSS Modules**: SCSS for component styling

## Development

1. Clone the repository:

   ```bash
   git clone https://github.com/princeeze/lendsqr-fe-test
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing Approach

- **Jest & React Testing Library** for component tests
- **Coverage reports** enabled

## Learn More

To learn more about Next.js, check out:

- [Next.js Documentation](https://nextjs.org/docs) - Official documentation.
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial.

## Deployment

Deployed on vercel at https://prince-eze-lendsqr-fe-test.vercel.app/
