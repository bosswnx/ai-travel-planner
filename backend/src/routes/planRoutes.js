import { Router } from 'express';
import { analyzeBudget, generateItinerary } from '../services/llmService.js';
import { listExpenses, listPlans, saveExpense, savePlan } from '../services/planRepository.js';

const router = Router();

router.post('/plan', async (req, res) => {
  try {
    const userId = req.body.userId || 'guest';
    const itinerary = await generateItinerary(req.body);
    const saved = await savePlan(userId, {
      request: req.body,
      itinerary,
    });
    res.json({ itinerary, saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/plan', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';
    const plans = await listPlans(userId);
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/budget', async (req, res) => {
  try {
    const summary = await analyzeBudget(req.body);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/expenses', async (req, res) => {
  try {
    const userId = req.body.userId || 'guest';
    const saved = await saveExpense(userId, req.body);
    res.json({ saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/expenses', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';
    const expenses = await listExpenses(userId);
    res.json({ expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
