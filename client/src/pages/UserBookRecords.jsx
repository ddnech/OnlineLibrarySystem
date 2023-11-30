import UserBookRecord from "../components/UserBookRecord";
import UserNavbarDashboard from "../components/navbar/NavbarUserDashboard";



function UserBookRecords() {

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <UserNavbarDashboard />
      </div>
      <div>
        <div className="p-4 flex flex-col justify-center items-center">
          <div className="flex flex-wrap gap-1 md:flex-row md:flex-nowrap sm:gap-10">
          <div className="w-full">
            <UserBookRecord/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserBookRecords;