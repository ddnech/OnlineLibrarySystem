import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SignupUser() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const initialValues = {
    username: "",
    email: "",
    fullName: "",
    address: "",
    password: "",
    confirmPassword: "",
  };
  const pwdRgx = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$/;

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    fullName: Yup.string().required("Full is required"),
    email: Yup.string()
      .email("Please use a valid email format")
      .required("Email is required"),
    address: Yup.string().required("Address is required"),
    password: Yup.string()
      .matches(pwdRgx, "At least 8 chars, 1 caps, and 1 number")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
    try {
        const response = await axios.post(
            "http://localhost:8000/api/auth/register",
            values
        );

        if (response.status === 201) {
            resetForm();
            setStatus({ success: true, message: "Sign up successful!" });
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
    } catch (error) {
        const response = error.response;
        if (response && response.status === 400) {
            const { errors } = response.data;
            const errorMessage = errors[0].msg;
            console.log(errorMessage);
            setStatus({ success: false, message: errorMessage });
        } else if (response && response.status === 500) {
            setStatus({ success: false, message: "Internal Server Error" });
        } else {
            setStatus({ success: false, message: "An unexpected error occurred" });
        }
    } finally {
        setSubmitting(false);
    }
};


  return (
    <div className="grid justify-center mt-3">
      <div className="w-screen grid grid-flow-row justify-center">
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form>
                <div className="grid grid-flow-row gap-1 justify-center">
                  <h3 className="w-72 text-xl text-center font-josefin mt-4 text-jetblack tracking-wide font-semibold sm:text-2xl">
                    Sign Up
                  </h3>
                  <h3 className="text-xs text-center font-josefin mb-4 text-jetblack tracking-wide sm:text-sm">
                    Please fill in the information below:
                  </h3>
                  <div className="w-full grid grid-flow-row gap-3">
                    {status && status.success && (
                      <p className="font-ysa text-center text-greenn">
                        {status.message}
                      </p>
                    )}
                    {status && !status.success && (
                      <p className="font-ysa text-center text-red-500">
                        {status.message}
                      </p>
                    )}
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type="text"
                        name="username"
                        placeholder="Username"
                      />
                    </div>
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="fullName"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type="email"
                        name="email"
                        placeholder="Email"
                      />
                    </div>
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type="text"
                        name="address"
                        placeholder="Address"
                      />
                    </div>
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                      />
                    </div>
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                  <div className="grid grid-flow-col justify-start">
                    <button
                      type="password"
                      onClick={togglePassword}
                      className="border-none"
                    >
                      {showPassword ? (
                        <AiOutlineEye size={15} />
                      ) : (
                        <AiOutlineEyeInvisible size={15} />
                      )}
                    </button>
                  </div>
                  <button
                    className="w-full py-2 my-4 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Create My Account
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="text-center text-xs font-josefin tracking-wide  mb-6">
          <p>
            Already a user?
            <button className="m-1">
              <span className="p-1 hover:border-b-2 hover:border-darkgreen font-semibold">
                <Link to="/">Log In!</Link>
              </span>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
