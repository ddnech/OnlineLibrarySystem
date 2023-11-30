import AdminNavbarDashboard from "../components/navbar/NavbarAdminDashboard";
import RegisterNewBook from "../components/CreateBook";




function RegisterBook() {


  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <AdminNavbarDashboard />
      </div>
      <div>
        <div className="p-4 flex flex-col justify-center items-center">
          <div className="flex flex-wrap gap-1 md:flex-row md:flex-nowrap sm:gap-10">
          <div className="w-full">
            <RegisterNewBook/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterBook;