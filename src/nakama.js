import { Client } from '@heroiclabs/nakama-js'
import { v4 as uuidv4 } from 'uuid'

class Nakama {
  constructor() {
    this.client
    this.session
    this.socket // ep4
    this.matchID // ep4
  }

  async authenticate() {
    const useSSL = false
    this.client = new Client('defaultkey', 'localhost', '7350', useSSL)

    console.log(this.client, '++++++++++++++++++++++++++ client')

    let deviceId = localStorage.getItem('deviceId')
    if (!deviceId) {
      deviceId = uuidv4()
      localStorage.setItem('deviceId', deviceId)
    }

    this.session = await this.client.authenticateDevice(deviceId, true)

    console.log(this.session, '+++++++++++++++++++++++++ session device')

    localStorage.setItem('user_id', this.session.user_id)

    const trace = false
    this.socket = this.client.createSocket(this.useSSL, trace)

    console.log(this.socket, '+++++++++++++++++++++++++ socket create socket')

    await this.socket.connect(this.session)
  }

  async findMatch(ai = false) {
    // ep4
    const rpcid = 'find_match'
    const matches = await this.client.rpc(this.session, rpcid, { ai: ai })
    console.log(matches, '**** findMatch ****')
    this.matchID = matches.payload.matchIds[0]
    await this.socket.joinMatch(this.matchID)
    console.log('Matched joined!')
  }

  async makeMove(index) {
    // ep4
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
