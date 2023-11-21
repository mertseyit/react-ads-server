import { IgrRadialGaugeModule, IgrRadialGauge } from 'igniteui-react-gauges';

IgrRadialGaugeModule.register();

const GaugageView = (prop) => {
  return (
    <div className='flex w-full items-center justify-center'>
      <div style={{
        backgroundColor:`red`
      }}>{prop.stringValue}</div>
      <IgrRadialGauge
        height="500px" width="500px"
        minimumValue={0} 
        value={prop.value}
        maximumValue={100}
        rangeBrushes="red, yellow, green"
        rangeOutlines="red, yellow, green">
      </IgrRadialGauge>
    </div>

  )
}

export default GaugageView