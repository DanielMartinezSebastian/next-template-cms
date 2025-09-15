/**
 * Contact Form Component
 * Dynamic contact form
 */

import React from 'react';
import { Button } from '@/components/ui/button';

interface ContactFormProps {
  title?: string;
  description?: string;
  fields?: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea';
    required?: boolean;
    placeholder?: string;
  }>;
  submitText?: string;
  successMessage?: string;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

export function ContactForm({
  title = 'Contact Us',
  description = 'Get in touch with us',
  fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
  ],
  submitText = 'Send Message',
  successMessage = 'Thank you for your message!',
  locale = 'en',
  editMode = false,
  componentId,
}: ContactFormProps) {
  return (
    <div className="contact-form mx-auto max-w-2xl py-8" data-component-id={componentId}>
      {title && (
        <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
          {title}
        </h2>
      )}

      {description && (
        <p className="mb-8 text-center text-muted-foreground">
          {description}
        </p>
      )}

      <form className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.name || index}>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className="w-full rounded border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full rounded border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            )}
          </div>
        ))}

        <Button type="submit" className="w-full">
          {submitText}
        </Button>
      </form>

      {editMode && (
        <div className="mt-4 rounded bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-200">
          Contact Form • {fields.length} fields
        </div>
      )}
    </div>
  );
}

export default ContactForm;
