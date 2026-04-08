import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

interface UrlDocument {
  fullUrl: string;
  shortUrl: string;
  clicks: number;
}
const urlSchema = new mongoose.Schema<UrlDocument>({
    fullUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
        default: () => nanoid(8)
    },
    clicks: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    })

// export default mongoose.model('Url', urlSchema);
export const Url = mongoose.model<UrlDocument>('Url', urlSchema);