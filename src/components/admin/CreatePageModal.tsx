/**
 * Create Page Modal Component
 * Modal para crear nuevas páginas con formulario validado
 */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useLocale, usePageActions } from '@/stores';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  slug: string;
  description: string;
  locale: string;
  isPublished: boolean;
}

interface FormErrors {
  title?: string;
  slug?: string;
}

export function CreatePageModal({ isOpen, onClose }: CreatePageModalProps) {
  const t = useTranslations('Admin.editor.createModal');
  const { addPage } = usePageActions();
  const locale = useLocale();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    description: '',
    locale,
    isPublished: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        slug: '',
        description: '',
        locale,
        isPublished: false,
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, locale]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const autoSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, formData.slug]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t('titleRequired');
    }

    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = t('slugInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the page
      addPage({
        title: formData.title.trim(),
        slug:
          formData.slug ||
          formData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim(),
        locale: formData.locale,
        components: [
          {
            id: 'heading-1',
            type: 'heading',
            props: {
              level: 1,
              content: formData.title,
            },
            order: 0,
          },
          {
            id: 'paragraph-1',
            type: 'paragraph',
            props: {
              content: formData.description || 'Nueva página creada desde el admin.',
            },
            order: 1,
          },
        ],
        isPublished: formData.isPublished,
        metadata: {
          description: formData.description || undefined,
        },
      });

      // Close modal and reset
      onClose();
    } catch (error) {
      console.error('Error creating page:', error);
      // Here you could show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;

      setFormData(prev => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('title')}
      className="max-w-2xl"
      backdrop="blur"
      position="center"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="text-foreground mb-2 block text-sm font-medium">
            {t('titleLabel')} <span className="text-destructive">*</span>
          </label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange('title')}
            placeholder={t('titlePlaceholder')}
            className={errors.title ? 'border-destructive' : ''}
            disabled={isSubmitting}
          />
          {errors.title && <p className="text-destructive mt-1 text-sm">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="text-foreground mb-2 block text-sm font-medium">
            {t('slugLabel')}
          </label>
          <Input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={handleInputChange('slug')}
            placeholder={t('slugPlaceholder')}
            className={errors.slug ? 'border-destructive' : ''}
            disabled={isSubmitting}
          />
          {errors.slug ? (
            <p className="text-destructive mt-1 text-sm">{errors.slug}</p>
          ) : (
            <p className="text-muted-foreground mt-1 text-sm">{t('slugHelper')}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="text-foreground mb-2 block text-sm font-medium">
            {t('descriptionLabel')}
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange('description')}
            placeholder={t('descriptionPlaceholder')}
            rows={3}
            className="bg-background border-input placeholder:text-muted-foreground focus:border-ring focus:ring-ring flex w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          />
        </div>

        {/* Locale */}
        <div>
          <label htmlFor="locale" className="text-foreground mb-2 block text-sm font-medium">
            {t('localeLabel')}
          </label>
          <select
            id="locale"
            value={formData.locale}
            onChange={handleInputChange('locale')}
            className="bg-background border-input focus:border-ring focus:ring-ring text-foreground flex w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            <option value="es" className="bg-background text-foreground">
              Español
            </option>
            <option value="en" className="bg-background text-foreground">
              English
            </option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-foreground mb-2 block text-sm font-medium">
            {t('statusLabel')}
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="isPublished"
                checked={!formData.isPublished}
                onChange={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                className="text-primary focus:ring-primary mr-2"
                disabled={isSubmitting}
              />
              <span className="text-sm">{t('statusDraft')}</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isPublished"
                checked={formData.isPublished}
                onChange={() => setFormData(prev => ({ ...prev, isPublished: true }))}
                className="text-primary focus:ring-primary mr-2"
                disabled={isSubmitting}
              />
              <span className="text-sm">{t('statusPublished')}</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
            {isSubmitting ? t('creating') : t('create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
