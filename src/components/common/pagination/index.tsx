import React from 'react';
import ArrowRightSVG from '/public/svg/arrow-right.svg';
import ArrowLeftSVG from '/public/svg/arrow-left.svg';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers: number[] = [];
  const maxPagesToShow = 5; // Number of pages to display in the middle

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getDisplayedPages = () => {
    const totalPageNumbers = maxPagesToShow + 2;
    if (totalPages <= totalPageNumbers) {
      return pageNumbers;
    }

    const sideWidth = maxPagesToShow / 2;
    const leftSide = Math.max(currentPage - sideWidth, 1);
    const rightSide = Math.min(currentPage + sideWidth, totalPages);

    const pages = [];
    if (leftSide > 1) {
      pages.push(1);
      pages.push('...');
    }

    for (let i = leftSide; i <= rightSide; i++) {
      pages.push(i);
    }

    if (rightSide < totalPages) {
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav className='mt-4 flex w-full justify-center'>
      <ul className='inline-flex w-full items-center justify-center space-x-1 rounded-lg bg-light-match p-2 dark:bg-dark-hl-2'>
        <li>
          <button
            onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage - 1);
            }}
            disabled={currentPage === 1}
            className={`rounded-lg p-2 leading-tight text-gray-400 hover:bg-gray-700 hover:text-white ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <ArrowLeftSVG />
          </button>
        </li>
        {getDisplayedPages().map((number, index) =>
          typeof number === 'number' ? (
            <li key={index}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(number);
                }}
                className={`rounded-lg px-4 py-2 text-xs leading-tight ${
                  currentPage == number
                    ? 'bg-all-blue text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {number}
              </button>
            </li>
          ) : (
            <li key={index} className='p-2 text-gray-400'>
              {number}
            </li>
          )
        )}
        <li>
          <button
            onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage + 1);
            }}
            disabled={currentPage == totalPages}
            className={`rounded-lg p-2 leading-tight text-gray-400 hover:bg-gray-700 hover:text-white ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <ArrowRightSVG />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
