import React from 'react';
import { useDispatch } from "react-redux";
import { keep } from '../store/reducer/authSlice';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function LoginUser() {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm, setStatus }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', values);

      if (response.status === 200) {
        const { token } = response.data;

        localStorage.setItem('token', token);
        dispatch(keep(token));
        resetForm();
        setStatus({ success: true, token });
        navigate('/admin/book-list');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setFieldError('username', 'Incorrect username or password');
      setStatus({ success: false });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <div className='grid justify-center mt-3'>
        <div className='w-screen grid grid-flow-row justify-center'>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, status }) => (
              <Form className='relative'>
                <h2 className='w-72 text-xl text-center font-josefin mt-4 text-jetblack tracking-wide font-semibold sm:text-2xl'>Login</h2>
                <p className='text-xs text-center font-josefin mb-4 text-jetblack tracking-wide sm:text-sm'>Please enter your username and password:</p>
                {status && status.success && <p className='text-center text-green-500'>Login successful!</p>}
                <div className='grid grid-cols-1 mt-7 mb-1 pb-3'>
                  <div className='font-ysa relative mt-4'>
                    <ErrorMessage name='username' component='div' className='text-red-500 text-xs absolute -top-5' />
                    <Field
                      className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0'
                      type='text'
                      name='username'
                      placeholder='Username'
                    />
                  </div>
                </div>
                <div className='grid grid-cols-1 mb-4'>
                  <div className='font-ysa relative mt-4'>
                    <ErrorMessage name='password' component='div' className='text-red-500 text-xs absolute -top-5' />
                    <Field
                      className='border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0'
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      placeholder='Password'
                    />
                    <div className='pt-2 pl-1'>
                      <button
                        type='button'
                        onClick={togglePasswordVisibility}
                        className='text-gray-500 focus:outline-none'
                      >
                        {showPassword ? <AiOutlineEye size={15} /> : <AiOutlineEyeInvisible size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className='w-full py-2 my-4 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen'
                  type='submit'
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
                <div className='text-center text-xs font-josefin tracking-wide  mb-6'>
                  <p>
                    Don't have an account?
                    <button className='m-1'>
                      <span className='p-1 hover:border-b-2 hover:border-darkgreen font-semibold'><Link to='/sign-up'>Create one</Link></span>
                    </button>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}