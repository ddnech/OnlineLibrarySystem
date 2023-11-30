import AdminNavbarDashboard from "../components/navbar/NavbarAdminDashboard";
import BookRecords from "../components/BookRecord";


function AdminBookRecord() {


  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <AdminNavbarDashboard />
      </div>
      <div>
        <div className="p-4 flex flex-col justify-center items-center">
          <div className="flex flex-wrap gap-1 md:flex-row md:flex-nowrap sm:gap-10">
          <div className="w-full">
            <BookRecords/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBookRecord;