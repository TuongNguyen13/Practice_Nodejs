import * as authService from '../services/service.js';

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  console.log('Payload nhận từ client:', req.body);
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await authService.getUser(req.user.id);
    res.json(user);
  } catch (error) {
    console.error('Lỗi lấy thông tin user:', error.message);
    res.status(400).json({ message: error.message });
  }
};
export { register, login, getUser };