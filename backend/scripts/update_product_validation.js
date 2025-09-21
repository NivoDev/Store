// MongoDB validation rules update script
// Run this in MongoDB Compass or MongoDB shell

db.products.updateMany(
  {},
  {
    $set: {
      "made_by": "Guerrilla"
    }
  }
);

// Updated validation rules with made_by field
const updatedValidationRules = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'sku',
      'title',
      'price',
      'type',
      'created_at',
      'status'
    ],
    properties: {
      sku: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 50,
        description: 'Product SKU'
      },
      title: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 200,
        description: 'Product title'
      },
      description: {
        bsonType: 'string',
        maxLength: 2000,
        description: 'Product description'
      },
      type: {
        bsonType: 'string',
        'enum': [
          'sample-pack',
          'midi-pack',
          'acapella'
        ],
        description: 'Product type'
      },
      price: {
        bsonType: 'double',
        minimum: 0,
        description: 'Product price'
      },
      original_price: {
        bsonType: [
          'double',
          'null'
        ],
        minimum: 0,
        description: 'Original price before discount'
      },
      discount_percentage: {
        bsonType: [
          'int',
          'null'
        ],
        minimum: 0,
        maximum: 100,
        description: 'Discount percentage'
      },
      bpm: {
        bsonType: [
          'string',
          'null'
        ],
        description: 'Beats per minute'
      },
      key: {
        bsonType: [
          'string',
          'null'
        ],
        description: 'Musical key'
      },
      genre: {
        bsonType: [
          'string',
          'null'
        ],
        description: 'Music genre'
      },
      tags: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        },
        description: 'Product tags'
      },
      sample_count: {
        bsonType: [
          'int',
          'null'
        ],
        minimum: 0,
        description: 'Number of samples'
      },
      total_duration: {
        bsonType: [
          'string',
          'null'
        ],
        description: 'Total duration'
      },
      formats: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        },
        description: 'Available formats'
      },
      total_size: {
        bsonType: [
          'string',
          'null'
        ],
        description: 'Total file size'
      },
      cover_image_url: {
        bsonType: [
          'string',
          'null'
        ],
        description: 'Cover image URL'
      },
      preview_audio_url: {
        bsonType: [
          'string',
          'null'
        ],
        description: 'Preview audio URL'
      },
      featured: {
        bsonType: 'bool',
        description: 'Featured product'
      },
      bestseller: {
        bsonType: 'bool',
        description: 'Bestseller product'
      },
      'new': {
        bsonType: 'bool',
        description: 'New product'
      },
      has_stems: {
        bsonType: 'bool',
        description: 'Has individual stems'
      },
      contents: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        },
        description: 'Product contents'
      },
      slug: {
        bsonType: 'string',
        description: 'URL slug'
      },
      view_count: {
        bsonType: 'int',
        minimum: 0,
        description: 'View count'
      },
      like_count: {
        bsonType: 'int',
        minimum: 0,
        description: 'Like count'
      },
      purchase_count: {
        bsonType: 'int',
        minimum: 0,
        description: 'Purchase count'
      },
      is_free: {
        bsonType: 'bool',
        description: 'Free product'
      },
      made_by: {
        bsonType: [
          'string',
          'null'
        ],
        description: 'Product creator/artist'
      },
      created_at: {
        bsonType: 'date',
        description: 'Creation timestamp'
      },
      release_date: {
        bsonType: [
          'date',
          'null'
        ],
        description: 'Release date'
      },
      savings: {
        bsonType: [
          'double',
          'null'
        ],
        description: 'Savings amount'
      },
      status: {
        bsonType: 'string',
        'enum': [
          'draft',
          'published',
          'archived'
        ],
        description: 'Product status'
      }
    }
  }
};

print("Updated validation rules with made_by field:");
print(JSON.stringify(updatedValidationRules, null, 2));

