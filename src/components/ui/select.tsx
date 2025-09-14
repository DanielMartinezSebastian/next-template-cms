'use client';

import { Select as BaseSelect } from '@base-ui-components/react/select';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const selectTriggerVariants = cva(
  'ring-offset-background flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300 focus:ring-blue-500',
        error: 'border-red-500 focus:ring-red-500',
        success: 'border-green-500 focus:ring-green-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const selectItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-900 data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SelectProps extends VariantProps<typeof selectTriggerVariants> {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

interface SelectItemProps extends VariantProps<typeof selectItemVariants> {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ variant, placeholder, value, onValueChange, children, disabled, ...props }, ref) => {
    return (
      <BaseSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <BaseSelect.Trigger ref={ref} className={cn(selectTriggerVariants({ variant }))} {...props}>
          <BaseSelect.Value>{value || placeholder}</BaseSelect.Value>
          <BaseSelect.Icon className="h-4 w-4 opacity-50">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={5}>
            <BaseSelect.Popup className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md">
              {children}
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    );
  }
);

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ variant, value, children, disabled, ...props }, ref) => {
    return (
      <BaseSelect.Item
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(selectItemVariants({ variant }))}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <BaseSelect.ItemIndicator>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </BaseSelect.ItemIndicator>
        </span>
        <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      </BaseSelect.Item>
    );
  }
);

const SelectSeparator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Separator
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-gray-100', className)}
      {...props}
    />
  )
);

Select.displayName = 'Select';
SelectItem.displayName = 'SelectItem';
SelectSeparator.displayName = 'SelectSeparator';

export { Select, SelectItem, SelectSeparator, selectTriggerVariants, selectItemVariants };
