/**
 * Testimonial Component
 * Displays a single testimonial with user info
 */

interface TestimonialProps {
  quote?: string;
  author?: string;
  title?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  backgroundColor?: string;
  textColor?: string;
  locale?: string;
  editMode?: boolean;
  componentId?: string;
}

export function Testimonial({
  quote = 'This product has completely transformed our workflow. Highly recommended!',
  author = 'John Smith',
  title = 'CEO',
  company = 'Tech Solutions Inc.',
  avatar = 'https://images.placeholders.dev/150x150?text=Avatar&bgColor=%236b7280&textColor=%23ffffff',
  rating = 5,
  backgroundColor = 'bg-white',
  textColor = 'text-gray-900',
  locale = 'en',
  editMode = false,
  componentId,
}: TestimonialProps) {
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div
      className={`testimonial ${backgroundColor} rounded-lg p-6 shadow-lg`}
      data-component-id={componentId}
    >
      {editMode && (
        <div className="mb-4 rounded bg-blue-50 p-2 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          Testimonial Component - ID: {componentId}
        </div>
      )}

      <div className="space-y-4">
        {/* Rating */}
        <div className="flex items-center space-x-1">{renderStars()}</div>

        {/* Quote */}
        <blockquote className={`text-lg italic ${textColor}`}>&ldquo;{quote}&rdquo;</blockquote>

        {/* Author Info */}
        <div className="flex items-center space-x-4">
          <img
            src={avatar}
            alt={author}
            className="h-12 w-12 rounded-full object-cover"
            onError={e => {
              e.currentTarget.src =
                'https://images.placeholders.dev/150x150?text=Avatar&bgColor=%236b7280&textColor=%23ffffff';
            }}
          />
          <div>
            <div className={`font-semibold ${textColor}`}>{author}</div>
            <div className="text-sm text-gray-500">
              {title}
              {company && ` at ${company}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
