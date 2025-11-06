import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './vocabulary.css';

export function Vocabulary() {
  const { title } = useParams();
  const navigate = useNavigate();
  const [vocabList, setVocabList] = useState([]);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicId, setTopicId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({ vocabId: null, word: '', type: '', meaning: '', example: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Lấy topicId và danh sách từ vựng
  useEffect(() => {
    if (!title) {
      setError('Không tìm thấy tên chủ đề');
      navigate('/topics');
      return;
    }

    const fetchTopic = async () => {
      try {
        console.log('Fetching topic with title:', title); // Debug
        const res = await fetch(`http://localhost:5468/api/topic/by-title/${encodeURIComponent(title)}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Topic data:', data); // Debug
          setTopicId(data._id);
          setVocabList(data.vocabularies || []);
          setTopicTitle(data.title || 'Chủ đề');
          document.title = `Từ vựng - ${data.title}`;
        } else {
          const data = await res.json();
          console.log('API error:', data); // Debug
          setError(data.message || 'Không tìm thấy chủ đề');
          navigate('/topics');
        }
      } catch (err) {
        console.error('Error fetching topic:', err); // Debug
        setError('Đã xảy ra lỗi khi tải chủ đề');
        navigate('/topics');
      }
    };

    fetchTopic();
    setCurrentPage(1);
  }, [title, navigate]);

  // Ẩn context menu khi click bên ngoài
  useEffect(() => {
    const hideMenu = () => setContextMenu((prev) => ({ ...prev, visible: false }));
    window.addEventListener('click', hideMenu);
    return () => window.removeEventListener('click', hideMenu);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      item,
    });
  };

  const openAddModal = () => {
    setFormMode('add');
    setFormData({ vocabId: null, word: '', type: '', meaning: '', example: '' });
    setShowFormModal(true);
  };

  const handleEdit = () => {
    setFormMode('edit');
    setFormData(contextMenu.item);
    setShowFormModal(true);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!topicId) {
      setError('ID chủ đề không hợp lệ');
      return;
    }
    try {
      if (formMode === 'add') {
        const res = await fetch(`http://localhost:5468/api/topic/${topicId}/vocabularies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            word: formData.word,
            type: formData.type,
            meaning: formData.meaning,
            example: formData.example,
          }),
        });
        if (res.ok) {
          const updatedTopic = await res.json();
          setVocabList(updatedTopic.vocabularies || []);
          setShowFormModal(false);
        } else {
          const data = await res.json();
          setError(data.message || 'Thêm từ vựng thất bại');
        }
      } else if (formMode === 'edit') {
        const res = await fetch(`http://localhost:5468/api/topic/${topicId}/vocabularies/${formData.vocabId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            word: formData.word,
            type: formData.type,
            meaning: formData.meaning,
            example: formData.example,
          }),
        });
        if (res.ok) {
          const updatedTopic = await res.json();
          setVocabList(updatedTopic.vocabularies || []);
          setShowFormModal(false);
        } else {
          const data = await res.json();
          setError(data.message || 'Sửa từ vựng thất bại');
        }
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi lưu từ vựng');
    }
  };

  const handleDelete = () => {
    setItemToDelete(contextMenu.item);
    setShowDeleteConfirm(true);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const confirmDelete = async () => {
    if (!topicId) {
      setError('ID chủ đề không hợp lệ');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5468/api/topic/${topicId}/vocabularies/${itemToDelete.vocabId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        const updatedTopic = await res.json();
        setVocabList(updatedTopic.vocabularies || []);
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      } else {
        const data = await res.json();
        setError(data.message || 'Xóa từ vựng thất bại');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi xóa từ vựng');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  // Lọc dữ liệu theo search
  const filteredList = vocabList.filter((item) =>
    item.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div>
      <header>
        <div className="container">
          <div className="search-container">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
              placeholder="Tìm kiếm..."
            />
            <button className="add-button" onClick={openAddModal}>
              Thêm từ vựng mới
            </button>
          </div>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="vocabulary-container">
        <h3>{topicTitle}</h3>
        <table className="vocabulary-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Từ vựng</th>
              <th>Từ loại</th>
              <th>Nghĩa</th>
              <th>Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.vocabId} onContextMenu={(e) => handleContextMenu(e, item)}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.word}</td>
                  <td>{item.type}</td>
                  <td>{item.meaning}</td>
                  <td>{item.example}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  Không có từ vựng
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Menu chuột phải */}
        {contextMenu.visible && (
          <ul className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
            <li onClick={handleEdit}>Sửa</li>
            <li onClick={handleDelete}>Xóa</li>
          </ul>
        )}

        {/* Modal thêm/sửa từ vựng */}
        {showFormModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{formMode === 'add' ? 'Thêm từ vựng' : 'Sửa từ vựng'}</h3>
              <form onSubmit={handleFormSubmit} className="form-container">
                <input
                  type="text"
                  placeholder="Từ vựng"
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Từ loại"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Nghĩa"
                  value={formData.meaning}
                  onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Ví dụ"
                  value={formData.example}
                  onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                  required
                />
                <div className="modal-buttons">
                  <button type="submit" className="btn-yes">
                    Lưu
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setShowFormModal(false)}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Xác nhận xóa */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <p>Bạn có chắc muốn xóa "{itemToDelete?.word}" không?</p>
              <div className="modal-buttons">
                <button onClick={confirmDelete} className="btn-yes">
                  Yes
                </button>
                <button onClick={cancelDelete} className="btn-cancel">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nút phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>
            Trang trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}

export default Vocabulary;