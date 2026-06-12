export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">UniformPortal</h3>
            <p className="text-sm">
              Your one-stop shop for premium school and corporate uniforms.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-white">Catalog</a></li>
              <li><a href="/cart" className="hover:text-white">Cart</a></li>
              <li><a href="/orders" className="hover:text-white">Orders</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>support@uniformportal.com</li>
              <li>1-800-UNIFORM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} UniformPortal. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
