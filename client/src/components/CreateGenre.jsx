import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function RegisterNewGenre() {
  const token = useSelector((state) => state.auth.token);
  const [image, setImage] = useState("");
  const [isImageSelected, setIsImageSelected] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setIsImageSelected(true);
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    const { genreName } = values;

    if (!isImageSelected) {
      setStatus({ success: false, message: "Please select an image." });
      return;
    }

    const formData = new FormData();
    formData.append("genreName", genreName);
    formData.append("imgGenre", image);

    try {
      const res = await axios.post("http://localhost:8000/api/genre", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus({ success: true, message: "Genre created successfully." });
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      const errorMessage = error.response?.data?.errors?.[0]?.msg || "Failed to create genre.";
      setStatus({ success: false, message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    genreName: Yup.string()
      .max(50, "Genre name must not exceed 50 characters")
      .required("Genre name is required"),
  });

  const initialValues = {
    genreName: "",
  };

  return (
    <div className="grid justify-center mt-3">
      <div className="w-screen grid grid-flow-row justify-center">
        <div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, status }) => (
              <Form>
                <div className="grid grid-flow-row gap-1 justify-center">
                  {status && (
                    <p className={`text-center ${status.success ? "text-green-500" : "text-red-500"}`}>
                      {status.message}
                    </p>
                  )}
                  <h3 className="text-xs text-center font-josefin mb-4 text-jetblack tracking-wide sm:text-base">
                    Please fill the genre information:
                  </h3>
                  <div className="w-full grid grid-flow-row gap-3">
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage name="genreName" component="div" className="text-red-500 text-xs absolute -top-5" />
                      <Field className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0" type="text" name="genreName" placeholder="Genre Name" />
                    </div>
                    <label className="font-ysa relative text-jetblack">Image:</label>
                    <input className="border border-gray-300 h-9 text-xs w-full focus:border-darkgreen focus:ring-0" type="file" onChange={handleImageChange} required />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-2 my-4 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen">
                    {isSubmitting ? "Creating..." : "Create"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
