// Run by docker-entrypoint.sh before migrations. Waits until MySQL accepts connections.
// Needed because after a restart or a server reboot Docker starts all containers at once,
// and the API would otherwise try to migrate a database that is still booting.
const { sequelize } = require('../models');

const ATTEMPTS = 45;
const WAIT_SECONDS = 2;

(async () => {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      await sequelize.authenticate();
      await sequelize.close();
      console.log('[db] ready');
      process.exit(0);
    } catch (error) {
      console.log(`[db] not ready yet (${attempt}/${ATTEMPTS}): ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, WAIT_SECONDS * 1000));
    }
  }
  console.error(`[db] still unreachable after ${ATTEMPTS * WAIT_SECONDS} seconds, giving up`);
  process.exit(1);
})();
