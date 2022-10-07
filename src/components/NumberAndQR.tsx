import QR from "./QR"

const NumberAndQR = ({id}: {id: string}) => {
  return (
    <>
      <p className="text-4xl font-bold">
        <span className="underline">{id.slice(0,4)}</span>
        <span> </span>
        <span className="underline">{id.slice(4)}</span>
      </p>
      <QR id={id} />
    </>
  )
}

export default NumberAndQR