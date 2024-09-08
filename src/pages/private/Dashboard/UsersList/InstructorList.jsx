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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InstructorList;
