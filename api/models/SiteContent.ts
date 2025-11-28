import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema);
