import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import store from './store/index'
import LoginUser from './pages/Login';
import SignupUser from './pages/SignUp';
import AdminBookList from './pages/AdminBookList';
import AdminLogList from './pages/AdminLogList';
import RegisterBook from './pages/RegisterBook';
import RegisterGenre from './pages/RegisterGenre';
import AdminBookRecord from './pages/AdminBookRecord';
import UserBookList from './pages/UserBookList';
import UserProfile from './pages/UserProfile';
import UserBookRecords from './pages/UserBookRecords';


function App() {

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<LoginUser />} />
        <Route path="/sign-up" element={<SignupUser />} />

        {/* ADMIN */}
        <Route path="/admin/book-list" element={<AdminBookList />} />
        <Route path="/admin/admin-log" element={<AdminLogList />} />
        <Route path="/admin/register-book" element={<RegisterBook />} />
        <Route path="/admin/register-genre" element={<RegisterGenre />} />
        <Route path="/admin/book-records" element={<AdminBookRecord />} />

        {/* USER */}
        <Route path="/user/book-list" element={<UserBookList />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/book-records" element={<UserBookRecords />} />


      </Routes>
    </Router>
  )
}

export default App;