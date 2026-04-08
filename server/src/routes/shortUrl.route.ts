import express from 'express';
import { createShortUrl, deleteShortUrl, getShortUrls, updateShortUrl, getAllShortUrls } from '../controller/shortUrl.controller';

const router = express.Router();

router.post("/shorten", createShortUrl);

// get all short urls
router.get("/shorten", getAllShortUrls);

// get single record by shortUrl and redirect
router.get("/:shortUrl", getShortUrls);

router.put("/shorten/:id", updateShortUrl);

router.delete("/shorten/:id", deleteShortUrl);


export default router;