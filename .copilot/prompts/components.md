# Component Development Guidelines

## Atomic Design Pattern

### 1. Atoms (Base Components)

Basic building blocks of the application:

```typescript
// Button Component
interface ButtonProps extends ComponentProps<'button'> {
  icon?: JSX.Element
  variant?: 'default' | 'transparent'
}

// Input Component
interface InputProps extends ComponentProps<'input'> {
  leftIcon?: JSX.Element
  rightIcon?: JSX.Element
  onRightIconClick?: () => void
}

// Modal Component
interface ModalProps {
  isOpen: boolean
  onClose: () => void
}
```

### 2. Molecules (Composite Components)

Combinations of atoms:

```typescript
// SearchField Component
interface SearchFieldProps {
  value: string
  onChange: (_value: string) => void
  onCancel: () => void
  className?: string
}

// MarkerElement Component
interface MarkerElementProps {
  marker: CustomMarker
  onClick?: () => void
}
```

### 3. Organisms (Complex Components)

Complex UI components with business logic:

```typescript
// MapControls Component
interface MapControlsProps {
  map: MapType | null
  isZoomInDisabled: boolean
  isZoomOutDisabled: boolean
  loading: boolean
  metadata?: string
  onRefresh: () => void
  setMapBounds: () => void
}

// SearchSection Component
interface SearchSectionProps {
  search: string
  loading: boolean
  error: string | null
  api?: string
  onSearchChange: (_value: string) => void
  onSearchCancel: () => void
}
```

## Styling Guidelines

1. Use Tailwind CSS Classes

   - Follow utility-first approach
   - Use consistent spacing scale
   - Implement responsive design

2. CSS Best Practices

   - Mobile-first approach
   - Maintain consistent spacing
   - Use semantic HTML elements
   - Follow accessibility guidelines

3. Component Structure

   ```typescript
   // Template for new components
   import { FunctionComponent } from 'react'

   interface ComponentProps {
     // Props definition
   }

   const Component: FunctionComponent<ComponentProps> = ({
     // Destructured props
   }) => {
     return (
       // JSX with Tailwind classes
     )
   }
   ```

## Component Best Practices

1. Component Design

   - Keep components focused and small
   - Use TypeScript for type safety
   - Follow single responsibility principle
   - Implement proper prop validation

2. State Management

   - Use React hooks effectively
   - Implement proper state updates
   - Handle side effects correctly

3. Error Handling

   - Implement error boundaries
   - Handle loading states
   - Provide fallback UI

4. Accessibility

   - Use semantic HTML
   - Implement ARIA attributes
   - Support keyboard navigation
   - Test with screen readers

5. Performance
   - Memoize when needed
   - Lazy load components
   - Optimize re-renders
