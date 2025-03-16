import React, { useState } from "react";
import { Pagination } from "flowbite-react";

const PaginationComponent = ({
  data,
  currentPage,
  onPageChange,
  itemsPerPage = 6,
  showIcons = true,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
        <span className="font-medium">{Math.min(endIndex, data.length)}</span>{" "}
        of <span className="font-medium">{data.length}</span> results
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showIcons={showIcons}
      />
    </div>
  );
};

export default PaginationComponent;
