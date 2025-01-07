
import React, { useContext } from 'react'
import Faq from 'react-faq-component'
import './FAQ.css'
import InstitutionContext from '../../../Context/InstitutionContext'

export default function FAQ() {
  const institutionData = useContext(InstitutionContext).institutionData

  const data = {
    rows: institutionData.FAQ.map(row => {
      // Check if the row text contains 'awsaiapp.com'
      if (row.content.includes('awsaiapp.com')) {
        // If so, replace the text with a hyperlink
        const contentWithLink = row.content.replace(
          /awsaiapp.com/g,
          `<a href="https://awsaiapp.com/" style="text-decoration: none; color: blue;" target="_blank" rel="noopener noreferrer">awsaiapp.com</a>`
        );
        return { ...row, content: contentWithLink };
      }
      return row;
    })
  };

  const styles = {
    bgColor: '#ffffff',
    rowTitleColor: '#000',
    rowContentColor: '#555555',
    arrowColor: '#000'
  };

  const config = {
    animate: true,
    //arrowIcon: "V",
    tabFocus: true
  };

  return (
    <div className={`home-faq flex flex-col items-center justify-center gap-20 max800:py-[10rem]`}>
      <div className={` flex flex-col max800:px-[5rem] `}>
        <h2 className={'text-5xl font-bold'}>FAQs</h2>
      </div>
      <Faq data={data} styles={styles} config={config} />
    </div>
  )
}




// //import { useSelector } from "react-redux";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionPanel,
//   AccordionTitle,
// } from "flowbite-react";
// import {useContext} from "react";
// import institutionContext from "../../../Context/InstitutionContext";

// const FAQs = () => {
//   const { FAQ } = useContext(institutionContext).institutionData;
// //  const { FAQ } = useSelector((state) => state.institutionData.data);
//   return (
//     <div>
//       <h2 className="text-3xl font-bold text-center mb-12 text-[2.5rem]">
//         FAQs
//       </h2>
//       <Accordion
//         collapseAll
//         className="w-[75vw] flex flex-col"
//       >
//         {FAQ?.map((faq, index) => (
//           <AccordionPanel key={index}>
//             <AccordionTitle>
//               {faq.title}
//             </AccordionTitle>
//             <AccordionContent>
//               <p className="text-stone-500">{faq.content}</p>
//             </AccordionContent>
//           </AccordionPanel>
//         ))}
//       </Accordion>
//     </div>
//   );
// };

// export default FAQs;
