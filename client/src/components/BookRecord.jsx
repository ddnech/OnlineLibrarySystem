import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';

export default function BookRecords() {
  const [bookRecords, setBookRecords] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/book/records?page=1&pageSize=10&genre_id=&book_title=", {
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

  const handleApproveBorrow = async (recordId) => {
    try {
      await axios.patch(`http://localhost:8000/api/admins/approve-borrow/${recordId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchData(); 
    } catch (error) {
      console.error('Error approving borrow:', error);
    }
  };

  const handleApproveReturn = async (recordId) => {
    try {
      await axios.patch(`http://localhost:8000/api/admins/approve-return/${recordId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchData();
    } catch (error) {
      console.error('Error approving return:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="font-josefin p-4">
      <h1 className="text-lg text-center mb-6 font-semibold">Book Records</h1>
      {errorMsg && <div className="text-red-500 text-center mb-4">{errorMsg}</div>}

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">User</th>
            <th className="py-3 px-6 text-left">Book Title</th>
            <th className="py-3 px-6 text-center">Borrow Date</th>
            <th className="py-3 px-6 text-center">Due Date</th>
            <th className="py-3 px-6 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {bookRecords.map((record) => (
            <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{record.User.username}</td>
              <td className="py-3 px-6 text-left">{record.Book.title}</td>
              <td className="py-3 px-6 text-center">{formatDate(record.borrowDate)}</td>
              <td className="py-3 px-6 text-center">{formatDate(record.dueDate)}</td>
              <td className="py-3 px-6 text-center">
                {record.bookStatus === "Pending" ? (
                  <button onClick={() => handleApproveBorrow(record.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Approve Borrow</button>
                ) : record.bookStatus === "Return Pending" ? (
                  <button onClick={() => handleApproveReturn(record.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Approve Return</button>
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
