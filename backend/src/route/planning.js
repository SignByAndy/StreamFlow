const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/plannings
 * Récupérer tous les plannings de l'utilisateur connecté
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, user_id, title, week_start_date, created_at FROM plannings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.json({ plannings: result.rows });
  } catch (error) {
    console.error('Erreur get plannings:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/plannings/:planningId/streams
 * Recuperer les streams d'un planning
 */
router.get('/:planningId/streams', authenticateToken, async (req, res) => {
  try {
    const planningId = Number(req.params.planningId);

    if (!Number.isInteger(planningId)) {
      return res.status(400).json({ error: 'Planning invalide' });
    }

    const planning = await pool.query(
      'SELECT id FROM plannings WHERE id = $1 AND user_id = $2',
      [planningId, req.user.userId]
    );

    if (planning.rows.length === 0) {
      return res.status(404).json({ error: 'Planning non trouve' });
    }

    const result = await pool.query(
      'SELECT id, planning_id, day_index, title, game, start_time, end_time, created_at FROM streams WHERE planning_id = $1 ORDER BY day_index, start_time',
      [planningId]
    );

    res.json({ streams: result.rows });
  } catch (error) {
    console.error('Erreur get streams:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/plannings/:planningId/streams
 * Creer un stream
 */
router.post('/:planningId/streams', authenticateToken, async (req, res) => {
  try {
    const planningId = Number(req.params.planningId);
    const { title, game, day_index, start_time, end_time } = req.body;

    if (!Number.isInteger(planningId)) {
      return res.status(400).json({ error: 'Planning invalide' });
    }

    if (!title || !start_time || !end_time || day_index === undefined) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    if (day_index < 0 || day_index > 6) {
      return res.status(400).json({ error: 'Jour invalide' });
    }

    const planning = await pool.query(
      'SELECT id FROM plannings WHERE id = $1 AND user_id = $2',
      [planningId, req.user.userId]
    );

    if (planning.rows.length === 0) {
      return res.status(404).json({ error: 'Planning non trouve' });
    }

    const result = await pool.query(
      'INSERT INTO streams (planning_id, day_index, title, game, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, planning_id, day_index, title, game, start_time, end_time, created_at',
      [planningId, day_index, title, game || null, start_time, end_time]
    );

    res.status(201).json({ stream: result.rows[0] });
  } catch (error) {
    console.error('Erreur create stream:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/plannings/streams/:id
 * Supprimer un stream
 */
router.delete('/streams/:id', authenticateToken, async (req, res) => {
  try {
    const streamId = Number(req.params.id);

    if (!Number.isInteger(streamId)) {
      return res.status(400).json({ error: 'Stream invalide' });
    }

    const result = await pool.query(
      `DELETE FROM streams
       USING plannings
       WHERE streams.id = $1
         AND streams.planning_id = plannings.id
         AND plannings.user_id = $2
       RETURNING streams.id`,
      [streamId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stream non trouve' });
    }

    res.json({ message: 'Stream supprime' });
  } catch (error) {
    console.error('Erreur delete stream:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/plannings
 * Créer un nouveau planning
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, week_start_date } = req.body;

    if (!title || !week_start_date) {
      return res.status(400).json({ error: 'Titre et date de semaine requis' });
    }

    const result = await pool.query(
      'INSERT INTO plannings (user_id, title, week_start_date) VALUES ($1, $2, $3) RETURNING id, user_id, title, week_start_date, created_at',
      [req.user.userId, title, week_start_date]
    );

    res.status(201).json({ planning: result.rows[0] });
  } catch (error) {
    console.error('Erreur create planning:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/plannings/:id
 * Supprimer un planning
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const planningId = req.params.id;

    const result = await pool.query(
      'DELETE FROM plannings WHERE id = $1 AND user_id = $2 RETURNING id',
      [planningId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Planning non trouve' });
    }

    res.json({ message: 'Planning supprime' });
  } catch (error) {
    console.error('Erreur delete planning:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
