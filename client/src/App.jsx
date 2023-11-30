import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import store from './store/index'
import LoginUser from './pages/Login';
import SignupUser from './pages/SignUp';
import BookList from './pages/BookList';
import AdminLogList from './pages/AdminLogList';
import RegisterBook from './pages/RegisterBook';
import RegisterGenre from './pages/RegisterGenre';
import AdminBookRecord from './pages/AdminBookRecord';


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
        <Route path="/" element={<LoginUser />} />
        <Route path="/sign-up" element={<SignupUser />} />
        <Route path="/admin/book-list" element={<BookList />} />
        <Route path="/admin/admin-log" element={<AdminLogList />} />
        <Route path="/admin/register-book" element={<RegisterBook />} />
        <Route path="/admin/register-genre" element={<RegisterGenre />} />
        <Route path="/admin/book-records" element={<AdminBookRecord />} />
      </Routes>
    </Router>
  )
}

export default App;