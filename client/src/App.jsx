
import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin-view/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminProducts from './pages/admin-view/product'
import AdminOrders from './pages/admin-view/orders'
import AdminFeature from './pages/admin-view/feature'
import ShoppingLayout from './components/shopping-view/layout'
import NoteFound from './pages/not-found'
import ShoppingHome from './pages/shopping-view/home'
import ShoppingListing from './pages/shopping-view/listing'
import ShoppingCheckout from './pages/shopping-view/checkout'
import ShoppingAccount from './pages/shopping-view/account'
import CheckAuth from './components/common/check-auth'
import UnauthPage from './pages/unauth-page'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuthUserAction } from './store/auth-slice'
import { Skeleton } from "@/components/ui/skeleton"

function App() {
  
 
  const {isAuthenticated , user , isLoading} = useSelector(state=> state.auth)
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkAuthUserAction())
  }, [dispatch]);

  if(isLoading) return <Skeleton className="w-[800px] bg-black h-[600px]" />



  return (
    <div className="flex flex-col overflow-hidden bg-white">
     <Routes>
     {/*auth Routes */}
       <Route path='/auth' element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
        <AuthLayout />
        </CheckAuth>
       }>
         <Route path='login' element={<AuthLogin /> }/>
         <Route path='register' element={<AuthRegister /> }/>
       </Route>
     {/*auth Routes */}

      {/*Admin Routes */}
       <Route path='/admin' element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
        <AdminLayout />
        </CheckAuth>
       }>
         <Route path='dashboard' element={<AdminDashboard />}/>
         <Route path='products' element={<AdminProducts />}/>
         <Route path='orders' element={<AdminOrders />}/>
         <Route path='feature' element={<AdminFeature />}/>
       </Route>
      {/*Admin Routes */}

      {/*shopping Routes */}
      <Route path='/shop' element={
        <CheckAuth isAuthenticated={isAuthenticated} user={user}>
        <ShoppingLayout />
        </CheckAuth>
      }>
        <Route path='home' element={<ShoppingHome />} />
        <Route path='listing' element={<ShoppingListing/>} />
        <Route path='checkout' element={<ShoppingCheckout />} />
        <Route path='account' element={<ShoppingAccount />}  />
      </Route>
      {/*shopping Routes */}

      {/*Not found page */}
      <Route path='/unauth-page' element={<UnauthPage />} />
      <Route path='*' element={<NoteFound />}/>
     
       {/*Not found page */}



     </Routes>
    </div>
  )
}

export default App
