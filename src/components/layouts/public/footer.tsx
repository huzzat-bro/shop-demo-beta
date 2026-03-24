import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <span className="text-xl font-black tracking-tighter uppercase">
              Buy<span className="text-accent">Bro</span>
            </span>
            <p className="mt-3 text-sm text-primary-foreground/70">
              Premium products, minimal prices.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/products" className="hover:text-accent transition-colors">All Products</Link></li>
              <li><Link to="/products?filter=new" className="hover:text-accent transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?filter=best" className="hover:text-accent transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/auth" className="hover:text-accent transition-colors">Sign In</Link></li>
              <li><Link to="/profile" className="hover:text-accent transition-colors">My Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-accent transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Info</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><span className="cursor-default">Shipping & Returns</span></li>
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} BuyBro. All rights reserved.
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <img className="w-16" src="https://upload.wikimedia.org/wikipedia/bn/9/97/%E0%A6%A8%E0%A6%97%E0%A6%A6%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg" alt="" />
        <img className="w-16 px-3 bg-white" src="https://upload.wikimedia.org/wikipedia/bn/a/a8/%E0%A6%AC%E0%A6%BF%E0%A6%95%E0%A6%BE%E0%A6%B6%E0%A7%87%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg" alt="" />
        <img className="w-16" src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Rocket_ddbl.png" alt="" />
        <img className="w-16 bg-white px-3" src="https://upload.wikimedia.org/wikipedia/commons/0/01/First_Security_Islami_Bank_PLC.png" alt="" />
      </div>


    </footer>
  );
}
