import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BsShopWindow } from 'react-icons/bs'
import { RxPerson, RxExit } from 'react-icons/rx'
import { TfiClipboard } from 'react-icons/tfi'

export default function UserNavbarDashboard() {
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
                    <span className="flex justify-between px-5 h-full md:hidden">
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/myprofile") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/myprofile" className="basis-1/2 text-xs font-josefin h-4">
                                <RxPerson size={15} />
                            </Link>
                        </span>
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/myshop") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/mystore" className="basis-1/2 text-xs font-josefin h-5">
                                <BsShopWindow size={15} />
                            </Link>
                        </span>
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/mypurchase") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/mypurchase" className="basis-1/2 text-xs font-josefin h-5">
                                <TfiClipboard size={15} />
                            </Link>
                        </span>
                        <span className="hover:border-b-4 hover:border-gray-300 px-4 grid content-center">
                            <Link to="/" className="basis-1/2 text-xs font-josefin h-5">
                                <RxExit size={15} />
                            </Link>
                        </span>
                    </span>
                    <span className="justify-between px-5 hidden h-full md:flex">
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/user/book-list") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/user/book-list" className="text-xs font-josefin">
                               Library
                            </Link>
                        </span>
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/user/profile") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/user/profile" className="text-xs font-josefin">
                                My Profile
                            </Link>
                        </span>
                        <span className={`hover:border-b-4 hover:border-gray-300 px-4 grid content-center ${isCurrentRoute("/user/book-records") ? "border-b-4 border-gray-300" : ""}`}>
                            <Link to="/user/book-records" className="text-xs font-josefin">
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