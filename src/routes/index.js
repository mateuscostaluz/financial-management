module.exports = router => {
  require('./records')(router)
  require('./users')(router)
}
