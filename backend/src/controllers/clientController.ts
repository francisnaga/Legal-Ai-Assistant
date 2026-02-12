
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getClients = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).auth;
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).auth;
    const { name, contact_info } = req.body;

    const { data, error } = await supabase
      .from('clients')
      .insert({ name, contact_info, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = (req as any).auth;
    const { name, contact_info } = req.body;

    const { data, error } = await supabase
      .from('clients')
      .update({ name, contact_info })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = (req as any).auth;

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
