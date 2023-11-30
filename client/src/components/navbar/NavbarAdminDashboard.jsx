import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminNavbarDashboard() {
    const location = useLocation();

    const isCurrentRoute = (routePath) => {
        return location.pathname === routePath;
    };

    return (
        <div>
            <div className="bg-blue-900 w-screen h-8 flex content-center text-white">
                <div className="basis-1/4 hidden md:block">
                    <Link to="/" className=" px-5 font-chivo">
                        <span className="font-lora font-semibold text-lg text-white">
                            Book.Com
                        </span>
                    </Link>
                </div>
                <div className="w-screen md:w-full md:basis-3/4 text-right text-white">
                    <span className="justify-between px-5 hidden h-full md:flex">
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/admin/book-list") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/admin/book-list" className="text-xs font-josefin">
                                Book List
                            </Link>
                        </span>
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/admin/admin-log") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/admin/admin-log" className="text-xs font-josefin">
                                Admin Log
                            </Link>
                        </span>
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/admin/register-book") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/admin/register-book" className="text-xs font-josefin">
                                Register Book
                            </Link>
                        </span>
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/admin/register-genre") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/admin/register-genre" className="text-xs font-josefin">
                                Register Genre
                            </Link>
                        </span>
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/admin/book-records") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/admin/book-records" className="text-xs font-josefin">
                                Book Records
                            </Link>
                        </span>
                        <span className="hover:border-b-4 hover:border-gray-300 px-4">
                            <Link to="/" className="text-xs font-josefin">
                                Log Out
                            </Link>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}