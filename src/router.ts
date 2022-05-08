import { Router, Request, Response, NextFunction } from "express";
import { Collection } from "mongodb";
import { zeroWidthShortener, shortenerResult } from "./ZeroWidthShortener.class";
import { collections, init } from "./database/dbConnection";
import bodyParser from "body-parser";
import CustomRequest from "./customRequest.interface";
import { generateEmbed } from "./embed";

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
		let regexResult =
			/(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/.exec(
				req.body.video
			);

		if (!regexResult || !regexResult[1]) return res.status(400).send("Invalid video url");
		let youtubeVideoId = regexResult[1];
		let shortenerResult: shortenerResult = zeroWidthShortener.generateUrl();
		await collection?.insertOne(
			{
				key: shortenerResult.decodedUrl,
				picture: req.body.picture,
				video: youtubeVideoId,
			},
			(err, result) => {
				if (err) {
					res.status(500).send("An Error Occured");
				} else {
					res.status(200).send({
						shortUrl: `${req.headers.host}${req.baseUrl ? `${req.baseUrl}/` : ""}${shortenerResult.encodedUrl}`,
					});
				}
			}
		);
	});

	router.get("/", (req: Request, res: Response) => {
		res.render("monke/index", {baseUrl : req.baseUrl});
	});

	router.get("/create", (req: Request, res: Response) => {
		return res.render("monke/create", {baseUrl: req.baseUrl});
	});

	router.get("/:zeroWidth", async (req: Request, res: Response) => {
		let decoded = zeroWidthShortener.decode(req.params.zeroWidth);
		collection?.findOne({ key: decoded }, (err, result) => {
			if (err || !result) {
				res.status(500).send("An Error Occured");
			} else {
				console.log(result);
				return res.status(200).send(generateEmbed(result.video, result.picture));
			}
		});
	});

	return router;
};
