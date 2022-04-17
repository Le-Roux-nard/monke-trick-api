import { Router, Request, Response, NextFunction } from "express";
import { zeroWidthShortener, shortenerResult } from "./ZeroWidthShortener.class";
import { collections, init } from "./database/dbConnection";
import bodyParser from "body-parser";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.post("/create", async (req: Request, res: Response) => {
	let shortenerResult: shortenerResult = zeroWidthShortener.generateUrl();
	await collections.urls?.insertOne(
		{
			key: shortenerResult.url,
			picture: req.body.picture,
			video: req.body.video,
		},
		(err, result) => {
			if (err) {
				res.status(500).send("An Error Occured");
			} else {
				res.status(200).send({
					shortUrl: shortenerResult.shortUrl,
					hash: shortenerResult.url,
				});
			}
		}
	);
});

router.get("/:zeroWidth", async (req: Request, res: Response) => {
	let decoded = zeroWidthShortener.decode(req.params.zeroWidth);
	collections.urls?.findOne({ key: decoded }, (err, result) => {
		if (err || !result) {
			res.status(500).send("An Error Occured");
		} else {
			console.log(result);
			res.status(200).send(`
			<!DOCTYPE html>
			<head>
				<meta property="og:type" content="video.other">
				<meta property="twitter:player" content="${result.video}">
				<meta property="og:video:type" content="text/html">
				<meta property="og:video:width" content="900">
				<meta property="og:video:height" content="506">
				<meta name="twitter:image" content="${result.picture}">
				<meta http-equiv="refresh" content="0;url=${result.video}">
			</head>`);
		}
	});
});

export default () => router;
