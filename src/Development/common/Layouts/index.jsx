import Header from "../../components/Header";

export const FormWrapper = ({ children, heading }) => {
  return (
    <div>
      <Header/>
      <div className='flex flex-col items-center justify-center h-[calc(100vh-8rem)]'>
        <div className={
          `flex flex-col items-center gap-4
          shadow-xl sm:px-20 px-8 py-12 sm-w-[480px] rounded-xl`
        }>
          {heading && <h2 className='font-bold text-2xl mb-4'>{heading}</h2>}
          {children}
        </div>
      </div>
    </div>
  );
}