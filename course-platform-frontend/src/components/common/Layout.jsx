import Sidebar from './Sidebar'
import Topbar from './Topbar'

const Layout = ({ children, title }) => {
  return (
    <div>
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} />
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
