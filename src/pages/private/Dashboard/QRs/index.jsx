import QR from "../../../../common/QR";

const QRs = () => {
  const links = [
    { url: window.location.href.split('/')[0] + '/put-attendance', label: 'Attendance' },
  ]
  return (
    <div className='p-8'>
      <h1 className='text-4xl text-center font-bold'>QR Codes</h1>
      <div className='p-8 flex gap-8'>
        {links.map((link, index) => (
          <figure className='w-fit flex flex-col items-center'>
            <QR key={index} url={link.url} size={320} />
            <figcaption className='text-2xl font-semibold'>{link.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

export default QRs;