import * as noteService from '../services/notes.service.js';

export const getNotes = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const userId = req.user.id; 
    const { search = '', page = 1, limit = 6 } = req.query;
    const data = await noteService.getNotes(userId, search, parseInt(page), parseInt(limit));
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const userId = req.user.id;
    const note = await noteService.createNote(userId, req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.noteId;  
    console.log('Cập nhật noteId:', noteId);

    const note = await noteService.updateNote(noteId, userId, req.body);
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.noteId;  
    const result = await noteService.deleteNote(noteId, userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
