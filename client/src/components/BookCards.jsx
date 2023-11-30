import React, { useState, useEffect } from "react";

import axios from "axios";
import DefaultPagination from "./Pagination";

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchGenres();
    fetchData();
  }, [currentPage, selectedGenre, searchTerm]);

  const fetchGenres = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/book/genre");
      setGenres(res.data.data);
    } catch (error) {
      console.error("Error fetching genres:", error.response?.data || error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/book?page=${currentPage}&pageSize=9&genre_id=${selectedGenre}&book_title=${searchTerm}`
      );
      setBooks(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleImageError = (event) => {
    event.target.src =
      "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex justify-between p-4 w-full">
        <input
          type="text"
          className="border border-gray-300 h-6 text-xs w-full mr-2 focus:border-darkgreen focus:ring-0 p-2"
          placeholder="Search by book title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: "3" }}
        />
        <select
          className="border border-gray-300 h-6 py-0 text-xs w-full focus:border-darkgreen focus:ring-0"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{ flex: "1" }}
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.genreName}
            </option>
          ))}
        </select>
      </div>

      {books.length === 0 ? (
        <div className="w-full font-josefin text-xl text-center mx-auto my-5">
          No books found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex justify-around sm:flex-wrap gap-2 my-1 mx-auto sm:w-[15rem] md:w-[24rem]"
            >
              <div
                className={`mx-auto bg-white w-full h-full flex flex-col text-jetblack p-2 hover:bg-flashwhite`}
              >
                <div className="w-full">
                  <img
                    className="w-20 h-20 justify-center mx-auto m-2 object-cover"
                    src={`http://localhost:8000${book.bookImg}`}
                    onError={handleImageError}
                    alt={book.title}
                  />
                </div>
                <div className="flex flex-col text-center gap-2 mt-2">
                  <div className="flex-1 font-lora text-base">{book.title}</div>
                  <div className="font-josefin">
                    {book.Genre?.genreName || "Unknown Genre"}
                  </div>
                  <div className="flex-1 font-lora text-base">{book.isbn}</div>
                  <div className="font-lora text-xs mx-auto mt-3 h-full grow-0 w-full">
                    <table className="mx-auto">
                      <tbody>
                        <tr>
                          <td className="border-r-2 border-gray-200 px-4">
                            {"Available: " + book.avalaible}
                          </td>
                          <td className="px-4 overflow-auto">
                            {"Quantity: " + book.quantity}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="m-4 p-4 flex justify-center">
        <DefaultPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}
