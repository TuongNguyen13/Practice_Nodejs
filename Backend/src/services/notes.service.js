import Note from '../models/notes.js';
import { Op } from 'sequelize';

export const getNotes = async (userId, search, page = 1, limit = 6) => {
    const offset = (page - 1) * limit;
    const whereClause = {
        UserId: userId,
        ...(search ? { Title: { [Op.like]: `%${search}%` } } : {}),
    };

    const { rows, count } = await Note.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['id', 'DESC']],
    });

    return {
        notes: rows,
        totalPages: Math.ceil(count / limit),
    };
};

export const createNote = async (userId, data) => {
  console.log('Dữ liệu body nhận được trong service:', data);
  const { title, content } = data;
  if (!title || !content) throw new Error('Vui lòng nhập đầy đủ tiêu đề và nội dung');

  
  const lastNote = await Note.findOne({
    attributes: [[Note.sequelize.fn('MAX', Note.sequelize.col('NoteId')), 'maxId']],
  });

  let newNoteId = 'nt001';
  if (lastNote && lastNote.get('maxId')) {
    const lastStr = lastNote.get('maxId'); // ví dụ: "nt005"
    const lastNumber = parseInt(lastStr.replace('nt', ''), 10);
    if (!isNaN(lastNumber)) {
      newNoteId = `nt${String(lastNumber + 1).padStart(3, '0')}`;
    }
  }


  const exists = await Note.findOne({ where: { NoteId: newNoteId } });
  if (exists) {
    throw new Error('Lỗi hệ thống: Mã ghi chú bị trùng. Vui lòng thử lại.');
  }

  // Tạo note
  const note = await Note.create({
    userid: userId,
    noteid: newNoteId,
    title: title,
    content: content,
    imageUrl: data.imageUrl || null,
    IsPublic: 0,
  });

  return note;
};




export const updateNote = async (noteId, userId, data) => {
    console.log('Cập nhật noteId:', noteId, 'với dữ liệu:', data);
    
    
    const note = await Note.findOne({ 
        where: { noteid: noteId, userid: userId } 
    });
    
    console.log('Note found for update:', note);
    if (!note) throw new Error('Không tìm thấy ghi chú');
    
    note.title = data.title;     
    note.content = data.content;  
    note.imageUrl = data.imageUrl || null;
    await note.save();
    return note;
};

export const deleteNote = async (noteId, userId) => {
   
    const note = await Note.findOne({ 
        where: { noteid: noteId, userid: userId } 
    });
    
    if (!note) throw new Error('Không tìm thấy ghi chú');
    await note.destroy();
    return { message: 'Đã xóa ghi chú thành công' };
};
