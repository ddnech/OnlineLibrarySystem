import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function UserDetail() {
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data.data);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error);
      }
    };

    fetchUserProfile();
  }, [token]);


  return (
    <div className="bg-white w-full h-auto flex flex-col text-jetblack p-3 sm:w-full flex-1">
      <div className="flex flex-col text-center gap-4 mt-4">
        <div className="flex-1 font-lora text-2xl">{user.username}</div>
        <div className="font-josefin text-lg">Email: {user.email}</div>
        <div className="font-josefin text-lg">Address: {user.address}</div>
        <div className="font-josefin text-lg">Full Name: {user.fullName}</div>
        {user.BorrowingRecords && user.BorrowingRecords.length > 0 && (
          <div className="font-josefin text-lg">
            Latest Borrowing Record Status: {user.BorrowingRecords[0].bookStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
