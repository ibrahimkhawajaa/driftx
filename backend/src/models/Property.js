import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    images: [{ type: String }],
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true, min: 0 },
    isForRent: { type: Boolean, default: false },
    category: {
      type: String,
      enum: [
        "apartment",
        "villa",
        "house",
        "studio",
        "penthouse",
        "cabin",
        "other",
      ],
      default: "apartment",
    },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
