import { JSX } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: PaginationProps) => {
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages: JSX.Element[] = [];
    const maxPageDisplay = 3;
    const halfDisplay = Math.floor(maxPageDisplay / 2);

    let startPage = Math.max(1, currentPage - halfDisplay);
    let endPage = Math.min(totalPages, currentPage + halfDisplay);

    if (currentPage <= halfDisplay) {
      endPage = Math.min(totalPages, maxPageDisplay);
    } else if (currentPage + halfDisplay >= totalPages) {
      startPage = Math.max(1, totalPages - maxPageDisplay + 1);
    }

    if (startPage > 1) {
      pages.push(
        <span
          key={1}
          className="mx-1 flex !items-center px-[12px] text-[16px] rounded-md transition text-black cursor-pointer bg-black/5 hover:bg-black/15"
          onClick={() => paginate(1)}
        >
          1
        </span>
      );
      if (startPage > 2) {
        pages.push(
          <span key="left-dots" className="mx-1 text-black">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <span
          key={i}
          className={`mx-1 flex !items-center px-[12px] text-[16px] rounded-md transition text-black cursor-pointer ${
            i === currentPage
              ? "bg-primary hover:bg-primary !text-white"
              : "bg-black/5 hover:bg-black/15"
          }`}
          onClick={() => paginate(i)}
        >
          {i}
        </span>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="right-dots" className="mx-1 text-black">
            ...
          </span>
        );
      }
      pages.push(
        <span
          key={totalPages}
          className="mx-1 flex !items-center px-[12px] text-[16px] rounded-md transition text-black cursor-pointer bg-black/5 hover:bg-black/15"
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </span>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-end gap-1 w-fit my-4 float-right">
      <span
        className="bg-black/5 my-auto py-[5px] mr-2 w-[30px] rounded-full cursor-pointer hover:bg-black/15 px-auto"
        onClick={handlePrevPage}
      >
        <MdKeyboardArrowLeft className="w-[18px] mx-auto" />
      </span>

      {renderPageNumbers()}

      <span
        className="bg-black/5 my-auto py-[5px] ml-2 w-[30px] rounded-full cursor-pointer hover:bg-black/15 px-auto"
        onClick={handleNextPage}
      >
        <MdKeyboardArrowRight className="w-[17px] mx-auto" />
      </span>
    </div>
  );
};

export default Pagination;
