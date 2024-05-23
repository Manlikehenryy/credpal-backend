import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../../CustomRequest.js";

const protectRoute = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    //if token is empty
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const secret = process.env.JWT_SECRET;

    var decoded: any = null;

    if (secret) {
      decoded = jwt.verify(token, secret);
    }

    //if token is invalid
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(
      "Error in protectRoute middleware: ",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
