import React, { useContext } from 'react';
import Context from '../../../../Context/Context';

function InstructorList() {
  const { instructorList } = useContext(Context);
  console.log(instructorList);

  return (
    <div className="w-full p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full ">
          <thead>
            <tr>
              <th className="px-4 py-2 pl-8">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Position</th>
            </tr>
          </thead>
          <tbody>
            {instructorList.map((instructor) => (
              <tr key={instructor.instructorId}>
                <td className="flex items-center px-4 py-2">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="px-4 py-2">{instructor.name}</div>
                </td>
                <td className="px-4 py-2">{instructor.emailId}</td>
                <td className="px-4 py-2">{instructor.position}</td>
                {/* <div className="flex justify-center gap-1 text-center px-1 py-2 font-[500] rounded cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                  </svg>
                  <div>Edit</div>
                </div> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InstructorList;
