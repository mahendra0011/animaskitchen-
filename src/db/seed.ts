import { db } from "./index";
import {
  branches,
  deliveryZones,
  menuCategories,
  menuItems,
  thaliAddons,
  coupons,
  inventoryItems,
} from "./schema";
import {
  INITIAL_BRANCHES,
  INITIAL_DELIVERY_ZONES,
  INITIAL_MENU_ITEMS,
  REQUIRED_THALI_ADDONS,
  INITIAL_COUPONS,
  INITIAL_INVENTORY_ITEMS,
} from "../data/mockKitchenData";

export async function seedDatabase() {
  console.log("Seeding Anima's Kitchen database from kitchen baseline...");

  try {
    // 1. Seed Branches
    for (const b of INITIAL_BRANCHES) {
      await db
        .insert(branches)
        .values({
          id: b.id,
          name: b.name,
          address: b.address,
          lat: "12.9716",
          lng: "77.5946",
          phone: b.phone,
          isOpen: b.status === "active",
          gstNo: "29AAAAA0000A1Z5",
          fssaiNo: "11223344556677",
        })
        .onConflictDoNothing();
    }
    console.log(`✓ Seeded ${INITIAL_BRANCHES.length} branches`);

    // 2. Seed Delivery Zones
    for (const z of INITIAL_DELIVERY_ZONES) {
      const radiusNum = parseInt(z.radiusKm.replace(/\D/g, ""), 10) || 5;
      await db
        .insert(deliveryZones)
        .values({
          id: z.id,
          branchId: "branch-blr-01",
          name: z.name,
          radiusKm: radiusNum,
          feePaise: Math.round(z.deliveryFee * 100),
          minOrderPaise: Math.round(z.minOrder * 100),
          etaMin: 35,
        })
        .onConflictDoNothing();
    }
    console.log(`✓ Seeded ${INITIAL_DELIVERY_ZONES.length} delivery zones`);

    // 3. Seed Menu Categories
    const categories = Array.from(new Set(INITIAL_MENU_ITEMS.map((item) => item.category)));
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      if (!cat) continue;
      await db
        .insert(menuCategories)
        .values({
          id: `cat_${cat.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
          name: cat,
          sortOrder: i,
        })
        .onConflictDoNothing();
    }
    console.log(`✓ Seeded ${categories.length} menu categories`);

    // 4. Seed Menu Items
    for (const item of INITIAL_MENU_ITEMS) {
      await db
        .insert(menuItems)
        .values({
          id: item.id,
          categoryId: `cat_${item.category.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
          categoryName: item.category,
          name: item.name,
          description: item.description,
          pricePaise: Math.round(item.price * 100),
          isVeg: item.isVeg,
          image: item.image,
          badge: item.badge || null,
          isTodaySpecial: item.isTodaySpecial || false,
          isAvailable: item.isAvailable,
          preparationTimeMinutes: item.preparationTimeMinutes,
          rating: String(item.rating),
          reviewCount: item.reviewCount,
          isThali: item.isThali || false,
          includedItems: item.includedItems || [],
          allowedAddons: item.allowedAddons || [],
          nutrition: item.nutrition || null,
          sizeVariants: item.sizeVariants || null,
        })
        .onConflictDoNothing();
    }
    console.log(`✓ Seeded ${INITIAL_MENU_ITEMS.length} menu items`);

    // 5. Seed Thali Addons
    for (const addon of REQUIRED_THALI_ADDONS) {
      await db
        .insert(thaliAddons)
        .values({
          id: addon.id,
          code: addon.code,
          name: addon.name,
          portion: addon.portion,
          pricePaise: Math.round(addon.price * 100),
          description: addon.description || null,
          isVeg: addon.isVeg,
        })
        .onConflictDoNothing();
    }
    console.log(`✓ Seeded ${REQUIRED_THALI_ADDONS.length} thali addons`);

    for (const c of INITIAL_COUPONS) {
      const dt = c.discountType as string;
      const discountType = dt === "percent" || dt === "percentage" ? "percentage" : "fixed";
      await db
        .insert(coupons)
        .values({
          id: c.code.toLowerCase(),
          code: c.code,
          description: c.description,
          discountType,
          discountValue:
            discountType === "percentage" ? c.discountValue : Math.round(c.discountValue * 100),
          minOrderPaise: Math.round(c.minOrderValue * 100),
          maxDiscountPaise: c.maxDiscount ? Math.round(c.maxDiscount * 100) : null,
          isActive: c.isActive,
        })
        .onConflictDoNothing();
    }
    console.log(`✓ Seeded ${INITIAL_COUPONS.length} coupons`);

    // 7. Seed Admin & Rider Users
    const adminEmail = (process.env["ADMIN_EMAIL"] || "Animaskitchen24@gmail.com")
      .trim()
      .toLowerCase();
    const adminPassword = process.env["ADMIN_PASSWORD"] || "K9!xM7#qL2";
    const adminName = process.env["ADMIN_NAME"] || "Anima Kitchen Admin";

    const riderEmail = (process.env["RIDER_EMAIL"] || "Sanjay.k.singh2003@gmail.com")
      .trim()
      .toLowerCase();
    const riderPassword = process.env["RIDER_PASSWORD"] || "R8@vP5!zT9";
    const riderName = process.env["RIDER_NAME"] || "Sanjay K Singh";
    const riderPhone = process.env["RIDER_PHONE"] || "+91 98450 12345";

    const { hashPasswordSecure } = await import("../server/security/guard");
    const { users } = await import("./schema");

    await db
      .insert(users)
      .values([
        {
          email: adminEmail,
          name: adminName,
          phone: "+91 99999 88888",
          passwordHash: hashPasswordSecure(adminPassword),
          role: "admin",
          isEmailVerified: true,
        },
        {
          email: riderEmail,
          name: riderName,
          phone: riderPhone,
          passwordHash: hashPasswordSecure(riderPassword),
          role: "rider",
          isEmailVerified: true,
        },
      ])
      .onConflictDoNothing();
    console.log("✓ Seeded Admin and Delivery Boy accounts");

    console.log(" Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
