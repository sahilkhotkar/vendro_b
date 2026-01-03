import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getChats = async (req: Request, res: Response) => {
  try {
    // 1. Get all chats
    const [chats]: any = await pool.query('SELECT * FROM chats ORDER BY lastUpdated DESC');
    
    // 2. Hydrate with messages (Not efficient for huge scale, but good for MVP)
    const chatsWithMessages = await Promise.all(chats.map(async (chat: any) => {
      const [messages]: any = await pool.query('SELECT * FROM messages WHERE chatId = ? ORDER BY timestamp ASC', [chat.id]);
      return {
        ...chat,
        // participants in DB is JSON string, parse if needed depending on mysql2 config
        // mysql2 usually handles JSON columns automatically if configured, otherwise:
        // participants: typeof chat.participants === 'string' ? JSON.parse(chat.participants) : chat.participants,
        messages
      };
    }));

    res.json(chatsWithMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chats', error });
  }
};

export const createChat = async (req: Request, res: Response) => {
  const { id, participants, lastUpdated } = req.body;
  try {
    // Check if exists
    const [existing]: any = await pool.query('SELECT * FROM chats WHERE id = ?', [id]);
    if (existing.length === 0) {
      await pool.query('INSERT INTO chats SET ?', [{ id, participants: JSON.stringify(participants), lastUpdated }]);
    }
    res.status(201).json({ message: 'Chat created/verified' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat', error });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const message = req.body;
  try {
    await pool.query('INSERT INTO messages SET ?', [{ ...message, chatId }]);
    await pool.query('UPDATE chats SET lastUpdated = ? WHERE id = ?', [message.timestamp, chatId]);
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};
