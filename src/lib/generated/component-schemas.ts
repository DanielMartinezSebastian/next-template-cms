/**
 * AUTO-GENERATED COMPONENT SCHEMAS
 * Generated on: 2025-09-16T17:25:15.436Z
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
      "href": "",
      "disabled": false,
      "fullWidth": false,
      "centerAlign": false,
      "className": "",
      "onClick": ">"
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
      "title": "",
      "description": "",
      "image": "",
      "imageAlt": "",
      "buttonText": "",
      "buttonLink": "",
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
      "src": "",
      "alt": "",
      "width": 0,
      "height": 0,
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
      "backgroundColor": "",
      "textColor": "",
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
      "title": "",
      "description": "",
      "buttonText": "",
      "buttonLink": "",
      "backgroundColor": "",
      "textColor": "",
      "centerAlign": false,
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
      "title": "",
      "description": "",
      "fields": "",
      "label": "",
      "required": false,
      "placeholder": ""
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
      "title": "",
      "subtitle": "",
      "features": "",
      "columns": "",
      "showIcons": false,
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
      "title": "",
      "subtitle": "",
      "description": "",
      "backgroundImage": "",
      "backgroundColor": "",
      "ctaText": "",
      "ctaLink": "",
      "overlay": false,
      "overlayOpacity": 0,
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
      "images": "",
      "title": "",
      "columns": "",
      "showTitles": false,
      "showDescriptions": false,
      "lightbox": false,
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
      "content": "",
      "title": "",
      "subtitle": "",
      "color": "",
      "backgroundColor": "",
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
    "name": "TextBlock",
    "type": "text-block",
    "category": "content",
    "icon": "📝",
    "hasInterface": true
  }
];
