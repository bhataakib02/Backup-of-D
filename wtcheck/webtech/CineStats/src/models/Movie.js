import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 10 },
    comment: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1888 },
    director: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    worldwideGross: { type: Number, required: true, min: 0 },
    domesticGross: { type: Number, default: 0, min: 0 },
    internationalGross: { type: Number, default: 0, min: 0 },
    runtimeMinutes: { type: Number, default: 0, min: 0 },
    releaseDate: { type: Date },
    posterURL: { type: String, required: true },
    description: { type: String, default: '' },
    reviews: { type: [ReviewSchema], default: [] },
  },
  { timestamps: true }
);

MovieSchema.index({ title: 'text', director: 'text', genre: 'text' });

export default mongoose.model('Movie', MovieSchema);


