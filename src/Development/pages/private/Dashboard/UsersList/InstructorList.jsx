import React, { useContext } from 'react';
import Context from '../../../../Context/Context';
import { Table } from 'flowbite-react';
import { Avatar } from 'flowbite-react';
import { Button } from 'flowbite-react';
import InstitutionContext from '../../../../Context/InstitutionContext';
import { Edit } from 'lucide-react';

function InstructorList() {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const { instructorList } = useContext(Context);
  console.log(instructorList);

  return (
    <div className="w-full p-4">
      {/* <div className="overflow-x-auto w-full p-4">
        <Table hoverable className="min-w-full">
          <Table.Head>
            <Table.HeadCell className=" text-center">Name</Table.HeadCell>
            <Table.HeadCell className=" text-center">Email</Table.HeadCell>
            <Table.HeadCell className=" text-center">Position</Table.HeadCell>
            <Table.HeadCell className=" text">Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {instructorList.map((instructor) => (
              <Table.Row key={instructor.instructorId} className="border-b">
                <Table.Cell className="flex items-center text-center">
                  <Avatar
                    img={instructor.image}
                    alt={instructor.name}
                    rounded
                    size="md"
                    className="w-12 h-12"
                  />
                  <div className=" font text-gray-700 text-xs-medium">{instructor.name}</div>
                </Table.Cell>
                <Table.Cell className='text-gray-700 text-xs font-semibold text-center'>{instructor.emailId}</Table.Cell>
                <Table.Cell className='text-gray-700 text-xs font-semibold text-center'>{instructor.position}</Table.Cell>

                <Table.Cell className='text-center'>
                  <Button className='text-center' size="sm" color style={{
                    backgroundColor:
                      InstitutionData.LightPrimaryColor,
                  }}



                  >
                    Edit
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div> */}
      <div className="w-full">
        <Table hoverable striped>
          <Table.Head>
            <Table.HeadCell className="font-semibold">
              Name
            </Table.HeadCell>
            <Table.HeadCell className="font-semibold">
              Email
            </Table.HeadCell>
            <Table.HeadCell className="font-semibold">
              Position
            </Table.HeadCell>
            <Table.HeadCell className="font-semibold ">
              Action
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {instructorList.map((instructor) => (
              <Table.Row key={instructor.instructorId} className="border-b">
                <Table.Cell className="flex items-center text-center gap-2">
                  <Avatar
                    img={instructor.image}
                    alt={instructor.name}
                    rounded
                    size="md"
                    className="w-12 h-12"
                  />
                  <div className=" font text-gray-700 font-medium">{instructor.name}</div>
                </Table.Cell>
                <Table.Cell className='text-gray-700 font-semibold'>{instructor.emailId}</Table.Cell>
                <Table.Cell className='text-gray-700 font-semibold'>{instructor.position}</Table.Cell>

                <Table.Cell className='text'>
                  <button className='flex justify-center items-center px-4 py-2 rounded font-semibold' color style={{
                    backgroundColor:
                      InstitutionData.LightPrimaryColor,
                  }}
                  >
                    <Edit height={16} />
                    Edit
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

export default InstructorList;
