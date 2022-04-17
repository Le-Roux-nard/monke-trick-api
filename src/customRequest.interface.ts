import { Request } from "express";
import { Collection } from "mongodb";
export default interface CustomRequest extends Request {
	collection: Collection;
}
