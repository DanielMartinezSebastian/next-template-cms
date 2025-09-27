/**
 * Dynamic Component Property Editor
 * Generates form fields automatically from component schemas
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  generateFormFields,
  getComponentSchema,
  validateComponentProps,
  type PropertySchema,
} from '@/lib/component-schemas';
import { useEffect, useRef, useState } from 'react';

interface ComponentPropertyEditorProps {
  componentType: string;
  initialProps: Record<string, unknown>;
  onChange: (props: Record<string, unknown>) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
}

/**
 * Field component for different property types
 */
interface FieldProps {
  name: string;
  schema: PropertySchema;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

function PropertyField({ name, schema, value, onChange, error }: FieldProps) {
  const handleChange = (newValue: unknown) => {
    onChange(newValue);
  };

  const commonProps = {
    id: name,
    name,
    placeholder: schema.placeholder,
    'aria-describedby': error ? `${name}-error` : undefined,
    'aria-invalid': !!error,
  };

  switch (schema.type) {
    case 'string':
    case 'url':
    case 'color':
      return (
        <div className="space-y-2">
          <label htmlFor={name} className="text-foreground text-sm font-medium">
            {schema.label}
            {schema.required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <Input
            {...commonProps}
            type={schema.type === 'url' ? 'url' : schema.type === 'color' ? 'color' : 'text'}
            value={typeof value === 'string' ? value : ''}
            onChange={e => handleChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
          {schema.description && (
            <p className="text-muted-foreground text-xs">{schema.description}</p>
          )}
          {error && (
            <p id={`${name}-error`} className="text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          <label htmlFor={name} className="text-foreground text-sm font-medium">
            {schema.label}
            {schema.required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <textarea
            {...commonProps}
            rows={4}
            value={typeof value === 'string' ? value : ''}
            onChange={e => handleChange(e.target.value)}
            className={`border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              error ? 'border-red-500' : ''
            }`}
          />
          {schema.description && (
            <p className="text-muted-foreground text-xs">{schema.description}</p>
          )}
          {error && (
            <p id={`${name}-error`} className="text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2">
          <label htmlFor={name} className="text-foreground text-sm font-medium">
            {schema.label}
            {schema.required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <Input
            {...commonProps}
            type="number"
            min={schema.min}
            max={schema.max}
            step={schema.step}
            value={typeof value === 'number' ? value : ''}
            onChange={e => handleChange(parseFloat(e.target.value) || 0)}
            className={error ? 'border-red-500' : ''}
          />
          {schema.description && (
            <p className="text-muted-foreground text-xs">{schema.description}</p>
          )}
          {error && (
            <p id={`${name}-error`} className="text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      );

    case 'boolean':
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              {...commonProps}
              type="checkbox"
              checked={Boolean(value)}
              onChange={e => handleChange(e.target.checked)}
              className="border-input rounded"
            />
            <label htmlFor={name} className="text-foreground text-sm font-medium">
              {schema.label}
            </label>
          </div>
          {schema.description && (
            <p className="text-muted-foreground text-xs">{schema.description}</p>
          )}
          {error && (
            <p id={`${name}-error`} className="text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <label htmlFor={name} className="text-foreground text-sm font-medium">
            {schema.label}
            {schema.required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <select
            {...commonProps}
            value={String(value || '')}
            onChange={e => {
              const selectedOption = schema.options?.find(
                opt => String(opt.value) === e.target.value
              );
              handleChange(selectedOption?.value);
            }}
            className={`border-input bg-background ring-offset-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              error ? 'border-red-500' : ''
            }`}
          >
            {!schema.required && <option value="">Select an option...</option>}
            {schema.options?.map(option => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
          {schema.description && (
            <p className="text-muted-foreground text-xs">{schema.description}</p>
          )}
          {error && (
            <p id={`${name}-error`} className="text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <label htmlFor={name} className="text-foreground text-sm font-medium">
            {schema.label}
          </label>
          <Input
            {...commonProps}
            value={String(value || '')}
            onChange={e => handleChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
          {schema.description && (
            <p className="text-muted-foreground text-xs">{schema.description}</p>
          )}
          {error && (
            <p id={`${name}-error`} className="text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
      );
  }
}

/**
 * Main component property editor
 */
export function ComponentPropertyEditor({
  componentType,
  initialProps,
  onChange,
  onValidationChange,
}: ComponentPropertyEditorProps) {
  const [props, setProps] = useState<Record<string, unknown>>(initialProps);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const schema = getComponentSchema(componentType);
  const formFields = generateFormFields(componentType);

  // Initialize props with defaults merged with initial props
  useEffect(() => {
    if (schema) {
      const mergedProps = { ...schema.defaults, ...initialProps };
      setProps(mergedProps);
    }
  }, [componentType, schema, initialProps]);

  // Validate props whenever they change
  useEffect(() => {
    const validation = validateComponentProps(componentType, props);
    const errorMap: Record<string, string> = {};

    validation.errors.forEach(error => {
      // Try to map error to specific field (simple implementation)
      const field = formFields.find(f => error.includes(f.schema.label));
      if (field) {
        errorMap[field.key] = error;
      }
    });

    setErrors(errorMap);
    setIsValid(validation.isValid);

    if (onValidationChange) {
      onValidationChange(validation.isValid, validation.errors);
    }
  }, [props, componentType, formFields, onValidationChange]);

  // Separate effect for calling onChange to prevent loops
  useEffect(() => {
    const validation = validateComponentProps(componentType, props);
    onChangeRef.current(validation.sanitizedProps);
  }, [props, componentType]);

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setProps(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleReset = () => {
    if (schema) {
      setProps(schema.defaults);
    }
  };

  if (!schema) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        <p>Unknown component type: {componentType}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Component Info */}
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-2 flex items-center space-x-2">
          <span className="text-2xl">{schema.icon}</span>
          <h3 className="text-foreground text-lg font-semibold">{schema.name}</h3>
        </div>
        <p className="text-muted-foreground text-sm">{schema.description}</p>
        <span className="bg-muted mt-2 inline-block rounded-md px-2 py-1 text-xs font-medium">
          {schema.category}
        </span>
      </div>

      {/* Property Fields */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-foreground text-base font-medium">Properties</h4>
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
            Reset to defaults
          </Button>
        </div>

        {formFields.map(({ key, schema: fieldSchema }) => (
          <PropertyField
            key={key}
            name={key}
            schema={fieldSchema}
            value={props[key] ?? fieldSchema.default}
            onChange={value => handleFieldChange(key, value)}
            error={errors[key]}
          />
        ))}
      </div>

      {/* Validation Summary */}
      {!isValid && Object.keys(errors).length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <h5 className="mb-2 text-sm font-medium text-red-800 dark:text-red-200">
            Please fix the following errors:
          </h5>
          <ul className="space-y-1">
            {Object.values(errors).map((error, index) => (
              <li key={index} className="text-xs text-red-700 dark:text-red-300">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center space-x-2 text-xs">
        <div className={`h-2 w-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-muted-foreground">
          {isValid ? 'All properties valid' : `${Object.keys(errors).length} errors`}
        </span>
      </div>
    </div>
  );
}

export default ComponentPropertyEditor;
