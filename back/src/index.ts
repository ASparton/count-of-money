import articlesHarvestJob from '@jobs/articlesHarvest.job';
import app from '~app';

const PORT = 3000;

app.listen(PORT, () =>
	console.log(`🚀 Server ready at: http://localhost:${PORT}`),
);

// Will harvest articles from registered every 1 minute
articlesHarvestJob.start();
