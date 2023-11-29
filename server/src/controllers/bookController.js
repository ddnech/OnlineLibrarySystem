// const db = require("../models");

// module.exports = {
//   async registerBook(req, res) {
//     const { title, author, isbn, publishedYear, genreId, quantity,avalaible } =
//       req.body;
//     const image = req.file;

//     const t = await db.sequelize.transaction();

//     try {

//       const newBook = await db.Product.create(
//         {
//           title,
//           author,
//           isbn,
//           publishedYear,
//           genreId,
//           quantity,
//           avalaible:quantity
//         },
//         { transaction: t }
//       );

//       if (image) {
//         const filename = await moveUploadedFilesToDestination(image);

//         const image= filename.map((filename) => ({
//           book_id: newBook.id,
//           img_book: createProductImageDBPath(filename),
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         }));

//         await db.Image_product.bulkCreate(imageObjects, { transaction: t });

//         productWithImages.images = imageObjects;
//       }

//       await t.commit();
//       return res.status(201).send({
//         message: "Book Register successfully",
//         data: productWithImage,
//       });
//     } catch (error) {
//       await t.rollback();
//       console.error("Error:", error);
//       res.status(500).json({
//         message: "Fatal error on server",
//         errors: error.message,
//       });
//     }
//   },
// };
