
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getCases = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).auth;
    const { data, error } = await supabase
      .from('cases')
      .select('*, clients(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCase = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).auth;
    const { client_id, title, type, status } = req.body;

    const { data, error } = await supabase
      .from('cases')
      .insert({ client_id, title, type, status, user_id: userId })
      .select('*, clients(name)')
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = (req as any).auth;
    const { title, type, status } = req.body;

    const { data, error } = await supabase
      .from('cases')
      .update({ title, type, status })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*, clients(name)')
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = (req as any).auth;

    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
