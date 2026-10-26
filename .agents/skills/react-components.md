# Skill: React Component Architecture & Atomic Design

## When to Use This Skill
Use this skill when authoring, modifying, or refactoring React components, custom hooks, atomic design structures, or Tailwind CSS UI styles.

---

## 1. Atomic Design Architecture

This project strictly adheres to the Atomic Design methodology under [`src/components/`](file:///Users/cristi/Code/generic-map-with-pois/src/components/):

```
src/components/
├── atoms/       # Primitive, domain-agnostic UI elements
├── molecules/   # Simple compositions of atoms with targeted interaction
├── organisms/   # Complex feature units managing state, hooks, and domain logic
└── templates/   # Full-page layout frames assembling organisms
```

### Hierarchy Constraints
- **Atoms** must NEVER import Molecules, Organisms, or Templates.
- **Molecules** may import Atoms, but must NEVER import Organisms or Templates.
- **Organisms** may import Molecules and Atoms, and interact with custom hooks and domain models (`CustomRecord`).
- **Templates** assemble Organisms into application views (e.g., [`Viewport.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/components/templates/Viewport.tsx)).

---

## 2. Component Design Patterns

### 2.1 Atoms
- Extend native HTML element attributes using `React.ComponentProps<'element'>` or `React.ButtonHTMLAttributes`.
- Keep them stateless or limited to minimal internal UI state (e.g. tooltip visibility).
- Example: [`Button.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/components/atoms/Button.tsx):

```tsx
interface ButtonProps extends React.ComponentProps<'button'> {
  icon?: React.ReactNode
  variant?: 'default' | 'transparent'
}
```

### 2.2 Molecules
- Combine atoms for a unified interaction.
- Example: [`RecordDetails.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/components/molecules/RecordDetails.tsx), [`ButtonWithTooltip.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/components/molecules/ButtonWithTooltip.tsx).
- Pass callbacks (`onClose`, `onSelect`, `onClick`) up rather than coupling to global stores or network fetchers.

### 2.3 Organisms
- Connect hooks, state management, and lifecycle events.
- Handle data states: loading, error, empty, and populated.
- Examples:
  - [`MapControls.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/components/organisms/MapControls.tsx): Zoom buttons, refresh, conditional layers button and checkbox modal (when 2+ layers exist), and metadata modal.
  - [`SearchSection.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/components/organisms/SearchSection.tsx): Fuzzy search input and dataset selector.
  - [`ListView.tsx`](file:///Users/cristi/Code/generic-map-with-pois/src/components/organisms/ListView.tsx): Viewport-filtered POI drawer list.

---

## 3. Custom Hooks Conventions

All custom hooks reside in [`src/hooks/`](file:///Users/cristi/Code/generic-map-with-pois/src/hooks/):
- **Naming**: `use[Capability]` in camelCase.
- **Single Responsibility**: Each hook manages one distinct slice of state or logic.
  - `useMap`: Map instance, bounds, zoom status.
  - `useFetchData`: Safe data fetching (multiple datasets in parallel), error handling, validation.
  - `useURLParams`: Bidirectional synchronization with URL query parameters (`?api=`, `?api[]=`, `?selected=`, `?id=`).
  - `useKeyPress`: Global key listeners (e.g. `Escape` key listeners with cleanup).
- **Cleanup**: Always return cleanup functions in `useEffect` when subscribing to events, intervals, or timeouts.

---

## 4. Styling Conventions with Tailwind CSS

Utility classes must follow a consistent ordering pattern for maintainability:

1. **Layout & Display**: `flex`, `grid`, `block`, `relative`, `absolute`, `fixed`, `z-10`
2. **Box Model & Spacing**: `p-4`, `px-2`, `m-auto`, `space-y-2`, `gap-3`
3. **Sizing**: `w-full`, `max-w-md`, `h-10`, `min-h-0`
4. **Typography**: `text-sm`, `font-semibold`, `tracking-wide`, `text-center`
5. **Colors & Backgrounds**: `bg-white`, `text-gray-800`, `border-gray-200`
6. **Borders & Shapes**: `rounded-lg`, `border`, `shadow-md`
7. **Interactivity & States**: `hover:bg-gray-100`, `focus:ring-2`, `transition-all`, `cursor-pointer`
8. **Responsive Breakpoints**: `sm:flex-row`, `md:w-1/2`, `lg:hidden`

---

## 5. Prohibited Practices

1. **No Direct DOM Mutation**: Never manipulate the DOM directly (e.g. `document.getElementById`) outside Leaflet's explicit container hook.
2. **No Unsafe Inlines**: Avoid inline `style={{ ... }}` objects unless calculating dynamic coordinates/positions at runtime.
3. **No Prop Drilling through Templates**: If an organism requires map actions, pass the focused handler or state from the template instead of passing entire raw event objects.
4. **Strict Biome Compliance**: No unused variables, no missing key props on lists, and hooks must follow standard React rules (`useHookAtTopLevel`).

---

## 6. Verification

- Run `npm run check:tsc` for component typing and props checking.
- Run `npm run check:biome` to enforce code style and lint rules.
