import React, { useContext, useState } from 'react';
import Context from '../../../../Context/Context';
import { Table, Modal, Pagination } from 'flowbite-react';
import { Avatar } from 'flowbite-react';
import InstitutionContext from '../../../../Context/InstitutionContext';
import { Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import { API } from 'aws-amplify';

function InstructorList() {
  const InstitutionData = useContext(InstitutionContext).institutionData;
  const { instructorList, getInstructorList } = useContext(Context);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    emailId: '',
    position: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust this number as needed

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInstructors = instructorList.slice(startIndex, endIndex);

  const handleEditClick = (instructor) => {
    setSelectedInstructor(instructor);
    setEditForm({
      name: instructor.name,
      emailId: instructor.emailId,
      position: instructor.position
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put("main", "/admin/update-instructor", {
        body: {
          instructorId: selectedInstructor.instructorId,
          ...editForm
        }
      });

      if (response) {
        toast.success("Instructor updated successfully!");
        setShowEditModal(false);
        await getInstructorList(); // Refresh the list
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update instructor");
    }
  };

  return (
    <div className="w-full p-4">
      <div className="w-full">
        <Table hoverable striped>
          <Table.Head>
            <Table.HeadCell className="font-semibold pl-20">
              Name
            </Table.HeadCell>
            <Table.HeadCell className="font-semibold pl-7">
              Email
            </Table.HeadCell>
            <Table.HeadCell className="font-semibold">
              Position
            </Table.HeadCell>
            <Table.HeadCell className="font-semibold pl-10">
              Action
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {paginatedInstructors.map((instructor) => (
              <Table.Row key={instructor.instructorId} className="border-b">
                <Table.Cell className="flex items-center text-center gap-2">
                  <Avatar
                    img={instructor.image}
                    alt={instructor.name}
                    rounded
                    size="md"
                    className="w-12 h-12"
                    rounded
                    size="md"
                    className="w-12 h-12"
                  />
                  <div className="font text-gray-700 font-medium">{instructor.name}</div>
                </Table.Cell>
                <Table.Cell className='text-gray-700 font-semibold'>{instructor.emailId}</Table.Cell>
                <Table.Cell className='text-gray-700 font-semibold'>{instructor.position}</Table.Cell>
                <Table.Cell className='text'>
                  <button 
                    className='flex justify-center items-center px-4 py-2 rounded font-semibold'
                    style={{
                      backgroundColor: InstitutionData.LightPrimaryColor,
                    }}
                    onClick={() => handleEditClick(instructor)}
                  >
                    <Edit height={16} />
                    Edit
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Updated Pagination Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, instructorList.length)} of {instructorList.length} results
          </div>
          <div className="flex overflow-x-auto sm:justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(instructorList.length / itemsPerPage)}
              onPageChange={(value) => setCurrentPage(value)}
              showIcons
              layout="pagination"
              className="text-gray-500 font-medium"
            />
          </div>
        </div>

        {/* Edit Modal */}
        <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
          <Modal.Header>Edit Instructor</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="emailId"
                  value={editForm.emailId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  name="position"
                  value={editForm.position}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primaryColor focus:ring-primaryColor"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white rounded-md"
                  style={{
                    backgroundColor: InstitutionData.PrimaryColor,
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default InstructorList;
