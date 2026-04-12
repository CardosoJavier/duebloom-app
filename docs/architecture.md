# DuoBloom — Architecture & Code Standards

> Living document. Last updated: April 2026.
> All rules are **mandatory** for pre-production work. No exceptions without a documented decision.

---

## Directory Structure

```
/app               Screens only (Expo Router file-system routing)
/components
  /ui              GlueStack primitive wrappers — NO store imports, receive state as props
  /<domain>/       Views — composite components, may own useQuery and store reads
/api               I/O-only functions — ALL return ApiResult<T>
/constants         App-wide constants: theme.ts, query-keys.ts
/types             ALL types and interfaces (zero local definitions allowed)
/store             Zustand (client/UI state only)
/services          Everything else: pure utils, formatters, converters, platform integrations
/hooks             Custom React hooks (mutations, side effects, complex subscriptions)
/schema            SQL: tables, RLS, policies, functions, indexes — versioned (table_name_vN.sql)
/i18n              Localization JSON files + index
/docs              Architecture docs, ADRs, process docs
/assets
/scripts
```

---

## Layer Rules

### `/app` — Screens

- File-system routes (Expo Router). One screen per file.
- No business logic, no direct API calls.
- Composes Views and, when necessary, standalone UI components.
- Route params are typed in `/types/navigation.ts`.

### `/components/ui` — Primitives

- Thin wrappers around GlueStack components, styled with NativeWind/TVA.
- **MUST NOT** import from `/store`. State arrives via props.
- **MUST NOT** import from `/api` or `/services` (except pure type imports).
- Props interface exported, defined in `/types/ui.ts`.

### `/components/<domain>` — Views

- Composite components that represent a feature area (today, meals, progress, profile, auth).
- May import from `/store`, `/api`, `/hooks`, `/services`.
- May own `useQuery` calls for their own data needs (connected widget pattern is acceptable).
- Props interface exported and defined in the corresponding `/types/<domain>.ts`.

### `/api` — Data Access

- Pure I/O: reads and writes to Supabase (or future external APIs).
- **Every function MUST return `ApiResult<T>`** from `/types/api.ts`.
- No business logic, no Zod validation, no UI side effects.
- Never imports from `/components`, `/store`, `/hooks`.
- Imports `supabase` from `@/services/supabase`.

### `/services` — Utilities & Platform

- Stateless pure functions: date helpers, weight conversions, stat formatters, BMR calculators.
- Platform-integrated modules: HealthKit / Health Connect wrapper.
- Houses the Supabase client (`services/supabase.ts`).
- No React imports, no store imports.

### `/types` — Type Definitions

- **Every** `interface`, `type`, Zod schema, and Props interface lives here.
- Organized by domain: `meals.ts`, `progress.ts`, `streaks.ts`, `user.ts`, `api.ts`, `ui.ts`, `components.ts`, etc.
- No local type definitions anywhere in the codebase — not in components, not in APIs, not in services.

### `/store` — Client State

- Zustand only. Two stores: `authStore` (session) and `appStore` (theme/language).
- **Zustand = client/UI state**: auth session tokens, theme preference, language, UI flags.
- **Server state = TanStack Query**: partner data, meals, streaks, stats, settings.
- Store actions call functions from `/api` directly (stores are not hooks, circular-dep avoidance handled at import level).

### `/hooks` — Custom Hooks

- Wrap `useMutation` for all write operations (no raw async handler calls in components).
- Complex subscription logic (polling, HealthKit, event-based) belongs here.
- Naming: `use<FeatureNoun>.ts` (e.g. `useCheckIn.ts`, `useImagePicker.ts`).

---

## Data Fetching Rules

### TanStack Query — Reads

- All `useQuery` / `useInfiniteQuery` calls reference keys from `@/constants/query-keys.ts`.
- `staleTime` must be explicitly set (default `0` is not acceptable for production).
- Connected widgets (e.g. `MealsSummaryWidget`) are allowed to own their own `useQuery`.
- After a mutation that affects a query, call `queryClient.invalidateQueries({ queryKey: QueryKeys.xxx() })`.

### TanStack Query — Writes

- All mutations use `useMutation` inside a hook in `/hooks`.
- No raw `await api.doXxx()` calls inside component event handlers.
- Mutation hooks expose: `mutate`, `isPending`, and the result/error via the standard TanStack interface.

### Sample useQuery pattern

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: QueryKeys.mealsToday(user.id, todayStr),
  queryFn: async () => {
    const result = await getConsumedMeals(start, end);
    if (!result.success) throw result.error;
    return result.data;
  },
  enabled: !!user?.id,
  staleTime: 60_000,
});
```

---

## QueryKey Conventions

All query keys are defined in `/constants/query-keys.ts` as factory functions on the `QueryKeys` object.

```ts
// Pattern: QueryKeys.<noun>(<...args>)
QueryKeys.mealsToday(userId, dateStr);
QueryKeys.streakMonth(userId, fromDate, toDate);
QueryKeys.streakState(userId);
QueryKeys.statsSummary(userId, metric, unitSystem);
QueryKeys.partner(userId);
```

**Never** use inline string arrays as `queryKey`. Always import `QueryKeys`.

---

## Mutation Conventions

All write operations are wrapped in `useMutation` hooks in `/hooks`:

```ts
// hooks/useCheckIn.ts
export function useCheckIn(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (logDate: string) => {
      await logNutritionDay(userId, logDate);
      await updateStreakState(userId, logDate);
      await updateLastCheckInDate(userId, logDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.streakMonth(userId),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.streakState(userId),
      });
    },
  });
}
```

---

## Type Rules

- **Zero tolerance for local types**: no `interface` or `type` declarations inside component files, API files, store files, or service files.
- Props interfaces are exported and placed in the domain's `/types/<domain>.ts` file.
- Shared utility types (e.g. `ApiResult`, `AppError`) live in their own focused files.
- `Zod` schemas and their inferred types live in `/types/auth-schema.ts` (or domain equivalent).

---

## API Result Conventions

Every API function returns `ApiResult<T>` (from `/types/api.ts`):

```ts
// Success
return { success: true, data: result };

// Failure
return {
  success: false,
  error: { code: ErrorCode.UNKNOWN, message: err.message },
};
```

Never return ad-hoc `{ success, data?, error? }` shapes — always use `ApiResult<T>`.

---

## Store Contract

| Concern                                           | Where                                        |
| ------------------------------------------------- | -------------------------------------------- |
| Auth session (tokens, user object, flags)         | `authStore` (Zustand)                        |
| Theme + language preference                       | `appStore` (Zustand)                         |
| Partner profile data                              | TanStack Query (`QueryKeys.partner(userId)`) |
| All server data (meals, streaks, stats, settings) | TanStack Query                               |
| Navigation state                                  | Expo Router (file-system)                    |

---

## Naming Conventions

| Thing                | Convention                                               | Example                              |
| -------------------- | -------------------------------------------------------- | ------------------------------------ |
| Screen files         | `kebab-case.tsx`                                         | `confirm-email.tsx`                  |
| Component/View files | `PascalCase.tsx`                                         | `MealsSummaryWidget.tsx`             |
| Hook files           | `useCamelCase.ts`                                        | `useCheckIn.ts`                      |
| API files            | `kebab-case-api.ts`                                      | `meals-api.ts`                       |
| Service files        | `PascalCase.ts` for classes; `kebab-case.ts` for modules | `HealthSyncService.ts`, `date.ts`    |
| Type files           | `kebab-case.ts`                                          | `food-log.ts`                        |
| SQL schema files     | `table_name_vN.sql`                                      | `consumed_meals_v1.sql`              |
| Query keys           | `QueryKeys.<noun>(<args>)`                               | `QueryKeys.mealsToday(userId, date)` |

---

## File Naming — Components

All component files under `/components` use `PascalCase.tsx` with descriptive names that include their role:

- Modals: `*Modal.tsx` (e.g. `EditProfileModal.tsx`, `AppSettingsModal.tsx`)
- Views: `*View.tsx` (e.g. `StreakView.tsx`, `MacroCalculatorView.tsx`)
- Widgets: `*Widget.tsx` (e.g. `MealsSummaryWidget.tsx`, `HydrationWidget.tsx`)
- Cards: `*Card.tsx` (e.g. `ComparisonCard.tsx`, `NutritionStreakCard.tsx`)

---

## i18n Rules

- **Every user-visible string** must be a key resolved via `useTranslation()`.
- No hardcoded English strings anywhere in component JSX.
- Keys follow dot-notation by screen/feature: `meals.add_meal`, `profile.edit_title`.
- Both `en.json` and `es.json` must be updated simultaneously.

---

## SQL Schema Rules

- Every table must define: structure, enums, RLS policies, Supabase functions, indexes, and required security mechanisms.
- Files named `table_name_vN.sql` where N is the version.
- New versions create a new file (never modify a deployed version).

---

## Error Handling

- All API errors surface through `ApiResult<T>` — callers check `result.success`.
- View-level errors show a toast via `useAppToast` (`toast.error(t('...'))`).
- For unrecoverable states (e.g. expired session), `authStore.logout()` is called.
- See `docs/error-handling.md` for detailed patterns.

---

## Testing

- Unit tests in `__tests__/` mirroring the source structure.
- API tests mock the Supabase client.
- Component tests use `@testing-library/react-native`.
- Coverage target: 80% for API layer; 60% for components.
- See `docs/testing.md` for mock patterns and conventions.
