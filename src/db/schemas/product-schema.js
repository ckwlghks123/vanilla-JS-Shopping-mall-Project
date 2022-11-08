import { Schema } from 'mongoose';

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            requred: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'categories',
        },
        description: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        // 리뷰 추가하면 populate 해야할듯
    },
    {
        collection: 'products',
        timestamps: true,
    }
);

export { ProductSchema };
