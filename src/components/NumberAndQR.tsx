import QR from "./QR"

const NumberAndQR = ({numberId, longerId}: {numberId: string, longerId: string}) => {
  return (
    <>
      <p className="text-6xl font-bold">
        <span className="underline">{numberId.slice(0,4)}</span>
        <span> </span>
        <span className="underline">{numberId.slice(4)}</span>
      </p>
      <QR id={longerId} />
    </>
  )
}

export default NumberAndQR