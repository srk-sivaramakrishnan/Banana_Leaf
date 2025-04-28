'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Leaf, 
  LayoutDashboard, 
  Microscope, 
  MessageSquare, 
  Beaker, 
  Settings, 
  Key, 
  Headphones, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

// Define a type for the menu items
interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  id: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState('');

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', id: 'dashboard' },
    { name: 'Leaf Detection', icon: Microscope, path: '/dashboard/leaf-detection', id: 'leaf-detection' },
    { name: 'Chatbot', icon: MessageSquare, path: '/dashboard/chatbot', id: 'chatbot' },
    { name: 'Fertilizers', icon: Beaker, path: '/dashboard/fertilizers', id: 'fertilizers' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings', id: 'settings' },
    { name: 'API Access', icon: Key, path: '/dashboard/api-access', id: 'api-access' },
    { name: 'Support', icon: Headphones, path: '/dashboard/support', id: 'support' },
  ];

  // Update activeItem based on the current pathname
  useEffect(() => {
    const currentItem = menuItems.find(item => item.path === pathname);
    setActiveItem(currentItem ? currentItem.id : '');
  }, [pathname]);

  // Check window size on mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Function to render menu item with tooltip when collapsed
  const renderMenuItem = (item: MenuItem, isSectionStart = false) => {
    const isActive = activeItem === item.id;

    return (
      <li key={item.id} className={isSectionStart ? 'mt-2' : ''}>
        <div className="relative">
          <Link 
            href={item.path}
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 shadow-sm' 
                : 'hover:bg-gray-50'
            }`}
            onMouseEnter={() => collapsed && setHovered(item.id)}
            onMouseLeave={() => collapsed && setHovered(null)}
          >
            <div className={`relative ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
              <item.icon 
                size={19} 
                className={`${isActive ? 'stroke-[2px]' : 'stroke-[1.5px]'} transition-all duration-200`} 
              />
              {isActive && !collapsed && (
                <span className="absolute -left-2 -top-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
              )}
            </div>
            {!collapsed && (
              <span className={`text-sm transition-all ${isActive ? 'font-medium' : ''}`}>
                {item.name}
              </span>
            )}
          </Link>

          {/* Tooltip when sidebar is collapsed and item is hovered */}
          {collapsed && hovered === item.id && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white z-50 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap border border-gray-100">
              {item.name}
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 transform rotate-45 w-3 h-3 bg-white border-l border-t border-gray-100"></div>
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-white border-r border-gray-100 text-gray-800 min-h-screen flex flex-col relative transition-all duration-300 ease-in-out`}>
      <div className={`${collapsed ? 'justify-center py-6' : 'p-6'} border-b border-gray-100 flex items-center`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
            <Leaf className="text-white" size={20} />
          </div>
          {!collapsed && <h2 className="text-xl font-bold text-gray-800 tracking-tight">BananaLeaf AI</h2>}
        </div>
      </div>

      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white rounded-full p-1.5 border border-gray-200 shadow-sm z-10 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-200"
      >
        {collapsed ? 
          <ChevronRight size={16} className="text-gray-600" /> : 
          <ChevronLeft size={16} className="text-gray-600" />
        }
      </button>

      <nav className={`flex-1 ${collapsed ? 'p-3' : 'p-5'} overflow-y-auto`}>
        <div className="mb-8">
          {!collapsed && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">MAIN MENU</p>}
          <ul className="space-y-2">
            {menuItems.slice(0, 7).map((item) => renderMenuItem(item))}
          </ul>
        </div>
      </nav>

      <div className={`${collapsed ? 'p-3' : 'p-5'} border-t border-gray-100`}>
        <Link
          href="/admin"
          className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors`}
          onMouseEnter={() => collapsed && setHovered('back')}
          onMouseLeave={() => collapsed && setHovered(null)}
        >
          <LogOut size={19} className="text-red-500" />
          {!collapsed && <span className="text-sm">Back</span>}
        </Link>

        {/* Back tooltip when sidebar is collapsed */}
        {collapsed && hovered === 'back' && (
          <div className="absolute left-full ml-2 bottom-12 bg-white z-50 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap border border-gray-100">
            Back
            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 transform rotate-45 w-3 h-3 bg-white border-l border-t border-gray-100"></div>
          </div>
        )}
      </div>
    </aside>
  );
}