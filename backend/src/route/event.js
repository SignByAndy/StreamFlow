const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/events/planning/:planningId
 * Récupérer tous les événements d'un planning
 */
router.get('/planning/:planningId', authenticateToken, async (req, res) => {
  try {
    const planningId = req.params.planningId;

    // Vérifier que le planning appartient à l'utilisateur
    const planningCheck = await pool.query(
      'SELECT id FROM plannings WHERE id = $1 AND user_id = $2',
      [planningId, req.user.userId]
    );

    if (planningCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Planning non trouvé' });
    }

    const result = await pool.query(
      'SELECT * FROM events WHERE planning_id = $1 ORDER BY start_time',
      [planningId]
    );

    res.json({ events: result.rows });
  } catch (error) {
    console.error('Erreur get events:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/events/:id
 * Récupérer un événement spécifique
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;

    const result = await pool.query(
      `SELECT e.* FROM events e
       JOIN plannings p ON e.planning_id = p.id
       WHERE e.id = $1 AND p.user_id = $2`,
      [eventId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    res.json({ event: result.rows[0] });
  } catch (error) {
    console.error('Erreur get event:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/events
 * Créer un nouvel événement
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { planning_id, title, description, start_time, end_time, color } = req.body;

    // Validation
    if (!planning_id || !title || !start_time || !end_time) {
      return res.status(400).json({ error: 'Champs requis: planning_id, title, start_time, end_time' });
    }

    // Vérifier que le planning appartient à l'utilisateur
    const planningCheck = await pool.query(
      'SELECT id FROM plannings WHERE id = $1 AND user_id = $2',
      [planning_id, req.user.userId]
    );

    if (planningCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Planning non trouvé' });
    }

    // Vérifier que start_time < end_time
    if (new Date(start_time) >= new Date(end_time)) {
      return res.status(400).json({ error: 'L\'heure de début doit être avant l\'heure de fin' });
    }

    const result = await pool.query(
      'INSERT INTO events (planning_id, title, description, start_time, end_time, color) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [planning_id, title, description || null, start_time, end_time, color || null]
    );

    res.status(201).json({
      message: 'Événement créé',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur create event:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /api/events/:id
 * Mettre à jour un événement
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, start_time, end_time, color } = req.body;

    // Vérifier que l'événement appartient à l'utilisateur
    const checkResult = await pool.query(
      `SELECT e.id FROM events e
       JOIN plannings p ON e.planning_id = p.id
       WHERE e.id = $1 AND p.user_id = $2`,
      [eventId, req.user.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    // Validation si start_time et end_time sont modifiés
    if (start_time && end_time && new Date(start_time) >= new Date(end_time)) {
      return res.status(400).json({ error: 'L\'heure de début doit être avant l\'heure de fin' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }

    if (start_time) {
      updates.push(`start_time = $${paramCount++}`);
      values.push(start_time);
    }

    if (end_time) {
      updates.push(`end_time = $${paramCount++}`);
      values.push(end_time);
    }

    if (color !== undefined) {
      updates.push(`color = $${paramCount++}`);
      values.push(color);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    values.push(eventId);
    const query = `UPDATE events SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);

    res.json({
      message: 'Événement mis à jour',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur update event:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/events/:id
 * Supprimer un événement
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;

    const result = await pool.query(
      `DELETE FROM events e
       USING plannings p
       WHERE e.planning_id = p.id
       AND e.id = $1
       AND p.user_id = $2
       RETURNING e.id`,
      [eventId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    res.json({ message: 'Événement supprimé' });
  } catch (error) {
    console.error('Erreur delete event:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
