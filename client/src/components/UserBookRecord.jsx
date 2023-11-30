import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';

export default function UserBookRecord() {
  const [bookRecords, setBookRecords] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/book/records?page=1&pageSize=10", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookRecords(response.data.data);
    } catch (error) {
      console.error('Failed to fetch book records:', error);
      setErrorMsg('Failed to fetch book records.');
    }
  };

  const handleReturnRequest = async (recordId) => {
    try {
      await axios.patch(`http://localhost:8000/api/users/pending-return/${recordId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchData();
    } catch (error) {
      console.error('Error sending return request:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="font-josefin p-4">
      <h1 className="text-lg text-center mb-6 font-semibold">My Book Records</h1>
      {errorMsg && <div className="text-red-500 text-center mb-4">{errorMsg}</div>}

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Book Title</th>
            <th className="py-3 px-6 text-center">Borrow Date</th>
            <th className="py-3 px-6 text-center">Due Date</th>
            <th className="py-3 px-6 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {bookRecords.map((record) => (
            <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{record.Book.title}</td>
              <td className="py-3 px-6 text-center">{formatDate(record.borrowDate)}</td>
              <td className="py-3 px-6 text-center">{formatDate(record.dueDate)}</td>
              <td className="py-3 px-6 text-center">
                {record.bookStatus === "Borrowed" ? (
                  <button onClick={() => handleReturnRequest(record.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Mark as Returned</button>
                ) : (
                  record.bookStatus
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
