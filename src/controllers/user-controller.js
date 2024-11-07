import userService from "../services/user-service.js";

const checkUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    const isAvailable = await userService.checkUsername(username);
    res.status(200).json({ data: isAvailable });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const token = await userService.loginUser(req.body);
    res.status(200).json({ data: token });
  } catch (error) {
    next(error);
  }
};

export default {
  checkUsername,
  registerUser,
  loginUser,
};
