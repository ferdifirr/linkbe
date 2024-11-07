import jwt from "jsonwebtoken";
import { ResponseError } from "../error/response-error.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Cek apakah header Authorization ada
    if (!authHeader) {
      throw new ResponseError(401, "Authorization header is missing");
    }

    const token = authHeader.split(" ")[1];

    // Cek apakah token ada
    if (!token) {
      throw new ResponseError(401, "JWT token is missing");
    }

    // Verifikasi token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new ResponseError(401, "Invalid JWT token");
      }

      // Jika token valid, simpan data pengguna di req.user
      req.user = decoded;
      next();
    });
  } catch (err) {
    next(err); // Kirim error ke errorMiddleware
  }
};

export { authMiddleware };
