import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Pagination } from "flowbite-react";
import { useContext, useState } from "react";
import institutionContext from "../../Context/InstitutionContext";

export const PaginatedTable = ({ head, data, itemsPerPage = 10, ...props }) => {
  const { PrimaryColor } = useContext(institutionContext).institutionData;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get paginated data for the current page
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <Table {...props}>
        <TableHead>
          {head.map((item, i) => (
            <TableHeadCell
              key={i}
              className={`bg-lightest-primary border-lightest-primary text-left`}
            >
              {item}
            </TableHeadCell>
          ))}
        </TableHead>

        <TableBody>
          {paginatedData.map((array, i) => (
            <TableRow key={i}>
              {array.map((item, index) => (
                <TableCell
                  key={index}
                  className={`bg-lightest-primary border-lightest-primary text-left text-black py-2`}
                >
                  {item}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="my-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="flex justify-center"
          />
        </div>
      )}
    </div>
  );
};
