import express from "express";
import Property from "../models/Property.js";
import { upload } from "../middleware/upload.js";
import { requireAdmin } from "../middleware/admin.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

function publicUrl(req, filename) {
  if (!filename) return "";
  const base = `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/${filename}`;
}

/** GET /api/properties — search & filters */
router.get("/", async (req, res) => {
  try {
    const {
      q,
      category,
      minBeds,
      minBaths,
      hasKitchen,
      isForRent,
      featured,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    if (q && String(q).trim()) {
      const term = String(q).trim();
      filter.$or = [
        { title: { $regex: term, $options: "i" } },
        { location: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    const beds = minBeds != null && minBeds !== "" ? Number(minBeds) : null;
    if (beds != null && !Number.isNaN(beds)) {
      filter.bedrooms = { $gte: beds };
    }

    const baths = minBaths != null && minBaths !== "" ? Number(minBaths) : null;
    if (baths != null && !Number.isNaN(baths)) {
      filter.bathrooms = { $gte: baths };
    }

    if (isForRent === "true") filter.isForRent = true;
    if (isForRent === "false") filter.isForRent = false;

    if (featured === "true") filter.featured = true;

    const minP = minPrice != null && minPrice !== "" ? Number(minPrice) : null;
    const maxP = maxPrice != null && maxPrice !== "" ? Number(maxPrice) : null;
    if (minP != null && !Number.isNaN(minP)) {
      filter.price = { ...filter.price, $gte: minP };
    }
    if (maxP != null && !Number.isNaN(maxP)) {
      filter.price = { ...filter.price, $lte: maxP };
    }

    // "kitchen" in frontend is a counter; treat >0 as optional tag (we store description only)
    // For filtering we skip unless you add a field; optional: description contains 'kitchen'
    if (hasKitchen === "true") {
      filter.description = { $regex: /kitchen/i };
    }

    const limitRaw = req.query.limit;
    const lim =
      limitRaw != null && limitRaw !== ""
        ? Math.min(200, Math.max(1, Number(limitRaw)))
        : null;
    let query = Property.find(filter).sort({ createdAt: -1 });
    if (lim != null && !Number.isNaN(lim)) {
      query = query.limit(lim);
    }
    const list = await query.lean();
    const mapped = list.map((p) => ({
      ...p,
      id: p._id.toString(),
      imageUrl: p.imageUrl?.startsWith("http")
        ? p.imageUrl
        : publicUrl(req, path.basename(p.imageUrl || "")),
      images: (p.images || []).map((img) =>
        img?.startsWith("http") ? img : publicUrl(req, path.basename(img))
      ),
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list properties" });
  }
});

/** GET /api/properties/:id */
router.get("/:id", async (req, res) => {
  try {
    const p = await Property.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ error: "Not found" });
    const out = {
      ...p,
      id: p._id.toString(),
      imageUrl: p.imageUrl?.startsWith("http")
        ? p.imageUrl
        : publicUrl(req, path.basename(p.imageUrl || "")),
      images: (p.images || []).map((img) =>
        img?.startsWith("http") ? img : publicUrl(req, path.basename(img))
      ),
    };
    res.json(out);
  } catch (err) {
    res.status(404).json({ error: "Not found" });
  }
});

/** POST /api/properties — admin, multipart */
router.post(
  "/",
  requireAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]),
  async (req, res) => {
    try {
      const imageFile = req.files?.image?.[0];
      const extraFiles = req.files?.images || [];

      if (!imageFile) {
        return res.status(400).json({ error: "Cover image file is required" });
      }

      const imageUrl = `/uploads/${imageFile.filename}`;
      const images = extraFiles.map((file) => `/uploads/${file.filename}`);
      const {
        title,
        price,
        location,
        bedrooms,
        bathrooms,
        area,
        isForRent,
        category,
        featured,
        rating,
        description,
      } = req.body;

      const doc = await Property.create({
        title,
        price: Number(price),
        location,
        imageUrl,
        images,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        isForRent: isForRent === "true" || isForRent === true,
        category: category || "apartment",
        featured: featured === "true" || featured === true,
        rating: rating != null ? Number(rating) : 4.5,
        description: description || "",
      });

      res.status(201).json({
        ...doc.toObject(),
        id: doc._id.toString(),
        imageUrl: publicUrl(req, imageFile.filename),
        images: images.map((img) => publicUrl(req, path.basename(img))),
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message || "Create failed" });
    }
  }
);

/** DELETE /api/properties/:id — admin */
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const p = await Property.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
