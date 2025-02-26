import Header from "../../components/Header";

export const FormWrapper = ({ children, heading }) => {
  return (
    <div>
      <Header/>
      <div className='flex flex-col items-center mt-10'>
        <div className={
          `flex flex-col items-center gap-4
          sm:shadow-xl sm:px-20 py-12 sm-w-[480px] rounded-xl`
        }>
          {heading && <h2 className='font-bold text-2xl mb-4'>{heading}</h2>}
          {children}
        </div>
      </div>
    </div>
  );
}