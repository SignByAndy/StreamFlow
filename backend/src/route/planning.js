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
