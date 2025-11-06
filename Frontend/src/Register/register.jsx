import { useState, useEffect } from "react";
import './register.css';

function useTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function Register() {
  useTitle('Đăng ký');

  const [form, setForm] = useState({
    userId: '',
    username: '',
    gender: '',
    birthday: '',
    email: '',
    phonenumber: '',
    password: '',
    confirmPassword: '',
  });

  const resetForm = () => {
    setForm({
      userId: '',
      username: '',
      gender: '',
      birthday: '',
      email: '',
      phonenumber: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu trống
    for (const key in form) {
      if (key !== "userId" && form[key].trim() === "") {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }
    }

    // Kiểm tra mật khẩu
    if (form.password !== form.confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      const res = await fetch('http://localhost:5468/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          gender: form.gender,
          birthday: form.birthday,
          email: form.email,
          phonenumber: form.phonenumber,
          password: form.password,
        }),
      });
      console.log("Dữ liệu gửi đi:", form);
      const data = await res.json();
      console.log("Phản hồi server:", data);
      if (res.ok) {
        alert('Đăng ký thành công!');
        resetForm();
        window.location.href = '/login';
      } else {
        alert(data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Lỗi fetch:', error);
      alert('Không thể kết nối đến server');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Đăng ký</h2>
        <br />
        <input
          type="text"
          name="username"
          placeholder="Họ và tên"
          value={form.username}
          onChange={handleChange}
        />
        <br />
        <select
          name="gender"
          onChange={handleChange}
          value={form.gender}
        >
          <option value="" disabled>Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
        <br />
        <input
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="phonenumber"
          placeholder="Số điện thoại"
          value={form.phonenumber}
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.pass}
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Đăng ký</button>
        <br />
        <p className='login-link'>
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
