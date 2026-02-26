import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User.js";
import { Request, Response, NextFunction } from "express";
import { getJwtSecret } from "../config/auth.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, getJwtSecret());

      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
