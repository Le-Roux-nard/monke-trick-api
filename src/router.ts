import { Router, Request, Response, NextFunction } from "express";
import { Collection } from "mongodb";
import { zeroWidthShortener, shortenerResult } from "./ZeroWidthShortener.class";
import { collections, init } from "./database/dbConnection";
import bodyParser from "body-parser";
import CustomRequest from "./customRequest.interface";

const router = Router();

router.use(bodyParser.urlencoded({ extended: false }));

export default ({ collection }: { collection: Collection | undefined }) => {
	if (!!collection) {
		router.use("*", (req: Request, res: Response, next: NextFunction) => {
			(req as CustomRequest).collection = collection;
			next();
		});
	} else {
		init().then(() => {
			router.use("*", (req: Request, res: Response, next: NextFunction) => {
				if (collections.urls) {
					(req as CustomRequest).collection = collections.urls;
				} else {
					res.status(500).send("An Error Occured");
				}
				next();
			});
		});
	}

	router.post("/create", async (req: Request, res: Response) => {
		if (!req.body.picture || !req.body.video) return res.status(400).send("Missing picture or video");

		//regex from https://regex101.com/r/OY96XI/1
		let youtubeVideoId =
			/(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/.exec(
				req.body.video
			)![1];
		let shortenerResult: shortenerResult = zeroWidthShortener.generateUrl();
		await collection?.insertOne(
			{
				key: shortenerResult.url,
				picture: req.body.picture,
				video: youtubeVideoId,
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
		collection?.findOne({ key: decoded }, (err, result) => {
			if (err || !result) {
				res.status(500).send("An Error Occured");
			} else {
				console.log(result);
				res.status(200).send(`
				<!DOCTYPE html>
				<head>
					<meta property="og:type" content="video.other">
					<meta property="twitter:player" content="https://youtube.com/embed/${result.video}">
					<meta property="og:video:type" content="text/html">
					<meta property="og:video:width" content="900">
					<meta property="og:video:height" content="506">
					<meta name="twitter:image" content="${result.picture}">
					<meta http-equiv="refresh" content="0;url=https://youtube.com/watch?v=${result.video}">
				</head>`);
			}
		});
	});

	return router;
};
