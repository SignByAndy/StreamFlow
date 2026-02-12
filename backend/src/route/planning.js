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
      'SELECT * FROM plannings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.json({ plannings: result.rows });
  } catch (error) {
    console.error('Erreur get plannings:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/plannings/:id
 * Récupérer un planning spécifique avec ses événements
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const planningId = req.params.id;

    // Récupérer le planning
    const planningResult = await pool.query(
      'SELECT * FROM plannings WHERE id = $1 AND user_id = $2',
      [planningId, req.user.userId]
    );

    if (planningResult.rows.length === 0) {
      return res.status(404).json({ error: 'Planning non trouvé' });
    }

    // Récupérer les événements du planning
    const eventsResult = await pool.query(
      'SELECT * FROM events WHERE planning_id = $1 ORDER BY start_time',
      [planningId]
    );

    res.json({
      planning: planningResult.rows[0],
      events: eventsResult.rows
    });
  } catch (error) {
    console.error('Erreur get planning:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/plannings
 * Créer un nouveau planning
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }

    const result = await pool.query(
      'INSERT INTO plannings (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, title, description || null]
    );

    res.status(201).json({
      message: 'Planning créé',
      planning: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur create planning:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * PUT /api/plannings/:id
 * Mettre à jour un planning
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const planningId = req.params.id;
    const { title, description } = req.body;

    // Vérifier que le planning appartient à l'utilisateur
    const checkResult = await pool.query(
      'SELECT id FROM plannings WHERE id = $1 AND user_id = $2',
      [planningId, req.user.userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Planning non trouvé' });
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

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    values.push(planningId);
    const query = `UPDATE plannings SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);

    res.json({
      message: 'Planning mis à jour',
      planning: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur update planning:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * DELETE /api/plannings/:id
 * Supprimer un planning et tous ses événements
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const planningId = req.params.id;

    const result = await pool.query(
      'DELETE FROM plannings WHERE id = $1 AND user_id = $2 RETURNING id',
      [planningId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Planning non trouvé' });
    }

    res.json({ message: 'Planning supprimé' });
  } catch (error) {
    console.error('Erreur delete planning:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/plannings/:id/duplicate
 * Dupliquer un planning avec tous ses événements
 */
router.post('/:id/duplicate', authenticateToken, async (req, res) => {
  try {
    const planningId = req.params.id;

    // Récupérer le planning original
    const planningResult = await pool.query(
      'SELECT * FROM plannings WHERE id = $1 AND user_id = $2',
      [planningId, req.user.userId]
    );

    if (planningResult.rows.length === 0) {
      return res.status(404).json({ error: 'Planning non trouvé' });
    }

    const originalPlanning = planningResult.rows[0];

    // Créer une copie du planning
    const newPlanningResult = await pool.query(
      'INSERT INTO plannings (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, `${originalPlanning.title} (Copie)`, originalPlanning.description]
    );

    const newPlanning = newPlanningResult.rows[0];

    // Copier tous les événements
    await pool.query(
      `INSERT INTO events (planning_id, title, description, start_time, end_time, color)
       SELECT $1, title, description, start_time, end_time, color
       FROM events WHERE planning_id = $2`,
      [newPlanning.id, planningId]
    );

    res.status(201).json({
      message: 'Planning dupliqué',
      planning: newPlanning
    });
  } catch (error) {
    console.error('Erreur duplicate planning:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
