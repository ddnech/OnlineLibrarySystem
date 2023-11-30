import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import DefaultPagination from "./Pagination"; 

export default function AdminActions() {
  const [adminActions, setAdminActions] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admins/admin-action?page=${currentPage}&pageSize=10&book_title=&action=`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.data) {
        setAdminActions(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to get admin actions:', error);
      setErrorMsg('Failed to fetch data.');
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  return (
    <div className="font-josefin justify-center">
      <h1 className="text-base text-center font-josefin mb-4 text-jetblack tracking-wide mt-6">Admin Log List</h1>
      {errorMsg && <div className="text-red-500">{errorMsg}</div>}
      <div className="border p-4 rounded shadow mb-4">
        {adminActions.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Action</th>
                <th className="py-3 px-6 text-left">Notes</th>
                <th className="py-3 px-6 text-left">User</th>
                <th className="py-3 px-6 text-left">Book Title</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {adminActions.map(action => (
                <tr key={action.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{formatDate(action.actionDate)}</td>
                  <td className="py-3 px-6 text-left">{action.action}</td>
                  <td className="py-3 px-6 text-left">{action.notes}</td>
                  <td className="py-3 px-6 text-left">{action.BorrowingRecord?.User.username}</td>
                  <td className="py-3 px-6 text-left">{action.BorrowingRecord?.Book.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No admin actions found.</p>
        )}
      </div>
      <div className="flex justify-center">
        <DefaultPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
