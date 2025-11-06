import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const registerUser = async (reqBody) => {
  const { username, gender, birthday, email, phonenumber, password } = reqBody;

  if (!username || !gender || !birthday || !email || !phonenumber || !password) {
    throw new Error('Vui lòng điền đầy đủ thông tin');
  }

  // Kiểm tra email, phone
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) throw new Error('Email đã tồn tại');

  const existingPhone = await User.findOne({ where: { phonenumber } });
  if (existingPhone) throw new Error('Số điện thoại đã tồn tại');

  // Tạo userid
  const lastUser = await User.findOne({ order: [['id', 'DESC']] });
  let newUserId = 'hv001';
  if (lastUser && lastUser.userid) {
    const lastNumber = parseInt(lastUser.userid.replace('hv', ''), 10);
    if (!isNaN(lastNumber)) {
      newUserId = `hv${String(lastNumber + 1).padStart(3, '0')}`;
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    userid: newUserId,
    username,
    gender,
    birthday,
    email,
    phonenumber,
    password: hashedPassword,
  });

  return { message: 'Đăng ký thành công' };
};

const loginUser = async (data) => {
  const { email, password } = data;
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Email hoặc mật khẩu không đúng');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Email hoặc mật khẩu không đúng');

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
};

const getUser = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });
  if (!user) throw new Error('User không tồn tại');
  return user;
};

export { registerUser, loginUser, getUser };
