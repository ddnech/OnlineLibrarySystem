import UserNavbarDashboard from "../components/navbar/NavbarUserDashboard";
import UserBookCards from "../components/UserBookCards";


function UserBookList() {

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <UserNavbarDashboard />
      </div>
      <div>
        <div className="p-4 flex flex-col justify-center items-center">
          <div className="flex flex-wrap gap-1 md:flex-row md:flex-nowrap sm:gap-10">
          <div className="w-full">
            <UserBookCards/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserBookList;