
const Promise = require('bluebird')
const Datastore = require('nedb')

import { each, indexBy } from 'underline'

const Logger = require('./log').Logger
const opts = {
  logger: new Logger()
}
const log = require('./log')('legacy-db')
const market = require('./market')

/*
 * nedb was previously used for as both a persistent layer and
 * our single source of truth at runtime. that turned out to be
 * overkill & slower than expected. See `util/market` for its replacement.
 */

async function import_old_data (filename) {
  const store = new Datastore({filename, autoload: true})
  const find = Promise.promisify(store.find, {context: store})

  const caves = await find({_table: 'caves'})
  const games = await find({_table: 'games'})
  const collections = await find({_table: 'collections'})
  const users = await find({_table: 'users'})
  const download_keys = await find({_table: 'download_keys'})

  caves::each((x) => x.id = x._id)

  const strip_underscore_id = (coll) => {
    coll::each((x) => delete x._id)
  }

  strip_underscore_id(games)
  strip_underscore_id(collections)
  strip_underscore_id(users)
  strip_underscore_id(download_keys)

  market.save_all_entities({
    entities: {
      collections: collections::indexBy('id'),
      download_keys: download_keys::indexBy('id'),
      users: users::indexBy('id'),
      caves: caves::indexBy('id'),
      games: games::indexBy('id')
    }
  })

  log(opts, `Imported ${caves.length} caves, ${games.length} games, ${collections.length} collections, ${users.length} and ${download_keys.length} download keys from legacy db`)
}

module.exports = {import_old_data}
