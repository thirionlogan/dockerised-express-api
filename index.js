require('dotenv').config();
const app = require('./app');
const db = require('./data/db');

const port = process.env.PORT || 3001;

db.migrate.latest().then(() => {
  return db.seed.run();
});

app.listen(port, () => console.log(`app listening at port ${port}`));
