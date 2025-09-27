// MongoDB Index Creation Script for Coupon Management System
// Run this script in MongoDB shell or MongoDB Compass

print("🔗 Connecting to MongoDB...");
print("📊 Creating indexes for coupon management system...");

// Switch to your database (replace 'atomic_rose_tools' with your actual database name)
db = db.getSiblingDB('atomic_rose_tools');

print("1. Creating indexes for coupons collection...");

// Coupons collection indexes
db.coupons.createIndex(
  { "code": 1 }, 
  { unique: true, name: "coupon_code_unique" }
);

db.coupons.createIndex(
  { "is_active": 1 }, 
  { name: "coupon_active" }
);

db.coupons.createIndex(
  { "valid_until": 1 }, 
  { name: "coupon_expiry" }
);

db.coupons.createIndex(
  { "is_active": 1, "valid_until": 1 }, 
  { name: "coupon_active_expiry" }
);

db.coupons.createIndex(
  { "created_by": 1 }, 
  { name: "coupon_created_by" }
);

db.coupons.createIndex(
  { "metadata.tags": 1 }, 
  { name: "coupon_tags" }
);

print("2. Creating indexes for coupon_usage collection...");

// Coupon Usage collection indexes
db.coupon_usage.createIndex(
  { "coupon_id": 1, "user_email": 1 }, 
  { name: "coupon_user_email" }
);

db.coupon_usage.createIndex(
  { "coupon_id": 1, "user_id": 1 }, 
  { name: "coupon_user_id" }
);

db.coupon_usage.createIndex(
  { "coupon_id": 1 }, 
  { name: "coupon_usage_coupon_id" }
);

db.coupon_usage.createIndex(
  { "user_email": 1 }, 
  { name: "coupon_usage_user_email" }
);

db.coupon_usage.createIndex(
  { "user_id": 1 }, 
  { name: "coupon_usage_user_id" }
);

db.coupon_usage.createIndex(
  { "order_id": 1 }, 
  { name: "coupon_usage_order_id" }
);

db.coupon_usage.createIndex(
  { "used_at": 1 }, 
  { name: "coupon_usage_date" }
);

db.coupon_usage.createIndex(
  { "status": 1 }, 
  { name: "coupon_usage_status" }
);

print("3. Creating indexes for coupon_categories collection...");

// Coupon Categories collection indexes
db.coupon_categories.createIndex(
  { "name": 1 }, 
  { unique: true, name: "category_name_unique" }
);

db.coupon_categories.createIndex(
  { "is_active": 1 }, 
  { name: "category_active" }
);

db.coupon_categories.createIndex(
  { "sort_order": 1 }, 
  { name: "category_sort_order" }
);

print("✅ All indexes created successfully!");
print("");
print("📋 Index Summary:");
print("Coupons Collection:");
print("  - code (unique) - Ensures coupon codes are unique");
print("  - is_active - Fast filtering of active coupons");
print("  - valid_until - Fast filtering by expiration");
print("  - is_active + valid_until (compound) - Fast active + non-expired queries");
print("  - created_by - Filter coupons by creator");
print("  - metadata.tags - Filter by coupon tags");
print("");
print("Coupon Usage Collection:");
print("  - coupon_id + user_email (compound) - Prevents duplicate usage by email");
print("  - coupon_id + user_id (compound) - Prevents duplicate usage by user ID");
print("  - coupon_id - Fast lookups by coupon");
print("  - user_email - Fast lookups by user email");
print("  - user_id - Fast lookups by user ID");
print("  - order_id - Link usage to orders");
print("  - used_at - Sort by usage date");
print("  - status - Filter by usage status");
print("");
print("Coupon Categories Collection:");
print("  - name (unique) - Ensures category names are unique");
print("  - is_active - Filter active categories");
print("  - sort_order - Sort categories for display");
print("");
print("🎯 Key Performance Benefits:");
print("  - Compound indexes prevent duplicate coupon usage efficiently");
print("  - Single-field indexes speed up common queries");
print("  - Unique indexes ensure data integrity");
print("  - All coupon validation queries will be fast");
