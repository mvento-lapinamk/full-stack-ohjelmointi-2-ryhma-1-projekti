import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Login, LoginAction } from './Forms/Login.jsx'
import { Register, RegisterAction } from './Forms/Signup.jsx'
import { ArticleList, ArticleListLoader } from './ArticleViews/ArticleList.jsx'
import { ArticleLoader, ArticleView, PostCommentAction } from './ArticleViews/ArticleView.jsx'
import { HeaderLoader, LogoutAction } from './Components/Header.jsx'
import { CreateArticle, CreateArticleAction, CreateArticleLoader } from './ArticleViews/CreateArticle.jsx'
import { ErrorPage } from './CustomException/ErrorPage.jsx'
import { UserControl, UserControlLoader } from './Admin/UserControl.jsx'
import { ProfileView, ProfileViewAction } from './ProfileView/ProfileView.jsx'

const router = createBrowserRouter([
  {
    id: "root",
    element: <App />,
    loader: HeaderLoader,
    hydrateFallbackElement: <div>Loading</div>,
    children: [
      {path: "/", element: <ArticleList />, loader: ArticleListLoader, errorElement: <ErrorPage />}, // Etusivu
      {path: "/login", element: <Login />, action: LoginAction}, // Kirjaudu
      {path: "/logout", action: LogoutAction}, // Kirjaudu ulos
      {path: "/signup", element: <Register />, action: RegisterAction}, // Rekisteröidy
      {path: "/article/:id", element: <ArticleView />, loader: ArticleLoader, action: PostCommentAction}, // Yhden artikkelin näkymä
      {path: "/article/create", element: <CreateArticle />, action: CreateArticleAction, loader: CreateArticleLoader, errorElement: <ErrorPage />}, // Luo artikkeli näkymä
      {path: "/admin/users", element: <UserControl />, loader: UserControlLoader, errorElement: <ErrorPage />}, // Adminin user hallinointi
      {path: "/my/profile", element: <ProfileView />, action: ProfileViewAction, errorElement: <ErrorPage />} // Käyttäjän oma profiilin katselu
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
