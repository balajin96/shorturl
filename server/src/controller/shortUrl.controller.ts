import express, { Request, Response } from 'express';
import { urlSchemaValidator, shortUrlParamValidator } from '../validators/url.validator';
import { Url } from './../schema/url.schema';
import logger from '../helper/logger';

export const createShortUrl = async (req: Request, res: Response) => {
    try {
        const { fullUrl } = req.body;
        const validated = urlSchemaValidator.parse({ fullUrl });
        const existingUrl = await Url.findOne({ fullUrl: validated.fullUrl });
        if (existingUrl) {
            return res.status(200).json({
                message: "Short URL already exists for that destination",
                data: existingUrl
            });
        }
        const newUrl = new Url(validated);
        const savedUrl = await newUrl.save();
        return res.status(201).json({ message: "Short URL created successfully", data: savedUrl });

    } catch (error) {
        return res.status(400).json({ message: "Error creating short URL", error });
    }
}

export const getAllShortUrls = async (req: Request, res: Response) => {
    try {
        logger.info("Received request to retrieve all short URLs");
        const urls = await Url.find();
        return res.status(200).json({ message: "All short URLs retrieved successfully", data: urls });
    } catch (error) {
        logger.error(`Error retrieving short URLs: ${error}`);
        return res.status(500).json({ message: "Error retrieving short URLs", error });
    }
};

export const getShortUrls = async (req: Request, res: Response) => {
    try {
        /**
         * NOTE: zod implementation
        const { shortUrl } = req.params;
        const validated = shortUrlParamValidator.parse({ shortUrl });
        console.log("💀", validated.shortUrl);

        logger.info(`Received request to retrieve short URL: ${validated.shortUrl}`);
        const url = await Url.find({ shortUrl: validated.shortUrl });
        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }
        return res.status(200).send(url); 
        */

        const { shortUrl } = req.params;
        const validated = shortUrlParamValidator.parse({ shortUrl });
        if (!shortUrl) {
            return res.status(400).json({ message: "Short URL is required" });
        }
        const url = await Url.findOne({ shortUrl: validated.shortUrl });
        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }
        return res.redirect(url.fullUrl);

    } catch (error) {
        logger.error(`Error retrieving short URL: ${error}`);
        return res.status(500).json({ message: "Error retrieving short URL" });
    }

};


export const updateShortUrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fullUrl } = req.body;

        const validated = urlSchemaValidator.parse({ fullUrl });
        const updatedUrl = await Url.findByIdAndUpdate(id, { fullUrl: validated.fullUrl }, { new: true });
        if (!updatedUrl) {
            return res.status(404).json({ message: "URL not found" });
        } else {
            return res.status(200).json({ message: "Short URL updated successfully", data: updatedUrl });
        }
    } catch (error) {
        logger.error(`Error updating short URL: ${error}`);
        return res.status(500).json({ message: "Error updating short URL", error });
    }
}

export const deleteShortUrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const url = await Url.findByIdAndDelete(id);
        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }
        return res.status(200).json({ message: "Short URL deleted successfully", data: url });

    } catch (error) {
        logger.error(`Error deleting short URL: ${error}`);
        return res.status(500).json({ message: "Error deleting short URL", error });
    }
}
