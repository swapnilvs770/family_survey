const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Helper function to calculate age from DOB
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// GET all members
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM family_members ORDER BY family_id, id'
    );
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching members',
      error: error.message
    });
  }
});

// GET filtered members
router.get('/filter', async (req, res) => {
  try {
    const { ageMin, ageMax, gender, relation, search } = req.query;

    let query = 'SELECT * FROM family_members WHERE 1=1';
    const params = [];

    // Age range filter
    if (ageMin !== undefined) {
      query += ' AND age >= ?';
      params.push(parseInt(ageMin));
    }
    if (ageMax !== undefined) {
      query += ' AND age <= ?';
      params.push(parseInt(ageMax));
    }

    // Gender filter
    if (gender && gender !== 'all') {
      query += ' AND gender = ?';
      params.push(gender);
    }

    // Relation filter
    if (relation && relation !== 'all') {
      query += ' AND relation = ?';
      params.push(relation);
    }

    // Search by name or family_id
    if (search) {
      query += ' AND (name LIKE ? OR family_id = ?)';
      params.push(`%${search}%`, parseInt(search) || 0);
    }

    query += ' ORDER BY family_id, id';

    const [rows] = await db.query(query, params);

    res.json({
      success: true,
      count: rows.length,
      filters: { ageMin, ageMax, gender, relation, search },
      data: rows
    });
  } catch (error) {
    console.error('Error filtering members:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering members',
      error: error.message
    });
  }
});

// GET families grouped by family_id
router.get('/families', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM family_members ORDER BY family_id, id'
    );

    // Group by family_id
    const families = {};
    rows.forEach(member => {
      if (!families[member.family_id]) {
        families[member.family_id] = {
          family_id: member.family_id,
          members: [],
          total_members: 0
        };
      }
      families[member.family_id].members.push(member);
      families[member.family_id].total_members++;
    });

    const familyArray = Object.values(families);

    res.json({
      success: true,
      count: familyArray.length,
      data: familyArray
    });
  } catch (error) {
    console.error('Error fetching families:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching families',
      error: error.message
    });
  }
});

// GET single member by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM family_members WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching member',
      error: error.message
    });
  }
});

// POST create new member
router.post('/', async (req, res) => {
  try {
    const { family_id, name, gender, relation, dob } = req.body;

    // Validate required fields
    if (!family_id || !name || !gender || !relation || !dob) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Calculate age from DOB
    const age = calculateAge(dob);

    const [result] = await db.query(
      'INSERT INTO family_members (family_id, name, age, gender, relation, dob) VALUES (?, ?, ?, ?, ?, ?)',
      [family_id, name, age, gender, relation, dob]
    );

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: {
        id: result.insertId,
        family_id,
        name,
        age,
        gender,
        relation,
        dob
      }
    });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating member',
      error: error.message
    });
  }
});

// PUT update member
router.put('/:id', async (req, res) => {
  try {
    const { family_id, name, gender, relation, dob } = req.body;
    const memberId = req.params.id;

    // Calculate age from DOB
    const age = calculateAge(dob);

    const [result] = await db.query(
      'UPDATE family_members SET family_id = ?, name = ?, age = ?, gender = ?, relation = ?, dob = ? WHERE id = ?',
      [family_id, name, age, gender, relation, dob, memberId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member updated successfully',
      data: {
        id: memberId,
        family_id,
        name,
        age,
        gender,
        relation,
        dob
      }
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating member',
      error: error.message
    });
  }
});

// DELETE member
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM family_members WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting member',
      error: error.message
    });
  }
});

// GET statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [totalMembers] = await db.query('SELECT COUNT(*) as total FROM family_members');
    const [totalFamilies] = await db.query('SELECT COUNT(DISTINCT family_id) as total FROM family_members');
    const [maleCount] = await db.query('SELECT COUNT(*) as total FROM family_members WHERE gender = "Male"');
    const [femaleCount] = await db.query('SELECT COUNT(*) as total FROM family_members WHERE gender = "Female"');
    const [childrenCount] = await db.query('SELECT COUNT(*) as total FROM family_members WHERE age <= 18');
    const [infantsCount] = await db.query('SELECT COUNT(*) as total FROM family_members WHERE age <= 1');

    res.json({
      success: true,
      data: {
        totalMembers: totalMembers[0].total,
        totalFamilies: totalFamilies[0].total,
        maleCount: maleCount[0].total,
        femaleCount: femaleCount[0].total,
        childrenCount: childrenCount[0].total,
        infantsCount: infantsCount[0].total
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;
