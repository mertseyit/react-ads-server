import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import GaugageView from './components/GaugageView';
import increment from '../public/increment.svg'
import decrement from '../public/decrement.svg'
const App = () => {
  //Public API that will echo messages sent to it back to the client
  const [pressureValue, setPressureValue] = useState(0)
  const [stringValue, setStringValue] = useState('')
  const [isIncrement, setIsIncrement] = useState(true)
  const [start, setStart] = useState(true)
  const { sendMessage, readyState } = useWebSocket("ws://localhost:8080", {
    onMessage: (data) => {
      //console.log(typeof data.data)
      if (JSON.parse(data.data).msg === "pressureValue") {
        //dönen data'nın değeri string veride. O yüzden oncelikle typecasting yaptım
        setPressureValue(Number(JSON.parse(data.data).data))
      } else if (JSON.parse(data.data).msg === 'sStringValue') {
        setStringValue((JSON.parse(data.data).data))
      } else if (JSON.parse(data.data).msg === 'bIsIncrement') {
        setIsIncrement((JSON.parse(data.data).data))
      } else if (JSON.parse(data.data).msg === 'startTimer') {
        setStart(!(JSON.parse(data.data).data))
      } else if (JSON.parse(data.data).msg === 'close_the_ws_connection') {
        console.log("close the web socket connetion")
      } else if (JSON.parse(data.data).msg === 'testValue') {
        console.log((JSON.parse(data.data).data))
      }
    },
  });

  const handleClickSendMessage = () => {
    const config = {
      msg: "start",
      data: start
    }
    sendMessage(JSON.stringify(config))
    setStart(pre => !pre)
  }

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='h-full bg-slate-200 rounded-md shadow-lg'>


        {
          readyState ? (
            <>
              <button
                onClick={handleClickSendMessage}
                disabled={readyState !== ReadyState.OPEN}
                className={`${readyState === ReadyState.OPEN ? "w-full bg-slate-500 text-white p-4 text-3xl" : "bg-red-500 w-full text-white text-3xl p-4 opacity-30"} `}
              >
                {readyState === ReadyState.OPEN ? (!start ? "Stop" : "Start") : "Sunucu Hatası !"}
              </button>
              {
                readyState === ReadyState.OPEN && (
                  <>
                    <div className='text-center'>
                      {pressureValue}
                    </div>
                    <GaugageView value={pressureValue} label={stringValue} />
                    <div className='text-center flex flex-col items-center justify-center'>
                      <div className='text-center fw-bold text-2xl'>{stringValue}</div>
                      {isIncrement ? <img src={increment} width={100} /> : <img src={decrement} width={100} />}
                    </div>
                  </>
                )
              }
            </>
          ) : (
            <div className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center'>Loading...</div>
          )
        }

      </div>
    </div>
  );
};


export default App