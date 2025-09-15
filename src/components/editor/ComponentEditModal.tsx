/**
 * Generic Component Edit Modal
 * A dynamic modal that generates form fields based on component definitions
 * This modal can edit any component type without needing component-specific modals
 */

'use client';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  getComponentDefinition,
  validateComponentProps,
  type FieldDefinition,
} from './component-definitions';

// =============================================================================
// TYPES
// =============================================================================

export interface ComponentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentType: string;
  currentProps: Record<string, unknown>;
  onSave: (newProps: Record<string, unknown>) => void;
}

interface FieldErrors {
  [fieldName: string]: string;
}

// =============================================================================
// DYNAMIC FIELD COMPONENTS
// =============================================================================

interface DynamicFieldProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
}

function DynamicField({ field, value, onChange, error, disabled }: DynamicFieldProps) {
  const baseClasses = cn(
    'bg-background border-input focus:border-ring focus:ring-ring text-foreground',
    'flex w-full rounded-md border px-3 py-2 text-sm transition-colors',
    'focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
    error && 'border-destructive focus:border-destructive'
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const newValue =
      field.type === 'boolean'
        ? (e.target as HTMLInputElement).checked
        : field.type === 'number'
          ? Number(e.target.value) || 0
          : e.target.value;

    onChange(newValue);
  };

  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <input
          type={field.type === 'url' ? 'url' : 'text'}
          className={baseClasses}
          value={String(value || '')}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={disabled}
          required={field.required}
        />
      );

    case 'textarea':
      return (
        <textarea
          className={cn(baseClasses, 'resize-vertical min-h-[80px]')}
          value={String(value || '')}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={disabled}
          required={field.required}
          rows={3}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          className={baseClasses}
          value={Number(value || field.defaultValue || 0)}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={disabled}
          required={field.required}
          min={field.min}
          max={field.max}
          step={field.step}
        />
      );

    case 'boolean':
      return (
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="text-primary focus:ring-primary h-4 w-4 rounded border border-gray-300 transition-colors focus:ring-2"
            checked={Boolean(value)}
            onChange={handleChange}
            disabled={disabled}
          />
          <span className="text-foreground text-sm">
            {field.description || 'Enable this option'}
          </span>
        </label>
      );

    case 'select':
      return (
        <select
          className={baseClasses}
          value={String(value || field.defaultValue || '')}
          onChange={handleChange}
          disabled={disabled}
          required={field.required}
        >
          {field.options?.map(option => (
            <option
              key={option.value}
              value={option.value}
              className="bg-background text-foreground"
            >
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'color':
      return (
        <div className="flex space-x-2">
          <input
            type="color"
            className="border-input h-10 w-16 rounded border"
            value={String(value || field.defaultValue || '#000000')}
            onChange={handleChange}
            disabled={disabled}
          />
          <input
            type="text"
            className={cn(baseClasses, 'flex-1')}
            value={String(value || '')}
            onChange={handleChange}
            placeholder="#000000"
            disabled={disabled}
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
      );

    case 'image':
      return (
        <div className="space-y-2">
          <input
            type="url"
            className={baseClasses}
            value={String(value || '')}
            onChange={handleChange}
            placeholder={field.placeholder || 'https://example.com/image.jpg'}
            disabled={disabled}
            required={field.required}
          />
          {value && typeof value === 'string' && value.length > 0 ? (
            <div className="rounded border p-2">
              <Image
                src={value}
                alt="Preview"
                width={80}
                height={80}
                className="h-20 w-auto rounded object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ) : null}
        </div>
      );

    default:
      return (
        <input
          type="text"
          className={baseClasses}
          value={String(value || '')}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={disabled}
        />
      );
  }
}

// =============================================================================
// MAIN MODAL COMPONENT
// =============================================================================

export function ComponentEditModal({
  isOpen,
  onClose,
  componentType,
  currentProps,
  onSave,
}: ComponentEditModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const componentDefinition = getComponentDefinition(componentType);

  // Initialize form data when modal opens or props change
  useEffect(() => {
    if (isOpen && componentDefinition) {
      const initialData: Record<string, unknown> = {};

      componentDefinition.fields.forEach(field => {
        // Use current prop value or default value
        initialData[field.name] = currentProps[field.name] ?? field.defaultValue;
      });

      setFormData(initialData);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, componentDefinition, currentProps]);

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    // Clear field error when user starts editing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!componentDefinition) return;

    setIsSubmitting(true);

    try {
      // Validate the form data
      const validation = validateComponentProps(componentType, formData);

      if (!validation.isValid) {
        // Map validation errors to field errors
        const fieldErrors: FieldErrors = {};
        validation.errors.forEach(error => {
          // Try to extract field name from error message
          const field = componentDefinition.fields.find(f => error.includes(f.label));
          if (field) {
            fieldErrors[field.name] = error;
          }
        });

        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      // Save the validated props
      onSave(validation.sanitizedProps);
      onClose();
    } catch (error) {
      console.error('Error saving component:', error);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!componentDefinition) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Error" size="sm">
        <div className="text-destructive text-center">Unknown component type: {componentType}</div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Modal>
    );
  }

  const hasRequiredFields = componentDefinition.fields.some(field => field.required);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Edit ${componentDefinition.name}`}
      size="lg"
      closeOnBackdropClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Component Info */}
        <div className="border-border border-b pb-4">
          <h3 className="text-foreground font-medium">{componentDefinition.name}</h3>
          <p className="text-muted-foreground text-sm">{componentDefinition.description}</p>
        </div>

        {/* Form Fields */}
        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {componentDefinition.fields.map(field => (
            <div key={field.name} className="space-y-2">
              <label className="text-foreground block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>

              {field.description && field.type !== 'boolean' && (
                <p className="text-muted-foreground text-xs">{field.description}</p>
              )}

              <DynamicField
                field={field}
                value={formData[field.name]}
                onChange={value => handleFieldChange(field.name, value)}
                error={errors[field.name]}
                disabled={isSubmitting}
              />

              {errors[field.name] && (
                <p className="text-destructive text-sm">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-border flex items-center justify-between border-t pt-4">
          <div className="text-muted-foreground text-xs">
            {hasRequiredFields && (
              <span>
                Fields marked with <span className="text-destructive">*</span> are required
              </span>
            )}
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ComponentEditModal;
