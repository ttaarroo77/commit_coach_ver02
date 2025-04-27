import 'dotenv/config';
import { createServer } from './app';

const port = process.env.PORT || 3001;

async function startServer() {
  try {
    const app = await createServer();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
