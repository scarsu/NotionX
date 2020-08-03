module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', // new feature
      'fix', // bug fix
      'perf', // performance improvement
      'docs', // documentation
      'style', // format (changes that do not affect code running)
      'refactor', // neither a new feature nor a code change to fix bug
      'test', // changes related to project testing
      'chore' // changes related to the build process or assistive tools
    ]]
  }
}
