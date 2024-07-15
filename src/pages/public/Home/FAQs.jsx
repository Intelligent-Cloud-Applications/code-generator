import { useSelector } from "react-redux";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";

const FAQs = () => {
  const { FAQ } = useSelector((state) => state.institutionData.data);
  return (
    <div className="container h-screen mx-auto py-24 px- flex justify-center items-center flex-col gap-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-[2.5rem]">
        FAQs
      </h2>
      <Accordion
        collapseAll
        className="w-[75vw] flex flex-col gap-4 border-none"
      >
        {FAQ?.map((faq, index) => (
          <AccordionPanel key={index}>
            <AccordionTitle className="text-[1rem] font-semibold text-stone-600">
              {faq.title}
            </AccordionTitle>
            <AccordionContent>
              <p className="text-stone-500">{faq.content}</p>
            </AccordionContent>
            <span className="h-[0.8px] w-full bg-stone-300"></span>
          </AccordionPanel>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQs;
