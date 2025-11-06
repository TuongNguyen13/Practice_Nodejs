import express from 'express';
import * as noteController from '../controllers/note.controller.js';
import authMiddleware from '../middleware/authmiddleware.js';

const router = express.Router();


router.get('/', authMiddleware, noteController.getNotes);


router.post('/', authMiddleware, noteController.createNote);


router.put('/:noteId', authMiddleware, noteController.updateNote);


router.delete('/:noteId', authMiddleware, noteController.deleteNote);

export default router;