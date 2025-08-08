### The Boring Onboarding

Open-source onboarding micro-app used across The Boring Education products. Built with React, TypeScript, Vite, and Tailwind CSS. It renders dynamic multi-step onboarding flows driven by a product configuration, with username availability checks, progress, and clean UX.

— Minimal to embed, easy to extend.

---

### Features
- **Product-driven schema**: Define products and fields in `src/config/products.ts` and the UI renders automatically.
- **Dynamic steps**: Steps are inferred from the fields’ `step` numbers.
- **Prefill from user**: Fields can prefill using the fetched `User` data.
- **Username availability**: Debounced availability checks with helpful UI states.
- **Light, fast stack**: React 18 + Vite + TypeScript + Tailwind.

---

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Quality**: ESLint, Husky (pre-commit), lint-staged

---

### Getting Started

Prerequisites:
- Node.js >= 18
- npm (or pnpm/yarn)

Install:
```bash
npm install
```

Environment:
Create a `.env` (or `.env.local`) in the project root with:
```bash
VITE_API_BASE_URL=https://api.example.com
```

Run locally:
```bash
npm run dev
```

Type-check, lint, and build:
```bash
npm run type-check
npm run lint
npm run build
npm run preview
```

---

### How it Works

Route: the app mounts at `/` and reads query params:
- `userId` (required): The user to onboard
- `from` (optional): Product ID (defaults to `webapp`)
- `redirect` (optional): URL to redirect on success (defaults to `/`)
- `token` (optional): Bearer token for API requests

Example:
```
http://localhost:5173/?userId=123&from=webapp&redirect=%2Fdashboard&token=YOUR_JWT
```

Key files:
- `src/config/products.ts`: Product configuration (fields, API endpoint, payload transform, UI branding)
- `src/hooks/useOnboarding.ts`: Fetch user, step control, validation, submission
- `src/components/OnboardingLayout.tsx`: Layout, progress, primary actions
- `src/components/OnboardingForm.tsx`: Field renderer (text, email, url, select, multiselect, tel)
- `src/utils/api.ts`: Thin API layer (fetch user, check username, submit onboarding)

Data flow:
1) On load, user data is fetched: `GET /user?userId=...`.
2) Form is prefilled using product field config.
3) Username checks hit `GET /user/onboarding?userName=...`.
4) Submit payload is shaped by `transformPayload` and sent to the configured endpoint.

---

### Extending

Add or modify a product in `src/config/products.ts` under `PRODUCT_CONFIGS`:
- Define fields with `createField(name, label, type, step, options)`
- Provide `api.endpoint` (string or function) and `api.transformPayload(form, userId)`
- Customize `ui.branding.title` and `ui.branding.subtitle`

Field types supported: `text`, `email`, `url`, `select`, `multiselect`, `tel`.

Tips:
- Use `checkAvailability: true` on a field like `userName` to enable availability checks.
- Use `prefill.fromUser` to derive defaults from the fetched `User`.
- Steps are just numbers; multiple fields can share the same step.

---

### Project Structure
```
src/
  components/
    OnboardingForm.tsx
    OnboardingLayout.tsx
  config/
    products.ts
  hooks/
    useOnboarding.ts
  pages/
    Onboarding.tsx
  utils/
    api.ts
```

Assets like the logo live in `src/assets/`. You can replace `logo.svg` and add icons as needed.

---

### Scripts
- `npm run dev`: Start dev server
- `npm run build`: Type-check and build for production
- `npm run preview`: Preview the production build
- `npm run type-check`: TypeScript check only
- `npm run lint`: Lint
- `npm run lint:fix`: Lint with autofix

Husky runs lint-staged + lint fix on pre-commit.

---

### Contributing
Contributions are welcome! Please:
1) Fork the repo and create a feature branch
2) Write clear, maintainable code with tests where meaningful
3) Run type-check, lint, and build before opening a PR
4) Describe the change and rationale in the PR

By contributing, you agree to license your contributions under the project’s license.

---

### License
MIT © The Boring Education

See `LICENSE` (or include one in your fork/PR if missing).

---

### Security
If you discover a vulnerability, please email the maintainers or open a private issue if available. Do not disclose publicly until we’ve had a chance to fix it.

---

### Acknowledgements
Thanks to the open-source community and the React/Vite/Tailwind ecosystems for the fantastic tooling.