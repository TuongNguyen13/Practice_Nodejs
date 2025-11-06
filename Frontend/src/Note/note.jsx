import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './note.css';

export function Note() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [newNote, setNewNote] = useState(
    {
      title: '',
      content: '',
      imageUrl: ''
    });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Ghi chú của tôi';
  }, []);

  // Lấy user hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5468/api/auth/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setError('Không thể tải thông tin người dùng');
        }
      } catch {
        setError('Lỗi tải thông tin người dùng');
      }
    };
    fetchUser();
  }, []);

  const normalizeNote = (n) => ({ ...n, id: n.noteid ?? n.NoteId ?? n.id });

  // Lấy danh sách ghi chú (có tìm kiếm + phân trang)
  const fetchNotes = async () => {
    if (!user) return;
    try {
      const res = await fetch(
        `http://localhost:5468/api/notes?search=${searchTerm}&page=${page}&limit=6`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.ok) {
        const data = await res.json();
        // Chuẩn hoá các note để giao diện dùng chung trường `id`
        const normalized = (data.notes || []).map(normalizeNote);
        setNotes(normalized);
        setTotalPages(data.totalPages);
      } else {
        const data = await res.json();
        setError(data.message || 'Không thể tải danh sách ghi chú');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách ghi chú');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchTerm, page, user]);


  // Tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  //  Thêm/sửa ghi chú
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingNote ? 'PUT' : 'POST';
      const url = editingNote
        ? `http://localhost:5468/api/notes/${editingNote.noteid}`
        : `http://localhost:5468/api/notes`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: newNote.title,
          content: newNote.content,
          imageUrl: newNote.imageUrl || null,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setNewNote({ title: '', content: '' });
        setEditingNote(null);
        // Sau khi thêm/sửa -> fetch lại danh sách mới nhất từ server
        await fetchNotes();
      } else {
        const data = await res.json();
        setError(data.message || 'Không thể lưu ghi chú');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi lưu ghi chú');
    }
  };

  //  Mở modal sửa
  const handleEdit = (note) => {
    const normalized = normalizeNote(note);
    setEditingNote(normalized);
    setNewNote({
      title: normalized.title,
      content: normalized.content,
      imageUrl: normalized.imageUrl || ''
    });
    setShowModal(true);
  };

  //  Xóa ghi chú
  const handleDelete = async (note) => {
    if (!window.confirm('Bạn có chắc muốn xóa ghi chú này?')) return;
    try {
      const res = await fetch(`http://localhost:5468/api/notes/${note.noteid}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        await fetchNotes();
      } else {
        const data = await res.json();
        setError(data.message || 'Không thể xóa ghi chú');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi xóa ghi chú');
    }
  };

  const handleAddNew = () => {
    setEditingNote(null);
    setNewNote({ title: '', content: '' });
    setShowModal(true);
  };

  // Đăng xuất: xóa token và chuyển về trang đăng nhập
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="home-container">
      <header>
        <div className="container top-row">
          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
              placeholder="Tìm kiếm ghi chú..."
            />
          </div>
          <div className="actions">
            <button className="add-button" onClick={handleAddNew}>
              Thêm ghi chú
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      <div className="grid-container">
        {notes.map((note) => (
          <div key={note.id ?? note.noteid ?? note.NoteId} className="grid-item">
            {note.imageUrl ?  (
              <div className="note-image">
                <img
                  src={note.imageUrl}
                  alt={note.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('no-image');
                  }}
                  onLoad={(e) => {
                    e.target.parentElement.classList.remove('no-image');
                  }}
                />
              </div>
            ) : (
              <div className="note-image no-image">
                <div className='note-image-placeholder'>Ảnh</div>
              </div>)}
            <div className="grid-content">
              <h3 className="grid-title">{note.title}</h3>
              <p className="grid-description">{note.content?.slice(0, 100)}</p>
              <div className="note-buttons">
                <button onClick={() => handleEdit(note)}>Sửa</button>
                <button onClick={() => handleDelete(note)}>Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Trang trước
        </button>
        <span className='page-container'>{page} / {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </button>
      </div>

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingNote ? 'Sửa ghi chú' : 'Thêm ghi chú'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-input">
                <label>Tiêu đề:</label>
                <input
                  type="text"
                  name="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  required
                />
              </div>
              <div className="modal-input">
                <label>Nội dung:</label>
                <textarea
                  name="content"
                  rows="4"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  required
                ></textarea>
              </div>
              <div className="modal-input">
                <label>URL ảnh minh họa (tùy chọn):</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newNote.imageUrl}
                  onChange={(e) => setNewNote({ ...newNote, imageUrl: e.target.value })}
                />
              </div>
              <div className="modal-button">
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setShowModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Note;
