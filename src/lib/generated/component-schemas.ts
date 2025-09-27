/**
 * AUTO-GENERATED COMPONENT SCHEMAS
 * Generated on: 2025-09-27T11:43:57.671Z
 * 
 * DO NOT EDIT MANUALLY - Run 'npm run configure' to regenerate
 */

export const AUTO_GENERATED_SCHEMAS = {
  "button": {
    "type": "button",
    "name": "Button",
    "description": "Button component for dynamic content rendering (Auto-generated from ButtonComponentProps)",
    "category": "ui",
    "icon": "🔘",
    "properties": {
      "text": {
        "required": false,
        "description": "text property",
        "type": "string",
        "label": "Text"
      },
      "href": {
        "required": false,
        "description": "href property",
        "type": "string",
        "label": "Href"
      },
      "variant": {
        "required": false,
        "description": "variant property",
        "type": "select",
        "label": "Variant",
        "options": [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link"
        ]
      },
      "size": {
        "required": false,
        "description": "size property",
        "type": "select",
        "label": "Size",
        "options": [
          "default",
          "sm",
          "lg",
          "icon"
        ]
      },
      "disabled": {
        "required": false,
        "description": "disabled property",
        "type": "boolean",
        "label": "Disabled",
        "default": false
      },
      "fullWidth": {
        "required": false,
        "description": "fullWidth property",
        "type": "boolean",
        "label": "Full Width",
        "default": false
      },
      "centerAlign": {
        "required": false,
        "description": "centerAlign property",
        "type": "boolean",
        "label": "Center Align",
        "default": false
      },
      "className": {
        "required": false,
        "description": "className property",
        "type": "string",
        "label": "Class Name"
      },
      "onClick": {
        "required": false,
        "description": "onClick callback function",
        "default": ">",
        "type": "function",
        "label": "On Click"
      }
    },
    "defaults": {
      "text": "",
      "href": "https://images.placeholders.dev/800x600?text=Placeholder&bgColor=%236b7280&textColor=%23ffffff",
      "variant": "",
      "size": "",
      "disabled": false,
      "fullWidth": false,
      "centerAlign": false,
      "className": "",
      "onClick": ""
    }
  },
  "card": {
    "type": "card",
    "name": "Card",
    "description": "Card component for dynamic content rendering (Auto-generated from CardProps)",
    "category": "general",
    "icon": "🃏",
    "properties": {
      "title": {
        "required": false,
        "description": "title property",
        "type": "string",
        "label": "Title"
      },
      "description": {
        "required": false,
        "description": "description property",
        "type": "string",
        "label": "Description"
      },
      "image": {
        "required": false,
        "description": "image property",
        "type": "string",
        "label": "Image"
      },
      "imageAlt": {
        "required": false,
        "description": "imageAlt property",
        "type": "string",
        "label": "Image Alt"
      },
      "buttonText": {
        "required": false,
        "description": "buttonText property",
        "type": "string",
        "label": "Button Text"
      },
      "buttonLink": {
        "required": false,
        "description": "buttonLink property",
        "type": "string",
        "label": "Button Link"
      },
      "variant": {
        "required": false,
        "description": "variant property",
        "type": "select",
        "label": "Variant",
        "options": [
          "default",
          "outlined",
          "elevated"
        ]
      },
      "imagePosition": {
        "required": false,
        "description": "imagePosition property",
        "type": "select",
        "label": "Image Position",
        "options": [
          "top",
          "left",
          "right"
        ]
      },
      "className": {
        "required": false,
        "description": "className property",
        "type": "string",
        "label": "Class Name"
      }
    },
    "defaults": {
      "title": "Card Title",
      "description": "This is a sample card description that shows how content will be displayed in the card component.",
      "image": "https://images.placeholders.dev/400x250?text=Card%20Image&bgColor=%236b7280&textColor=%23ffffff",
      "imageAlt": "Card image",
      "buttonText": "Learn More",
      "buttonLink": "#",
      "variant": "default",
      "imagePosition": "top",
      "className": ""
    }
  },
  "image": {
    "type": "image",
    "name": "Image",
    "description": "Image component for dynamic content rendering (Auto-generated from ImageProps)",
    "category": "media",
    "icon": "🖼️",
    "properties": {
      "src": {
        "required": false,
        "description": "src property",
        "type": "string",
        "label": "Src"
      },
      "alt": {
        "required": false,
        "description": "alt property",
        "type": "string",
        "label": "Alt"
      },
      "width": {
        "required": false,
        "description": "width property",
        "type": "number",
        "label": "Width"
      },
      "height": {
        "required": false,
        "description": "height property",
        "type": "number",
        "label": "Height"
      },
      "fit": {
        "required": false,
        "description": "fit property",
        "type": "select",
        "label": "Fit",
        "options": [
          "cover",
          "contain",
          "fill",
          "none",
          "scale-down"
        ]
      },
      "className": {
        "required": false,
        "description": "className property",
        "type": "string",
        "label": "Class Name"
      },
      "priority": {
        "required": false,
        "description": "priority property",
        "type": "boolean",
        "label": "Priority",
        "default": false
      }
    },
    "defaults": {
      "src": "https://images.placeholders.dev/800x600?text=Image&bgColor=%236b7280&textColor=%23ffffff",
      "alt": "Image description",
      "width": 800,
      "height": 600,
      "fit": "cover",
      "className": "",
      "priority": false
    }
  },
  "section": {
    "type": "section",
    "name": "Section",
    "description": "Section component for dynamic content rendering (Auto-generated from SectionProps)",
    "category": "layout",
    "icon": "📄",
    "properties": {
      "children": {
        "required": false,
        "description": "children property",
        "type": "string",
        "label": "Children"
      },
      "title": {
        "required": false,
        "description": "title property",
        "type": "string",
        "label": "Title"
      },
      "backgroundColor": {
        "required": false,
        "description": "backgroundColor property",
        "type": "string",
        "label": "Background Color"
      },
      "textColor": {
        "required": false,
        "description": "textColor property",
        "type": "string",
        "label": "Text Color"
      },
      "padding": {
        "required": false,
        "description": "padding property",
        "type": "select",
        "label": "Padding",
        "options": [
          "small",
          "medium",
          "large"
        ]
      },
      "fullWidth": {
        "required": false,
        "description": "fullWidth property",
        "type": "boolean",
        "label": "Full Width",
        "default": false
      },
      "centerContent": {
        "required": false,
        "description": "centerContent property",
        "type": "boolean",
        "label": "Center Content",
        "default": false
      },
      "className": {
        "required": false,
        "description": "className property",
        "type": "string",
        "label": "Class Name"
      }
    },
    "defaults": {
      "children": "",
      "title": "",
      "backgroundColor": "#000000",
      "textColor": "#000000",
      "padding": "",
      "fullWidth": false,
      "centerContent": false,
      "className": ""
    }
  },
  "spacer": {
    "type": "spacer",
    "name": "Spacer",
    "description": "Spacer component for dynamic content rendering (Auto-generated from SpacerProps)",
    "category": "layout",
    "icon": "📏",
    "properties": {
      "height": {
        "required": false,
        "description": "height property",
        "type": "number",
        "label": "Height"
      },
      "width": {
        "required": false,
        "description": "width property",
        "type": "number",
        "label": "Width"
      },
      "direction": {
        "required": false,
        "description": "direction property",
        "type": "select",
        "label": "Direction",
        "options": [
          "vertical",
          "horizontal"
        ]
      },
      "className": {
        "required": false,
        "description": "className property",
        "type": "string",
        "label": "Class Name"
      }
    },
    "defaults": {
      "height": 0,
      "width": 0,
      "direction": "",
      "className": ""
    }
  },
  "call-to-action": {
    "type": "call-to-action",
    "name": "CallToAction",
    "description": "CallToAction component for dynamic content rendering (Auto-generated from CallToActionProps)",
    "category": "marketing",
    "icon": "🚀",
    "properties": {
      "title": {
        "required": false,
        "description": "title property",
        "type": "string",
        "label": "Title"
      },
      "description": {
        "required": false,
        "description": "description property",
        "type": "string",
        "label": "Description"
      },
      "buttonText": {
        "required": false,
        "description": "buttonText property",
        "type": "string",
        "label": "Button Text"
      },
      "buttonLink": {
        "required": false,
        "description": "buttonLink property",
        "type": "string",
        "label": "Button Link"
      },
      "buttonVariant": {
        "required": false,
        "description": "buttonVariant property",
        "type": "select",
        "label": "Button Variant",
        "options": [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link"
        ]
      },
      "backgroundColor": {
        "required": false,
        "description": "backgroundColor property",
        "type": "string",
        "label": "Background Color"
      },
      "textColor": {
        "required": false,
        "description": "textColor property",
        "type": "string",
        "label": "Text Color"
      },
      "centerAlign": {
        "required": false,
        "description": "centerAlign property",
        "type": "boolean",
        "label": "Center Align",
        "default": false
      },
      "locale": {
        "required": false,
        "description": "locale property",
        "type": "string",
        "label": "Locale"
      },
      "editMode": {
        "required": false,
        "description": "editMode property",
        "type": "boolean",
        "label": "Edit Mode",
        "default": false
      },
      "componentId": {
        "required": false,
        "description": "componentId property",
        "type": "string",
        "label": "Component Id"
      }
    },
    "defaults": {
      "title": "Ready to get started?",
      "description": "Join thousands of satisfied customers today",
      "buttonText": "Get Started",
      "buttonLink": "#",
      "buttonVariant": "default",
      "backgroundColor": "bg-primary",
      "textColor": "#000000",
      "centerAlign": true,
      "locale": "",
      "editMode": false,
      "componentId": ""
    }
  },
  "contact-form": {
    "type": "contact-form",
    "name": "ContactForm",
    "description": "ContactForm component for dynamic content rendering (Auto-generated from ContactFormProps)",
    "category": "forms",
    "icon": "📧",
    "properties": {
      "title": {
        "required": false,
        "description": "title property",
        "type": "string",
        "label": "Title"
      },
      "description": {
        "required": false,
        "description": "description property",
        "type": "string",
        "label": "Description"
      },
      "fields": {
        "required": false,
        "description": "fields property",
        "type": "string",
        "label": "Fields"
      },
      "label": {
        "required": true,
        "description": "label property",
        "type": "string",
        "label": "Label"
      },
      "type": {
        "required": true,
        "description": "type property",
        "type": "select",
        "label": "Type",
        "options": [
          "text",
          "email",
          "tel",
          "textarea"
        ]
      },
      "required": {
        "required": false,
        "description": "required property",
        "type": "boolean",
        "label": "Required",
        "default": false
      },
      "placeholder": {
        "required": false,
        "description": "placeholder property",
        "type": "string",
        "label": "Placeholder"
      }
    },
    "defaults": {
      "title": "Contact Us",
      "description": "Get in touch with us",
      "fields": [
        {
          "name": "name",
          "label": "Name",
          "type": "text",
          "required": true,
          "placeholder": "Your name"
        },
        {
          "name": "email",
          "label": "Email",
          "type": "email",
          "required": true,
          "placeholder": "your@email.com"
        },
        {
          "name": "message",
          "label": "Message",
          "type": "textarea",
          "required": true,
          "placeholder": "Your message here..."
        }
      ],
      "label": "",
      "type": "",
      "required": false,
      "placeholder": "",
      "submitText": "Send Message",
      "successMessage": "Thank you for your message!"
    }
  },
  "feature-grid": {
    "type": "feature-grid",
    "name": "FeatureGrid",
    "description": "FeatureGrid component for dynamic content rendering (Auto-generated from FeatureGridProps)",
    "category": "marketing",
    "icon": "⭐",
    "properties": {
      "title": {
        "required": false,
        "description": "title property",
        "type": "string",
        "label": "Title"
      },
      "subtitle": {
        "required": false,
        "description": "subtitle property",
        "type": "string",
        "label": "Subtitle"
      },
      "features": {
        "required": false,
        "description": "features property",
        "type": "string",
        "label": "Features"
      },
      "columns": {
        "required": false,
        "description": "columns property",
        "type": "string",
        "label": "Columns"
      },
      "showIcons": {
        "required": false,
        "description": "showIcons property",
        "type": "boolean",
        "label": "Show Icons",
        "default": false
      },
      "locale": {
        "required": false,
        "description": "locale property",
        "type": "string",
        "label": "Locale"
      },
      "editMode": {
        "required": false,
        "description": "editMode property",
        "type": "boolean",
        "label": "Edit Mode",
        "default": false
      },
      "componentId": {
        "required": false,
        "description": "componentId property",
        "type": "string",
        "label": "Component Id"
      }
    },
    "defaults": {
      "title": "Our Features",
      "subtitle": "Discover what makes us special",
      "features": [
        {
          "title": "Fast Performance",
          "description": "Lightning-fast loading times and optimized performance for the best user experience.",
          "icon": "⚡",
          "link": "/features/performance"
        },
        {
          "title": "Secure & Reliable",
          "description": "Enterprise-grade security with 99.9% uptime guarantee and regular backups.",
          "icon": "🔐",
          "link": "/features/security"
        },
        {
          "title": "24/7 Support",
          "description": "Round-the-clock customer support from our expert team whenever you need help.",
          "icon": "🛟",
          "link": "/support"
        }
      ],
      "columns": 3,
      "showIcons": true,
      "locale": "",
      "editMode": false,
      "componentId": ""
    }
  },
  "hero-section": {
    "type": "hero-section",
    "name": "HeroSection",
    "description": "HeroSection component for dynamic content rendering (Auto-generated from HeroSectionProps)",
    "category": "marketing",
    "icon": "🎯",
    "properties": {
      "title": {
        "required": false,
        "description": "title property",
        "type": "string",
        "label": "Title"
      },
      "subtitle": {
        "required": false,
        "description": "subtitle property",
        "type": "string",
        "label": "Subtitle"
      },
      "description": {
        "required": false,
        "description": "description property",
        "type": "string",
        "label": "Description"
      },
      "backgroundImage": {
        "required": false,
        "description": "backgroundImage property",
        "type": "string",
        "label": "Background Image"
      },
      "backgroundColor": {
        "required": false,
        "description": "backgroundColor property",
        "type": "string",
        "label": "Background Color"
      },
      "textAlign": {
        "required": false,
        "description": "textAlign property",
        "type": "select",
        "label": "Text Align",
        "options": [
          "left",
          "center",
          "right"
        ]
      },
      "ctaText": {
        "required": false,
        "description": "ctaText property",
        "type": "string",
        "label": "Cta Text"
      },
      "ctaLink": {
        "required": false,
        "description": "ctaLink property",
        "type": "string",
        "label": "Cta Link"
      },
      "ctaType": {
        "required": false,
        "description": "ctaType property",
        "type": "select",
        "label": "Cta Type",
        "options": [
          "default",
          "secondary",
          "outline"
        ]
      },
      "height": {
        "required": false,
        "description": "height property",
        "type": "select",
        "label": "Height",
        "options": [
          "small",
          "medium",
          "large",
          "full"
        ]
      },
      "overlay": {
        "required": false,
        "description": "overlay property",
        "type": "boolean",
        "label": "Overlay",
        "default": false
      },
      "overlayOpacity": {
        "required": false,
        "description": "overlayOpacity property",
        "type": "number",
        "label": "Overlay Opacity"
      },
      "locale": {
        "required": false,
        "description": "locale property",
        "type": "string",
        "label": "Locale"
      },
      "componentId": {
        "required": false,
        "description": "componentId property",
        "type": "string",
        "label": "Component Id"
      }
    },
    "defaults": {
      "title": "Welcome to Our Website",
      "subtitle": "Innovation Starts Here",
      "description": "Discover amazing content and services that will transform your experience and help you achieve your goals.",
      "backgroundImage": "https://images.placeholders.dev/1200x600?text=Hero%20Background&bgColor=%234f46e5&textColor=%23ffffff",
      "backgroundColor": "bg-gradient-to-r from-blue-600 to-purple-600",
      "textAlign": "center",
      "ctaText": "Get Started",
      "ctaLink": "#",
      "ctaType": "",
      "height": "medium",
      "overlay": true,
      "overlayOpacity": 0.5,
      "locale": "",
      "componentId": ""
    }
  },
  "image-gallery": {
    "type": "image-gallery",
    "name": "ImageGallery",
    "description": "ImageGallery component for dynamic content rendering (Auto-generated from ImageGalleryProps)",
    "category": "media",
    "icon": "🖼️",
    "properties": {
      "images": {
        "required": false,
        "description": "images property",
        "type": "string",
        "label": "Images"
      },
      "title": {
        "required": false,
        "description": "title property",
        "type": "string",
        "label": "Title"
      },
      "columns": {
        "required": false,
        "description": "columns property",
        "type": "string",
        "label": "Columns"
      },
      "spacing": {
        "required": false,
        "description": "spacing property",
        "type": "select",
        "label": "Spacing",
        "options": [
          "small",
          "medium",
          "large"
        ]
      },
      "aspectRatio": {
        "required": false,
        "description": "aspectRatio property",
        "type": "select",
        "label": "Aspect Ratio",
        "options": [
          "square",
          "landscape",
          "portrait",
          "auto"
        ]
      },
      "showTitles": {
        "required": false,
        "description": "showTitles property",
        "type": "boolean",
        "label": "Show Titles",
        "default": false
      },
      "showDescriptions": {
        "required": false,
        "description": "showDescriptions property",
        "type": "boolean",
        "label": "Show Descriptions",
        "default": false
      },
      "lightbox": {
        "required": false,
        "description": "lightbox property",
        "type": "boolean",
        "label": "Lightbox",
        "default": false
      },
      "locale": {
        "required": false,
        "description": "locale property",
        "type": "string",
        "label": "Locale"
      },
      "editMode": {
        "required": false,
        "description": "editMode property",
        "type": "boolean",
        "label": "Edit Mode",
        "default": false
      },
      "componentId": {
        "required": false,
        "description": "componentId property",
        "type": "string",
        "label": "Component Id"
      }
    },
    "defaults": {
      "images": [
        {
          "src": "https://images.placeholders.dev/800x600?text=Gallery%20Image%201&bgColor=%234f46e5&textColor=%23ffffff",
          "alt": "Gallery Image 1",
          "title": "Beautiful Landscape",
          "description": "A stunning view of the mountains and valleys"
        },
        {
          "src": "https://images.placeholders.dev/800x600?text=Gallery%20Image%202&bgColor=%2310b981&textColor=%23ffffff",
          "alt": "Gallery Image 2",
          "title": "Urban Architecture",
          "description": "Modern city skyline with impressive buildings"
        },
        {
          "src": "https://images.placeholders.dev/800x600?text=Gallery%20Image%203&bgColor=%23f59e0b&textColor=%23ffffff",
          "alt": "Gallery Image 3",
          "title": "Nature Close-up",
          "description": "Detailed macro photography of natural elements"
        }
      ],
      "title": "Image Gallery",
      "columns": 3,
      "spacing": "medium",
      "aspectRatio": "landscape",
      "showTitles": false,
      "showDescriptions": false,
      "lightbox": false,
      "locale": "",
      "editMode": false,
      "componentId": ""
    }
  },
  "pricing": {
    "type": "pricing",
    "name": "Pricing",
    "description": "Pricing component for dynamic content rendering (Auto-generated from PricingProps)",
    "category": "marketing",
    "icon": "💰",
    "properties": {
      "planName": {
        "required": false,
        "description": "planName property",
        "type": "string",
        "label": "Plan Name"
      },
      "price": {
        "required": false,
        "description": "price property",
        "type": "string",
        "label": "Price"
      },
      "currency": {
        "required": false,
        "description": "currency property",
        "type": "string",
        "label": "Currency"
      },
      "period": {
        "required": false,
        "description": "period property",
        "type": "string",
        "label": "Period"
      },
      "description": {
        "required": false,
        "description": "description property",
        "type": "string",
        "label": "Description"
      },
      "features": {
        "required": false,
        "description": "features property",
        "type": "string",
        "label": "Features"
      },
      "buttonText": {
        "required": false,
        "description": "buttonText property",
        "type": "string",
        "label": "Button Text"
      },
      "buttonLink": {
        "required": false,
        "description": "buttonLink property",
        "type": "string",
        "label": "Button Link"
      },
      "highlighted": {
        "required": false,
        "description": "highlighted property",
        "type": "boolean",
        "label": "Highlighted",
        "default": false
      },
      "backgroundColor": {
        "required": false,
        "description": "backgroundColor property",
        "type": "string",
        "label": "Background Color"
      },
      "textColor": {
        "required": false,
        "description": "textColor property",
        "type": "string",
        "label": "Text Color"
      },
      "accentColor": {
        "required": false,
        "description": "accentColor property",
        "type": "string",
        "label": "Accent Color"
      },
      "locale": {
        "required": false,
        "description": "locale property",
        "type": "string",
        "label": "Locale"
      },
      "editMode": {
        "required": false,
        "description": "editMode property",
        "type": "boolean",
        "label": "Edit Mode",
        "default": false
      },
      "componentId": {
        "required": false,
        "description": "componentId property",
        "type": "string",
        "label": "Component Id"
      }
    },
    "defaults": {
      "planName": "Pro Plan",
      "price": "29",
      "currency": "$",
      "period": "month",
      "description": "Perfect for growing businesses",
      "features": [
        {
          "title": "Fast Performance",
          "description": "Lightning-fast loading times and optimized performance for the best user experience.",
          "icon": "⚡",
          "link": "/features/performance"
        },
        {
          "title": "Secure & Reliable",
          "description": "Enterprise-grade security with 99.9% uptime guarantee and regular backups.",
          "icon": "🔐",
          "link": "/features/security"
        },
        {
          "title": "24/7 Support",
          "description": "Round-the-clock customer support from our expert team whenever you need help.",
          "icon": "🛟",
          "link": "/support"
        }
      ],
      "buttonText": "Get Started",
      "buttonLink": "#",
      "highlighted": false,
      "backgroundColor": "bg-white",
      "textColor": "text-gray-900",
      "accentColor": "bg-blue-600",
      "locale": "",
      "editMode": false,
      "componentId": ""
    }
  },
  "testimonial": {
    "type": "testimonial",
    "name": "Testimonial",
    "description": "Testimonial component for dynamic content rendering (Auto-generated from TestimonialProps)",
    "category": "marketing",
    "icon": "⭐",
    "properties": {
      "quote": {
        "required": false,
        "description": "quote property",
        "type": "string",
        "label": "Quote"
      },
      "author": {
        "required": false,
        "description": "author property",
        "type": "string",
        "label": "Author"
      },
      "title": {
        "required": false,
        "description": "title property",
        "type": "string",
        "label": "Title"
      },
      "company": {
        "required": false,
        "description": "company property",
        "type": "string",
        "label": "Company"
      },
      "avatar": {
        "required": false,
        "description": "avatar property",
        "type": "string",
        "label": "Avatar"
      },
      "rating": {
        "required": false,
        "description": "rating property",
        "type": "number",
        "label": "Rating"
      },
      "backgroundColor": {
        "required": false,
        "description": "backgroundColor property",
        "type": "string",
        "label": "Background Color"
      },
      "textColor": {
        "required": false,
        "description": "textColor property",
        "type": "string",
        "label": "Text Color"
      },
      "locale": {
        "required": false,
        "description": "locale property",
        "type": "string",
        "label": "Locale"
      },
      "editMode": {
        "required": false,
        "description": "editMode property",
        "type": "boolean",
        "label": "Edit Mode",
        "default": false
      },
      "componentId": {
        "required": false,
        "description": "componentId property",
        "type": "string",
        "label": "Component Id"
      }
    },
    "defaults": {
      "quote": "This product has completely transformed our workflow. Highly recommended!",
      "author": "John Smith",
      "title": "CEO",
      "company": "Tech Solutions Inc.",
      "avatar": "https://images.placeholders.dev/150x150?text=Avatar&bgColor=%236b7280&textColor=%23ffffff",
      "rating": 5,
      "backgroundColor": "bg-white",
      "textColor": "text-gray-900",
      "locale": "",
      "editMode": false,
      "componentId": ""
    }
  },
  "text-block": {
    "type": "text-block",
    "name": "TextBlock",
    "description": "TextBlock component for dynamic content rendering (Auto-generated from TextBlockProps)",
    "category": "content",
    "icon": "📝",
    "properties": {
      "content": {
        "required": false,
        "description": "content property",
        "type": "string",
        "label": "Content"
      },
      "title": {
        "required": false,
        "description": "title property",
        "type": "string",
        "label": "Title"
      },
      "subtitle": {
        "required": false,
        "description": "subtitle property",
        "type": "string",
        "label": "Subtitle"
      },
      "textAlign": {
        "required": false,
        "description": "textAlign property",
        "type": "select",
        "label": "Text Align",
        "options": [
          "left",
          "center",
          "right",
          "justify"
        ]
      },
      "fontSize": {
        "required": false,
        "description": "fontSize property",
        "type": "select",
        "label": "Font Size",
        "options": [
          "small",
          "medium",
          "large"
        ]
      },
      "fontWeight": {
        "required": false,
        "description": "fontWeight property",
        "type": "select",
        "label": "Font Weight",
        "options": [
          "normal",
          "medium",
          "bold"
        ]
      },
      "color": {
        "required": false,
        "description": "color property",
        "type": "string",
        "label": "Color"
      },
      "backgroundColor": {
        "required": false,
        "description": "backgroundColor property",
        "type": "string",
        "label": "Background Color"
      },
      "padding": {
        "required": false,
        "description": "padding property",
        "type": "select",
        "label": "Padding",
        "options": [
          "none",
          "small",
          "medium",
          "large"
        ]
      },
      "margin": {
        "required": false,
        "description": "margin property",
        "type": "select",
        "label": "Margin",
        "options": [
          "none",
          "small",
          "medium",
          "large"
        ]
      },
      "maxWidth": {
        "required": false,
        "description": "maxWidth property",
        "type": "select",
        "label": "Max Width",
        "options": [
          "none",
          "prose",
          "container"
        ]
      },
      "allowHtml": {
        "required": false,
        "description": "allowHtml property",
        "type": "boolean",
        "label": "Allow Html",
        "default": false
      },
      "locale": {
        "required": false,
        "description": "locale property",
        "type": "string",
        "label": "Locale"
      },
      "editMode": {
        "required": false,
        "description": "editMode property",
        "type": "boolean",
        "label": "Edit Mode",
        "default": false
      },
      "componentId": {
        "required": false,
        "description": "componentId property",
        "type": "string",
        "label": "Component Id"
      },
      "nodeKey": {
        "required": false,
        "description": "nodeKey property",
        "type": "string",
        "label": "Node Key"
      },
      "isInEditMode": {
        "required": false,
        "description": "isInEditMode property",
        "type": "boolean",
        "label": "Is In Edit Mode",
        "default": false
      }
    },
    "defaults": {
      "content": "This is a sample text block that demonstrates how content can be displayed with various formatting options. You can customize the appearance, alignment, and styling to match your design needs.\n\nThis text block supports multiple paragraphs and provides flexible content presentation for your website or application.",
      "title": "Welcome to Our Content",
      "subtitle": "Explore our amazing features and services",
      "textAlign": "left",
      "fontSize": "medium",
      "fontWeight": "normal",
      "color": "#000000",
      "backgroundColor": "#000000",
      "padding": "medium",
      "margin": "medium",
      "maxWidth": "prose",
      "allowHtml": false,
      "locale": "",
      "editMode": false,
      "componentId": "",
      "nodeKey": "",
      "isInEditMode": false
    }
  }
};

export const COMPONENT_LIST = [
  {
    "name": "Button",
    "type": "button",
    "category": "ui",
    "icon": "🔘",
    "hasInterface": true
  },
  {
    "name": "Card",
    "type": "card",
    "category": "general",
    "icon": "🃏",
    "hasInterface": true
  },
  {
    "name": "Image",
    "type": "image",
    "category": "media",
    "icon": "🖼️",
    "hasInterface": true
  },
  {
    "name": "Section",
    "type": "section",
    "category": "layout",
    "icon": "📄",
    "hasInterface": true
  },
  {
    "name": "Spacer",
    "type": "spacer",
    "category": "layout",
    "icon": "📏",
    "hasInterface": true
  },
  {
    "name": "CallToAction",
    "type": "call-to-action",
    "category": "marketing",
    "icon": "🚀",
    "hasInterface": true
  },
  {
    "name": "ContactForm",
    "type": "contact-form",
    "category": "forms",
    "icon": "📧",
    "hasInterface": true
  },
  {
    "name": "FeatureGrid",
    "type": "feature-grid",
    "category": "marketing",
    "icon": "⭐",
    "hasInterface": true
  },
  {
    "name": "HeroSection",
    "type": "hero-section",
    "category": "marketing",
    "icon": "🎯",
    "hasInterface": true
  },
  {
    "name": "ImageGallery",
    "type": "image-gallery",
    "category": "media",
    "icon": "🖼️",
    "hasInterface": true
  },
  {
    "name": "Pricing",
    "type": "pricing",
    "category": "marketing",
    "icon": "💰",
    "hasInterface": true
  },
  {
    "name": "Testimonial",
    "type": "testimonial",
    "category": "marketing",
    "icon": "⭐",
    "hasInterface": true
  },
  {
    "name": "TextBlock",
    "type": "text-block",
    "category": "content",
    "icon": "📝",
    "hasInterface": true
  }
];
