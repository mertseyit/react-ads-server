const ads = require('ads-client')
const WebSocket = require('ws')

//web socket declaration
wss = new WebSocket.Server({
  port:8080
})

//ads connection configuration
const client = new ads.Client({
  targetAmsNetId: '127.0.0.1.1.1', //or 'localhost'
  targetAdsPort: 851,
})


//firstly we must connect to web socket
wss.on('connection', async (ws) => {
  console.log("Web Socket Connected")

  try {
    //ads connection
    const res = await client.connect()  
    console.log(`
    Twincat Connection Is Success
    Target AMS Net ID: ${res.targetAmsNetId}
    Local AMS Net ID: ${res.localAmsNetId}
    Local ADS Port: ${res.localAdsPort}
    `)

    //herhangi bir değerin readSymbol ile okunması işlemi
    const testValue = await client.readSymbol('GVL_MY_VARIABLES.testValue')
    ws.send(JSON.stringify({
      data:testValue.value,
      msg:"testValue"
    }))

    //twincat tarafındaki bir değerin dinlenmesi, değeri her 100ms de bir olacak şekilde dinliyoruz. Eğer bir değişiklik var ise web socket yardımı ile bu değeri client'a gönderiyoruz.
    await client.subscribe('GVL_MY_VARIABLES.pressureValue', (data, sub) => {
      ws.send(JSON.stringify({
        data:data.value,
        msg:"pressureValue"
      }))
    },10)

    await client.subscribe('GVL_MY_VARIABLES.sStringValue', (data, sub) => {
      ws.send(JSON.stringify({
        data:data.value,
        msg:"sStringValue"
      }))
    },100)

    await client.subscribe('GVL_MY_VARIABLES.bIsIncrement', (data, sub) => {
      ws.send(JSON.stringify({
        data:data.value,
        msg:"bIsIncrement"
      }))
    },100)

    await client.subscribe('GVL_MY_VARIABLES.startTimer', (data, sub) => {
      ws.send(JSON.stringify({
        data:data.value,
        msg:"startTimer"
      }))
    },100)

  } catch (error) {
    console.log(`Shomting Went Wrong::.`, JSON.parse(error))
    
  }

  ws.on('message', async (data) => {
    if(JSON.parse(data).msg === 'start') {
      await client.writeSymbol('GVL_MY_VARIABLES.startTimer', JSON.parse(data).data)
    }
  })
  
  ws.on('close', async () => {
    console.log("Client Connection Closed")
    await client.disconnect()
  })
})