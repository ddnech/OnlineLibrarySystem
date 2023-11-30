import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function RegisterNewBook() {
  const token = useSelector((state) => state.auth.token);
  const [image, setImage] = useState("");
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/book/genre");
        setGenres(res.data.data);
      } catch (error) {
        console.error("Error fetching genres:", error.response?.data || error);
      }
    };

    fetchGenres();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setIsImageSelected(true);
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    const { title, author, isbn, publishedYear, genreId, quantity } = values;

    if (!isImageSelected) {
      setStatus({ success: false, message: "Please select an image." });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("isbn", isbn);
    formData.append("publishedYear", publishedYear);
    formData.append("genreId", genreId);
    formData.append("quantity", quantity);
    formData.append("imgBook", image);

    try {
      const res = await axios.post("http://localhost:8000/api/book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus({ success: true, message: "Book registered successfully." });
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      const errorMessage = error.response?.data?.errors?.[0]?.msg || "Failed to register book.";
  setStatus({ success: false, message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .max(50, "Title must not exceed 50 characters")
      .required("Title is required"),
    author: Yup.string()
      .max(50, "Author must not exceed 50 characters")
      .required("Author is required"),
    isbn: Yup.string()
      .max(20, "ISBN must not exceed 20 characters")
      .required("ISBN is required"),
    publishedYear: Yup.number()
      .typeError("Published year must be a valid number")
      .required("Published year is required"),
    genreId: Yup.number().required("Genre is required"),
    quantity: Yup.number()
      .min(1, "Quantity must be at least 1")
      .max(999, "Quantity must not exceed 999")
      .typeError("Quantity must be a valid number")
      .required("Quantity is required"),
  });

  const initialValues = {
    title: "",
    author: "",
    isbn: "",
    publishedYear: "",
    genreId: "",
    quantity: "",
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
                  {status && (
                    <p
                      className={`text-center ${
                        status.success ? "text-greenn" : "text-red-500"
                      }`}
                    >
                      {status.message}
                    </p>
                  )}
                  <h3 className="text-xs text-center font-josefin mb-4 text-jetblack tracking-wide sm:text-base">
                    Please fill the book information:
                  </h3>
                  <div className="w-full grid grid-flow-row gap-3">
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type="text"
                        name="title"
                        placeholder="Title"
                      />
                    </div>
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="author"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type="text"
                        name="author"
                        placeholder="Author"
                      />
                    </div>
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="isbn"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type="text"
                        name="isbn"
                        placeholder="ISBN"
                      />
                    </div>
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="publishedYear"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type="number"
                        name="publishedYear"
                        placeholder="Published Year"
                      />
                    </div>
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="genreId"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        as="select"
                        className="border border-gray-300 h-6 py-0 text-xs w-full focus:border-darkgreen focus:ring-0"
                        name="genreId"
                      >
                        <option value="">Select Genre</option>
                        {genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.genreName}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="font-ysa relative mt-4">
                      <ErrorMessage
                        name="quantity"
                        component="div"
                        className="text-red-500 text-xs absolute -top-5"
                      />
                      <Field
                        className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        min="1"
                      />
                    </div>
                    <label className="font-ysa relative text-jetblack">
                      Image:
                    </label>
                    <input
                      className="border border-gray-300 h-9 text-xs w-full focus:border-darkgreen focus:ring-0"
                      type="file"
                      onChange={handleImageChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 my-4 text-xs font-josefin tracking-wide border bg-darkgreen text-flashwhite hover:bg-white hover:text-darkgreen hover:border-darkgreen"
                  >
                    {isSubmitting ? "Registering..." : "Register"}
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
