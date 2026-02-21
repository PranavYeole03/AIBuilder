import express from "express"
import isAuth from "../middleware/isAuth.js";
import { deleteWebsite, deploy, generateWebsite, getAll, getBySlug, getWebsiteById, updateweb } from "../controllers/website.controllers.js";

const websiteRouter = express.Router()

websiteRouter.post("/generate", isAuth, generateWebsite)
websiteRouter.post("/update/:id", isAuth, updateweb)
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById)
websiteRouter.get("/get-all", isAuth, getAll)
websiteRouter.get("/deploy/:id", isAuth, deploy)
websiteRouter.get("/get-by-slug/:slug", isAuth, getBySlug)
websiteRouter.delete("/delete/:id", isAuth, deleteWebsite);


export default websiteRouter;