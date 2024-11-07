import vendorService from "../services/vendor-service.js";

const registerVendor = async (req, res, next) => {
  try {
    req.body.user_id = req.user.id;
    const vendor = await vendorService.registerVendor(req.file, req.body);
    res.status(201).json({ data: vendor });
  } catch (error) {
    next(error);
  }
};

export default {
  registerVendor,
};
