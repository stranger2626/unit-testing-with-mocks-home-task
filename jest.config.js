module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/data_handlers/user_data_handler.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'text', 'html']
}
