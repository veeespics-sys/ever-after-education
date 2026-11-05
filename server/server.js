import { app } from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[ThutoBridge Server] Stage 1 API running on http://localhost:${PORT}`);
  console.log(`[ThutoBridge Server] Ready for parent/learner sessions and CAPS subject management.`);
});
