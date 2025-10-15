const { insertTestUsers } = require('../playwright/support/database');

insertTestUsers()
  .then(() => console.log('Concluído!'))
  .catch(err => console.error('Erro:', err))
  .finally(() => process.exit());