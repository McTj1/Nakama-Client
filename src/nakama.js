import { Client } from '@heroiclabs/nakama-js'
import { v4 as uuidv4 } from 'uuid'

class Nakama {
  constructor() {
    this.client
    this.session
    this.socket
    this.matchID
  }

  async login() {}

  //  UnhandledPromiseRejectionWarning: ReferenceError: XMLHttpRequest is not defined not support when run nodejs. **
  async authenticate() {
    try {
      this.client = new Client('defaultkey', 'localhost', '7350')
      this.client.ssl = false

      let deviceId = uuidv4()
      // if (!deviceId) {
      //   deviceId = uuidv4()
      //   localStorage.setItem('deviceId', deviceId)
      // }

      this.session = await this.client.authenticateCustom(deviceId, true)
      // localStorage.setItem('user_id', this.session.user_id)

      // ep4
      const trace = false
      this.socket = this.client.createSocket(this.useSSL, trace)
      await this.socket.connect(this.session)
    } catch (error) {
      console.error('Error authenticating:', error)
    }
  }

  async findMatch(ai = false) {
    const rpcid = 'find_match'
    const matches = await this.client.rpc(this.session, rpcid, { ai: ai })
    console.log(matches, '**** findMatch ****')
    this.matchID = matches.payload.matchIds[0]
    try {
      await this.socket.joinMatch(this.matchID)
      console.log('Matched joined!')
    } catch (error) {
      console.error('Error joining match:', error)
    }
  }

  async makeMove(index) {
    var data = { position: index, namePlayer: 'TJ' }
    await this.socket.sendMatchState(this.matchID, 4, JSON.stringify(data))
    console.log('Match data sent')
  }

  async inviteAI() {
    await this.socket.sendMatchState(this.matchID, 7, '')
    console.log('AI player invited')
  }
}

export default new Nakama()
