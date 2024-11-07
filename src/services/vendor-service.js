import { validate, validateImageFile } from "../validation/validation.js";
import { registerVendorValidation } from "../validation/vendor-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { users_role } from "@prisma/client";
import path from "path";
import jwt from "jsonwebtoken";

const registerVendor = async (imageFile, vendor) => {
  if (imageFile) {
    const image = validateImageFile(imageFile);
    if (image.error) {
      throw new ResponseError(400, image.error.message);
    }
    vendor.image_path = path.basename(image.value.path);
  }

  vendor = validate(registerVendorValidation, vendor);
  const user = await prismaClient.users.findUnique({
    where: { id: vendor.user_id },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  if (user.role !== users_role.user) {
    throw new ResponseError(403, "Forbidden");
  }

  const newVendor = await prismaClient.vendors.create({
    data: {
      user_id: vendor.user_id,
      business_name: vendor.business_name,
      description: vendor.description,
      image_path: vendor.image_path,
      latitude: vendor.latitude,
      longitude: vendor.longitude,
    },
  });

  await prismaClient.users.update({
    where: { id: vendor.user_id },
    data: { role: users_role.vendor },
  });

  const token = jwt.sign(
    {
      id: user.id,
      vendor_id: newVendor.id,
      username: user.username,
      email: user.email,
      role: users_role.vendor,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  newVendor.token = token;

  return newVendor;
};

export default { registerVendor };
