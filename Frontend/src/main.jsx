import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login, LoginAction } from './Forms/Login.jsx'
import { Register, RegisterAction } from './Forms/Signup.jsx'
import { ArticleList } from './ArticleViews/ArticleList.jsx'
import { ArticleLoader, ArticleView, PostCommentAction } from './ArticleViews/ArticleView.jsx'
import { HeaderLoader } from './Components/Header.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    hydrateFallbackElement: <div>Loading</div>,
    children: [
      {path: "/", element: <ArticleList />, loader: HeaderLoader}, // Etusivu
      {path: "/article/:id", element: <ArticleView />, loader: ArticleLoader, action: PostCommentAction}, // Yhden artikkelin näkymä
      {path: "/login", element: <Login />, action: LoginAction}, // Kirjaudu
      {path: "/signup", element: <Register />, action: RegisterAction} // Rekisteröidy
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
